"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/abdev/reveal";
import { processStages } from "@/content/process";

type Status = "en cola" | "en proceso" | "completado";

export function ProcessPipeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ranRef = useRef(false);

  const [statuses, setStatuses] = useState<Status[]>(
    processStages.map(() => "en cola"),
  );
  const [active, setActive] = useState<boolean[]>(
    processStages.map(() => false),
  );
  const [done, setDone] = useState<boolean[]>(processStages.map(() => false));
  const [running, setRunning] = useState(false);
  const [fill, setFill] = useState(0);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [logLinesIn, setLogLinesIn] = useState(0);

  // Scroll-triggered run (once).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nodeCenters = () => {
      const wrap = wrapRef.current;
      if (!wrap) return [];
      const wr = wrap.getBoundingClientRect();
      const w = wr.width;
      return nodeRefs.current.map((n) => {
        if (!n) return 0;
        const r = n.getBoundingClientRect();
        return ((r.left + r.width / 2 - wr.left) / w) * 100;
      });
    };

    const run = () => {
      if (ranRef.current) return;
      ranRef.current = true;
      setRunning(true);
      const centers = nodeCenters();

      if (reduce) {
        setStatuses(processStages.map(() => "completado"));
        setDone(processStages.map(() => true));
        setFill(100);
        return;
      }

      const timers: ReturnType<typeof setTimeout>[] = [];
      processStages.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            setFill(centers[i] || 0);
            setActive((a) => a.map((v, j) => (j === i ? true : v)));
            setStatuses((s) =>
              s.map((v, j) => (j === i ? "en proceso" : v)),
            );
          }, 400 + i * 900),
        );
        timers.push(
          setTimeout(
            () => {
              setActive((a) => a.map((v, j) => (j === i ? false : v)));
              setDone((d) => d.map((v, j) => (j === i ? true : v)));
              setStatuses((s) =>
                s.map((v, j) => (j === i ? "completado" : v)),
              );
            },
            400 + i * 900 + 700,
          ),
        );
      });
      timers.push(
        setTimeout(() => setFill(100), 400 + processStages.length * 900),
      );
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // Animate the deploy log when stage 03 opens.
  useEffect(() => {
    if (openStage !== 2) {
      setLogLinesIn(0);
      return;
    }
    const stage = processStages[2];
    if (!stage.deployLog) return;
    setLogLinesIn(0);
    const timers = stage.deployLog.map((_, i) =>
      setTimeout(() => setLogLinesIn((n) => Math.max(n, i + 1)), 120 + i * 320),
    );
    return () => timers.forEach(clearTimeout);
  }, [openStage]);

  const toggle = (i: number) => setOpenStage((cur) => (cur === i ? null : i));

  return (
    <section id="proceso" className="sect">
      <div className="frame">
        <Reveal className="sect-head center">
          <div className="eyebrow">
            <span className="num">04</span> Proceso
          </div>
          <h2 className="h2">De la idea al producto en semanas, no meses</h2>
          <p className="h2-sub">
            Un proceso ágil con visibilidad total. Sin agencia, sin burocracia,
            sin sorpresas.
          </p>
        </Reveal>

        <Reveal
          className={`pipeline${running ? " running" : ""}`}
          as="div"
        >
          <div ref={rootRef}>
            <div className="pipe-ruler">
              <span>Semana 0</span>
              <span className="mid">
                <span className="dot-pulse" />
                De idea a producción: <span className="total">~6 semanas</span>
              </span>
              <span>Go-live</span>
            </div>

            <div style={{ position: "relative" }}>
              <div className="pipe-line-wrap" ref={wrapRef}>
                <div className="pipe-line-bg" />
                <div className="pipe-line-fill" style={{ width: `${fill}%` }} />
              </div>

              <div className="pipe-stages">
                {processStages.map((stage, i) => {
                  const cls = [
                    "pipe-stage",
                    active[i] ? "active" : "",
                    done[i] ? "done" : "",
                    openStage === i ? "open" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button
                      type="button"
                      key={stage.num}
                      className={cls}
                      data-stage={i}
                      onClick={() => toggle(i)}
                    >
                      <div
                        className="pipe-node"
                        ref={(el) => {
                          nodeRefs.current[i] = el;
                        }}
                      >
                        <span className="num">{stage.num}</span>
                        <span className="chk">
                          <Check size={15} strokeWidth={3} />
                        </span>
                      </div>
                      <div className="pipe-status">
                        <span className="s-dot" />
                        <span className="s-label">{statuses[i]}</span>
                      </div>
                      <h3>
                        {stage.title}
                        <span className="pipe-chevron">
                          <ChevronDown size={15} strokeWidth={2} />
                        </span>
                      </h3>
                      <p>{stage.desc}</p>
                      <div className="pipe-time">{stage.time}</div>
                      <div className="pipe-detail">
                        <div className="pipe-detail-inner">
                          <div className="pipe-deliver">Qué obtienes</div>
                          <ul className="pipe-list">
                            {stage.deliverables.map((d) => (
                              <li key={d}>
                                <Check size={13} strokeWidth={2.5} />
                                {d}
                              </li>
                            ))}
                          </ul>
                          {stage.deployLog && (
                            <div className="pipe-log">
                              {stage.deployLog.map((l, li) => (
                                <div
                                  key={li}
                                  className={`ln${li < logLinesIn ? " in" : ""}`}
                                >
                                  <span className={l.kind}>
                                    {l.kind === "ar"
                                      ? "→"
                                      : l.kind === "ok"
                                        ? "✓"
                                        : l.lead}
                                  </span>{" "}
                                  {l.text}
                                  {l.kind === "ok" && l.lead && (
                                    <span className="mut"> {l.lead}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
