// Fixed technical grid layer that drifts behind the content. The grain layer
// is rendered via the `.abdev-page::before` pseudo-element in abdev.css.
export function BackgroundFX() {
  return <div className="grid-bg" aria-hidden="true" />;
}
