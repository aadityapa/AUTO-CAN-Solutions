/**
 * Consistent page-level enter transition.
 *
 * Driven by a CSS keyframe rather than Framer's initial/animate pair. With
 * Framer, the prerendered HTML carried `style="opacity:0"` on this wrapper, so
 * every page was invisible until React hydrated and the animation ran — which
 * threw away the first-paint benefit of prerendering for the whole document
 * and left no-JS readers with a blank page. A CSS animation starts the moment
 * the stylesheet applies, before any script executes, and still replays on
 * client-side navigation because the router mounts a fresh element.
 *
 * `will-change` is intentionally omitted — the transform is short-lived and
 * promoting every page to its own layer costs more than it saves.
 */
export default function Page({ children }) {
  return <div className="page-enter">{children}</div>
}
