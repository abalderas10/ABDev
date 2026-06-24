"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";

// Mexico City is UTC-6 year-round (no DST since 2022). Building slot ISO
// strings with a fixed offset keeps the math simple and correct.
const CDMX_OFFSET = "-06:00";
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
// Business hours: Mon–Fri, 10:00–18:00 CDMX, 30-min slots (last start 17:30).
const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16, 17];
const MAX_MONTHS_AHEAD = 3;

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO string for a slot at the given CDMX wall-clock time. */
function slotIso(y: number, m: number, d: number, hh: number, mm: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${CDMX_OFFSET}`;
}

/** Today's date in CDMX as {y, m, d}. */
function cdmxToday() {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
  }).format(new Date()); // YYYY-MM-DD
  const [y, m, d] = s.split("-").map(Number);
  return { y, m: m - 1, d };
}

interface Day {
  y: number;
  m: number;
  d: number;
}

type Status = "idle" | "booking" | "done";

export function Scheduler() {
  const today = useMemo(cdmxToday, []);
  const [view, setView] = useState({ y: today.y, m: today.m });
  const [selected, setSelected] = useState<Day | null>(null);
  const [taken, setTaken] = useState<Set<number>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [confirmedWhen, setConfirmedWhen] = useState("");

  const minMonthIndex = today.y * 12 + today.m;
  const viewMonthIndex = view.y * 12 + view.m;
  const canPrev = viewMonthIndex > minMonthIndex;
  const canNext = viewMonthIndex < minMonthIndex + MAX_MONTHS_AHEAD;

  // Build the calendar grid (Monday-first).
  const cells = useMemo(() => {
    const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: (Day | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push({ y: view.y, m: view.m, d });
    return out;
  }, [view]);

  const isPast = useCallback(
    (day: Day) => {
      const a = day.y * 372 + day.m * 31 + day.d;
      const b = today.y * 372 + today.m * 31 + today.d;
      return a < b;
    },
    [today],
  );

  const isWeekend = (day: Day) => {
    const wd = new Date(day.y, day.m, day.d).getDay();
    return wd === 0 || wd === 6;
  };

  const fetchTaken = useCallback(async (day: Day) => {
    setLoadingSlots(true);
    setTaken(new Set());
    const from = slotIso(day.y, day.m, day.d, 0, 0);
    const toDate = new Date(day.y, day.m, day.d + 1);
    const to = slotIso(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate(),
      0,
      0,
    );
    try {
      const res = await fetch(
        `/api/booking?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      );
      const data = (await res.json()) as { taken?: string[] };
      setTaken(new Set((data.taken ?? []).map((s) => Date.parse(s))));
    } catch {
      setTaken(new Set());
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  function pickDay(day: Day) {
    if (isPast(day) || isWeekend(day)) return;
    setSelected(day);
    setSlot(null);
    setError("");
    fetchTaken(day);
  }

  // Slots for the selected day.
  const slots = useMemo(() => {
    if (!selected) return [];
    const now = Date.now();
    const list: { iso: string; label: string; disabled: boolean }[] = [];
    for (const h of SLOT_HOURS) {
      for (const mm of [0, 30]) {
        const iso = slotIso(selected.y, selected.m, selected.d, h, mm);
        const epoch = Date.parse(iso);
        list.push({
          iso,
          label: `${pad(h)}:${pad(mm)}`,
          disabled: taken.has(epoch) || epoch <= now,
        });
      }
    }
    return list;
  }, [selected, taken]);

  const canBook = name.trim() && contact.trim() && slot && status !== "booking";

  async function book() {
    if (!canBook) return;
    setStatus("booking");
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
          slot,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        when?: string;
        error?: string;
      };
      if (data.ok) {
        setConfirmedWhen(data.when ?? "");
        setStatus("done");
        return;
      }
      if (data.error === "slot_taken") {
        setError("Ese horario se acaba de ocupar. Elige otro, por favor.");
        setSlot(null);
        if (selected) fetchTaken(selected);
      } else if (data.error === "unconfigured") {
        setError("La agenda no está disponible por ahora. Escríbenos por WhatsApp.");
      } else {
        setError("No pudimos agendar. Intenta de nuevo o escríbenos por WhatsApp.");
      }
      setStatus("idle");
    } catch {
      setError("Error de conexión. Escríbenos por WhatsApp.");
      setStatus("idle");
    }
  }

  function reset() {
    setSelected(null);
    setSlot(null);
    setName("");
    setContact("");
    setEmail("");
    setNotes("");
    setError("");
    setConfirmedWhen("");
    setStatus("idle");
  }

  // Reset slot selection if the day changes underneath it.
  useEffect(() => {
    setSlot(null);
  }, [selected]);

  if (status === "done") {
    return (
      <div className="sched-card sched-done">
        <span className="sched-done-mark">
          <Check size={22} strokeWidth={3} />
        </span>
        <h3>Cita confirmada</h3>
        <p className="sched-done-when">{confirmedWhen} (CDMX)</p>
        <p className="sched-done-sub">
          Te llegará la confirmación
          {email ? " a tu correo" : ""}. Si diste tu correo, revisa también spam.
        </p>
        <button type="button" className="sched-reset" onClick={reset}>
          Agendar otra
        </button>
      </div>
    );
  }

  const monthLabel = `${MONTHS[view.m]} ${view.y}`;

  return (
    <div className="sched-card">
      <div className="sched-grid">
        {/* Calendar */}
        <div className="sched-cal">
          <div className="sched-cal-head">
            <span className="sched-cal-month">
              <Calendar size={14} strokeWidth={2} /> {monthLabel}
            </span>
            <div className="sched-cal-nav">
              <button
                type="button"
                aria-label="Mes anterior"
                disabled={!canPrev}
                onClick={() =>
                  setView((v) =>
                    v.m === 0
                      ? { y: v.y - 1, m: 11 }
                      : { y: v.y, m: v.m - 1 },
                  )
                }
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Mes siguiente"
                disabled={!canNext}
                onClick={() =>
                  setView((v) =>
                    v.m === 11
                      ? { y: v.y + 1, m: 0 }
                      : { y: v.y, m: v.m + 1 },
                  )
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="sched-weekdays">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <div className="sched-days">
            {cells.map((day, i) =>
              day === null ? (
                <span key={i} className="sched-day empty" />
              ) : (
                <button
                  key={i}
                  type="button"
                  className={`sched-day${
                    selected &&
                    selected.d === day.d &&
                    selected.m === day.m &&
                    selected.y === day.y
                      ? " on"
                      : ""
                  }`}
                  disabled={isPast(day) || isWeekend(day)}
                  onClick={() => pickDay(day)}
                >
                  {day.d}
                </button>
              ),
            )}
          </div>
          <p className="sched-tz">Horario del centro de México · Lun–Vie</p>
        </div>

        {/* Slots + form */}
        <div className="sched-side">
          {!selected ? (
            <div className="sched-empty">
              <Clock size={20} strokeWidth={1.6} />
              <p>Elige un día para ver los horarios disponibles.</p>
            </div>
          ) : (
            <>
              <div className="sched-side-label">
                <Clock size={13} strokeWidth={2} /> Horarios · 30 min
              </div>
              {loadingSlots ? (
                <div className="sched-slots-loading">Cargando…</div>
              ) : (
                <div className="sched-slots">
                  {slots.map((s) => (
                    <button
                      key={s.iso}
                      type="button"
                      className={`sched-slot${slot === s.iso ? " on" : ""}`}
                      disabled={s.disabled}
                      onClick={() => {
                        setSlot(s.iso);
                        setError("");
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {slot && (
                <div className="sched-form">
                  <input
                    className="cart-input"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="cart-input"
                    placeholder="WhatsApp o teléfono"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                  <input
                    className="cart-input"
                    type="email"
                    placeholder="Email (para confirmación, opcional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <textarea
                    className="cart-textarea"
                    placeholder="¿De qué quieres hablar? (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button
                    type="button"
                    className="sched-confirm"
                    disabled={!canBook}
                    onClick={book}
                  >
                    {status === "booking" ? "Agendando…" : "Confirmar cita"}
                  </button>
                </div>
              )}

              {error && <p className="sched-error">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
