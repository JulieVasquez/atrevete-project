import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.icon}>✦</span>
          <span>Atrévete a Hablar</span>
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Atrévete a Hablar · Todos los derechos reservados
        </p>
        <p className={styles.tagline}>Entrena tu confianza. Eleva tu voz.</p>
      </div>
    </footer>
  )
}