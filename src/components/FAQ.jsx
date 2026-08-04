import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHeader } from './Section'
import './FAQ.css'

/**
 * Accessible disclosure list.
 * Each question is a <button aria-expanded aria-controls>; each answer is a
 * region labelled by its question, so screen readers announce the pairing.
 */
export default function FAQ({
  items,
  eyebrow = 'FAQ',
  title = 'Frequently asked <span class="gradient-text">questions</span>',
  lead,
}) {
  const uid = useId()
  const [open, setOpen] = useState(0)

  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby={`${uid}-heading`}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} headingId={`${uid}-heading`} />
        <Reveal className="faq" style={{ marginTop: 40 }}>
          {items.map((f, i) => {
            const isOpen = open === i
            const btnId = `${uid}-q-${i}`
            const panelId = `${uid}-a-${i}`
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q}>
                <h3 className="faq__qwrap">
                  <button
                    id={btnId}
                    className="faq__q"
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span>{f.q}</span>
                    <span className="faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
