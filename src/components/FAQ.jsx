import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHeader } from './Section'
import './FAQ.css'
export default function FAQ({ items, eyebrow = 'FAQ', title = 'Frequently asked <span class="gradient-text">questions</span>', lead }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <Reveal className="faq" style={{ marginTop: 40 }}>
          {items.map((f, i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={i}>
              <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-panel-${i}`}>
                <span>{f.q}</span><span className="faq__icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div id={`faq-panel-${i}`} className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
