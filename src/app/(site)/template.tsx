/**
 * Remounts on every route change, giving each page a quiet enter fade.
 * Opacity only — a transform here would become a containing block for the
 * hero's ScrollTrigger pin (position: fixed) and break the scrub.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
