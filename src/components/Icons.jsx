const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.6',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Ico = ({ size = 20, viewBox = '0 0 24 24', children, ...rest }) => (
  <svg width={size} height={size} viewBox={viewBox} {...base} {...rest}>
    {children}
  </svg>
)

/* ─ About ─────────────────────────────────────────────── */
export const IconHammer = (p) => (
  <Ico {...p}>
    <path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/>
    <path d="M17.64 15 22 10.64"/>
    <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 5.6a5.009 5.009 0 0 0-6.22.44L5.54 11"/>
  </Ico>
)

export const IconUsers = (p) => (
  <Ico {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </Ico>
)

export const IconStar = (p) => (
  <Ico {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </Ico>
)

/* ─ Skills ────────────────────────────────────────────── */
export const IconCode = (p) => (
  <Ico {...p}>
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </Ico>
)

export const IconServer = (p) => (
  <Ico {...p}>
    <rect x="2" y="2" width="20" height="8" rx="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </Ico>
)

export const IconDatabase = (p) => (
  <Ico {...p}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </Ico>
)

export const IconTerminal = (p) => (
  <Ico {...p}>
    <polyline points="4 17 10 11 4 5"/>
    <line x1="12" y1="19" x2="20" y2="19"/>
  </Ico>
)

export const IconShield = (p) => (
  <Ico {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </Ico>
)

export const IconCpu = (p) => (
  <Ico {...p}>
    <rect x="9" y="9" width="6" height="6"/>
    <rect x="2" y="2" width="20" height="20" rx="2"/>
    <line x1="9" y1="2" x2="9" y2="9"/><line x1="15" y1="2" x2="15" y2="9"/>
    <line x1="9" y1="15" x2="9" y2="22"/><line x1="15" y1="15" x2="15" y2="22"/>
    <line x1="2" y1="9" x2="9" y2="9"/><line x1="2" y1="15" x2="9" y2="15"/>
    <line x1="15" y1="9" x2="22" y2="9"/><line x1="15" y1="15" x2="22" y2="15"/>
  </Ico>
)

/* ─ Projects ──────────────────────────────────────────── */
export const IconBuilding = (p) => (
  <Ico {...p}>
    <rect x="3" y="2" width="18" height="20" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <line x1="8" y1="7" x2="8.01" y2="7"/>
    <line x1="12" y1="7" x2="12.01" y2="7"/>
    <line x1="16" y1="7" x2="16.01" y2="7"/>
    <line x1="8" y1="11" x2="8.01" y2="11"/>
    <line x1="12" y1="11" x2="12.01" y2="11"/>
    <line x1="16" y1="11" x2="16.01" y2="11"/>
    <line x1="8" y1="15" x2="8.01" y2="15"/>
    <line x1="12" y1="15" x2="12.01" y2="15"/>
    <line x1="16" y1="15" x2="16.01" y2="15"/>
  </Ico>
)

export const IconGlobe = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </Ico>
)

export const IconCheckSquare = (p) => (
  <Ico {...p}>
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </Ico>
)

export const IconGrid = (p) => (
  <Ico {...p}>
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </Ico>
)

export const IconPlay = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8"/>
  </Ico>
)

/* ─ Education ─────────────────────────────────────────── */
export const IconGradCap = (p) => (
  <Ico {...p}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </Ico>
)

/* ─ Achievements ──────────────────────────────────────── */
export const IconTrophy = (p) => (
  <Ico {...p}>
    <line x1="12" y1="17" x2="12" y2="22"/>
    <path d="M5 17h14"/>
    <path d="M7 5h10v8a5 5 0 0 1-10 0V5z"/>
    <path d="M7 5H5a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1"/>
    <path d="M17 5h2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1"/>
  </Ico>
)

export const IconFlask = (p) => (
  <Ico {...p}>
    <path d="M9 3h6l1 9H8L9 3z"/>
    <path d="M6.5 20a5.5 5.5 0 0 1 11 0H6.5z"/>
    <line x1="9" y1="3" x2="8" y2="12"/>
    <line x1="15" y1="3" x2="16" y2="12"/>
  </Ico>
)

export const IconLayers = (p) => (
  <Ico {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </Ico>
)

export const IconShieldCheck = (p) => (
  <Ico {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </Ico>
)

/* ─ Certificates ──────────────────────────────────────── */
export const IconLock = (p) => (
  <Ico {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </Ico>
)

export const IconUserX = (p) => (
  <Ico {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="17" y1="8" x2="23" y2="14"/>
    <line x1="23" y1="8" x2="17" y2="14"/>
  </Ico>
)

export const IconCloud = (p) => (
  <Ico {...p}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </Ico>
)

export const IconKey = (p) => (
  <Ico {...p}>
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2 11.58 11.42"/>
    <path d="M20 8 11 17"/>
    <path d="M16 4 7 13"/>
  </Ico>
)

export const IconActivity = (p) => (
  <Ico {...p}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </Ico>
)

export const IconSearch = (p) => (
  <Ico {...p}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </Ico>
)

export const IconZap = (p) => (
  <Ico {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </Ico>
)

export const IconWifi = (p) => (
  <Ico {...p}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </Ico>
)

/* ─ Contact ───────────────────────────────────────────── */
export const IconMail = (p) => (
  <Ico {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </Ico>
)

export const IconMapPin = (p) => (
  <Ico {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </Ico>
)

export const IconLinkedIn = ({ size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export const IconGitHub = ({ size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

/* ─ Navigation / misc ─────────────────────────────────── */
export const IconArrowRight = (p) => (
  <Ico {...p}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </Ico>
)

export const IconExternal = (p) => (
  <Ico {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </Ico>
)

export const IconSparkle = (p) => (
  <Ico {...p}>
    <path d="M12 3c.3 3.1 1 5.9 3.5 7.5C17 12 20 12 20 12s-3 0-4.5 1.5C14 15.1 13.3 17.9 13 21c-.3-3.1-1-5.9-3.5-7.5C8 12 5 12 5 12s3 0 4.5-1.5C10.9 9.1 11.7 6.1 12 3z"/>
  </Ico>
)

export const IconMedal = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="15" r="6"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    <path d="M15 6.5V6a3 3 0 0 0-6 0v.5"/>
    <path d="M8.21 6.64C6.61 7.67 5.5 9.19 5.5 12a6 6 0 0 0 1.14 3.48"/>
    <path d="M15.79 6.64C17.39 7.67 18.5 9.19 18.5 12a6 6 0 0 1-1.14 3.48"/>
  </Ico>
)
