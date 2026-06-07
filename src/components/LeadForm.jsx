import { useState } from 'react'
import styles from './LeadForm.module.css'

export default function LeadForm({ inline = false }) {
  const [form, setForm] = useState({ nombre: '', correo: '', edad: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre || !form.correo) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <section className={inline ? styles.inline : styles.section} id="formulario">
      <div className={inline ? styles.cardInline : styles.inner}>
        <div className={inline ? '' : styles.card}>
          <div className={styles.glowTop} />

          {!submitted ? (
            <>
              <div className={styles.header}>
                <p className={styles.eyebrow}>Comienza tu transformación</p>
                <h2 className={styles.title}>
                  Inicia tu <span className={styles.accent}>Test de Confianza</span> ahora mismo
                </h2>
                <p className={styles.sub}>
                  Completa tus datos para acceder a tu Test Inicial de Confianza Social.
                </p>
              </div>

              <div className={styles.form}>
                <div className={styles.field}>
                  <span className={styles.fieldIcon}>👤</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldIcon}>✉️</span>
                  <input
                    className={styles.input}
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldIcon}>📅</span>
                  <input
                    className={styles.input}
                    type="number"
                    name="edad"
                    placeholder="Edad (opcional)"
                    value={form.edad}
                    onChange={handleChange}
                    min="10"
                    max="100"
                  />
                </div>

                <p className={styles.privacy}>
                  🔒 Respetamos tu privacidad. No compartimos tu información.
                </p>

                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.loader} />
                  ) : (
                    <>Quiero hacer mi test gratis <span>✦</span></>
                  )}
                </button>

                <div className={styles.badges}>
                  <span>⏱ 2 minutos</span>
                  <span>🎁 Gratis</span>
                  <span>🎯 Personalizado</span>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>✦</div>
              <h3 className={styles.successTitle}>¡Listo, {form.nombre}!</h3>
              <p className={styles.successText}>
                Revisa tu correo <strong>{form.correo}</strong> — te enviamos el enlace a tu test personalizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}