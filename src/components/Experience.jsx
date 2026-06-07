import { useReveal } from "../hooks/useReveal";
import "./Experience.css";

const imageModules = import.meta.glob("/images/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
});
const workshopImages = Object.values(imageModules).map((m) => m.default);

const experiences = [
  {
    id: "sca",
    company: "BCU Student Computing Association",
    shortName: "SCA",
    type: "Vice President of Software Engineering",
    period: "Present",
    status: "current",
    description:
      "Leads the Software Engineering division and manages development-focused programmes, collaborative builds, technical workshops, and project planning.",
  },
  {
    id: "innovation-labs",
    company: "Innovation Labs @ BCU",
    shortName: "IL",
    type: "Software Engineer & Media Manager",
    period: "Present",
    status: "current",
    description:
      "Building and contributing to innovative software projects alongside students, academics, and industry partners. Developing real digital solutions to real challenges, while managing media content — photography, videography, and social — to showcase the work coming out of the programme.",
  },
  {
    id: "bctsa",
    company: "Bishop Challoner Training School Alliance",
    shortName: "BC",
    type: "Internship",
    period: "22 Jun 2026 – 10 Jul 2026",
    duration: "3 weeks",
    status: "upcoming",
  },
];

// 21 positions. Corner images fill the empty diagonal spaces.
// Photo is 124×94px; ~16-20px tucked under card edge, rest visible.
const POSITIONS = [
  // Top-left corner
  { top: "-68px", left: "-28px", rot: -9 },
  // Top row — 5 centre
  { top: "-80px", left: "12%", rot: 2 },
  { top: "-78px", left: "28%", rot: -3 },
  { top: "-82px", left: "44%", rot: 5 },
  { top: "-78px", left: "60%", rot: -2 },
  { top: "-80px", left: "74%", rot: 1 },
  // Top-right corner
  { top: "-68px", right: "-48px", rot: 9 },
  // Left column — 4 (start below corner to avoid overlap)
  { top: "10px", left: "-106px", rot: 6 },
  { top: "90px", left: "-110px", rot: -7 },
  { top: "160px", left: "-106px", rot: 4 },
  { top: "222px", left: "-108px", rot: -3 },
  // Right column — 4
  { top: "14px", right: "-106px", rot: -5 },
  { top: "94px", right: "-112px", rot: 7 },
  { top: "164px", right: "-106px", rot: -4 },
  { top: "226px", right: "-100px", rot: 3 },
  // Bottom row — 6 (first/last extend past card edge to fill the corner area)
  { bottom: "-80px", left: "-1px", rot: 7 },
  { bottom: "-78px", left: "17%", rot: 3 },
  { bottom: "-82px", left: "34%", rot: -5 },
  { bottom: "-80px", left: "51%", rot: 2 },
  { bottom: "-78px", left: "68%", rot: -4 },
  { bottom: "-80px", right: "-1px", rot: -8 },
];

function CardInner({ p, showHint }) {
  return (
    <>
      <div className="experience__item-left">
        <div className="experience__monogram">{p.shortName.slice(0, 2)}</div>
      </div>
      <div className="experience__item-body">
        <div className="experience__item-top">
          <div>
            <p className="experience__company">{p.company}</p>
            <p className="experience__type">{p.type}</p>
          </div>
          <div className="experience__item-badges">
            {showHint && (
              <span className="experience__hover-hint">
                <svg width="11" height="11" viewBox="0 0 16 20" fill="currentColor">
                  <path d="M6 0a1 1 0 0 0-1 1v7.27L3.24 7.03A1.5 1.5 0 0 0 1 8.25V9c0 .28.07.56.2.8l3.5 7A3 3 0 0 0 7.38 18H11a3 3 0 0 0 3-3v-4.5a1.5 1.5 0 0 0-1.5-1.5H11V7a1 1 0 0 0-2 0v2H7V1a1 1 0 0 0-1-1Z"/>
                </svg>
                hover me
              </span>
            )}
            {p.status === "upcoming" && (
              <span className="experience__badge experience__badge--upcoming">
                <span className="experience__badge-dot" />
                Upcoming
              </span>
            )}
            {p.status === "current" && (
              <span className="experience__badge experience__badge--current">
                <span className="experience__badge-dot experience__badge-dot--current" />
                Current
              </span>
            )}
          </div>
        </div>
        <div className="experience__meta">
          <span className="experience__period">{p.period}</span>
          {p.duration && (
            <>
              <span className="experience__sep">·</span>
              <span className="experience__duration">{p.duration}</span>
            </>
          )}
        </div>
        {p.description && <p className="experience__desc">{p.description}</p>}
      </div>
    </>
  );
}

export default function Experience() {
  const ref = useReveal(0.1);

  return (
    <section id="experience" className="section experience" ref={ref}>
      <div className="container">
        <div className="experience__header reveal">
          <span className="section-eyebrow">Experience</span>
          <h2 className="section-heading">
            Roles, Internships &amp; Placements.
          </h2>
        </div>

        <div className="experience__list">
          {experiences.map((p, i) => {
            if (p.id === "innovation-labs") {
              return (
                <div
                  key={p.id}
                  className={`experience__il-wrap reveal reveal-delay-${Math.min(i + 1, 6)}`}
                >
                  <div className="experience__float-photos" aria-hidden="true">
                    {workshopImages.map((src, i) => {
                      const pos = POSITIONS[i] || {};
                      return (
                        <div
                          key={i}
                          className="experience__photo"
                          style={{
                            backgroundImage: `url(${src})`,
                            top: pos.top,
                            bottom: pos.bottom,
                            left: pos.left,
                            right: pos.right,
                            "--rot": `${pos.rot ?? 0}deg`,
                            "--float-dur": `${3.1 + (i % 5) * 0.38}s`,
                            "--float-amp": `${7 + (i % 4) * 2}px`,
                            transitionDelay: `${i * 0.022}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="experience__item glass-card experience__item--il">
                    <CardInner p={p} showHint />
                  </div>
                </div>
              );
            }
            return (
              <div
                key={p.id}
                className={`experience__item glass-card reveal reveal-delay-${Math.min(i + 1, 6)}`}
              >
                <CardInner p={p} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
