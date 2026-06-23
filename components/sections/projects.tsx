"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects, projectsById, type ProjectId } from "@/lib/projects";
import { waLink, WA_MESSAGES } from "@/lib/contact";
import { Reveal } from "@/components/abdev/reveal";

function ProjectCard({
  id,
  onOpen,
  index,
}: {
  id: ProjectId;
  onOpen: (id: ProjectId) => void;
  index: number;
}) {
  const p = projectsById[id];
  const sizeClass =
    p.size === "feat" ? "b-feat" : p.size === "md" ? "b-md" : "b-sm";

  return (
    <button
      type="button"
      className={`b-card ${sizeClass}`}
      onClick={() => onOpen(id)}
      style={{ ["--i" as string]: index }}
    >
      <span className="b-label">{p.label}</span>
      <span className="b-go">
        <ArrowUpRight size={16} strokeWidth={1.8} />
      </span>
      <div className="b-thumb">
        <div className="b-thumb-inner">
          <div className="mock-window">
            <div className="mock-bar">
              <span className="d" />
              <span className="d" />
              <span className="d" />
              <span className="url">{p.url}</span>
            </div>
            <div className="mock-shot">
              <Image
                src={p.image}
                alt={`${p.name} — sitio web`}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="b-info">
        <div className="b-name">
          <span className={`industry-dot ind-${p.industryKey}`} />
          {p.name}
        </div>
        <p className="b-desc">{p.short}</p>
        {p.featured && (
          <div className="b-meta">
            <span className="b-meta-item">
              <span>Industria ·</span>
              <span className="v">{p.industry}</span>
            </span>
            <span className="b-meta-item">
              <span>Stack ·</span>
              <span className="v">Next.js · Supabase · WAHA · n8n</span>
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

function ProjectModal({
  id,
  onClose,
}: {
  id: ProjectId;
  onClose: () => void;
}) {
  const p = projectsById[id];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-industry">{p.industry}</div>
            <div className="modal-name">{p.name}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-shot">
            <Image src={p.image} alt={`${p.name} — sitio web`} fill sizes="760px" />
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Descripción</div>
            <p>{p.desc}</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Problema resuelto</div>
            <p>{p.problem}</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Stack tecnológico</div>
            <div className="modal-tech-grid">
              {p.tech.map((t) => (
                <div className="tech-badge" key={t}>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Funcionalidades clave</div>
            <p>{p.features}</p>
          </div>
        </div>
        <div className="modal-foot">
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ fontSize: "13px", padding: "10px 18px" }}
          >
            Ver sitio en vivo
            <span className="arrow">↗</span>
          </a>
          <a
            href={waLink(WA_MESSAGES.similarProject)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: "13px", padding: "10px 18px" }}
          >
            Quiero algo así
          </a>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<ProjectId | null>(null);

  return (
    <section id="proyectos" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">02</span> Proyectos
            </div>
            <h2 className="h2">
              Trabajo real,
              <br />
              para negocios reales
            </h2>
          </div>
          <p className="h2-sub">
            Cada caso resuelve un problema de negocio concreto y vive en
            producción. Haz click para ver la decisión técnica y el resultado.
          </p>
        </Reveal>

        <Reveal className="bento" stagger>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} id={p.id} onOpen={setOpenId} index={i} />
          ))}
        </Reveal>
      </div>

      {openId && <ProjectModal id={openId} onClose={() => setOpenId(null)} />}
    </section>
  );
}
