import styles from './Hero.module.css'
import LeadForm from './LeadForm'

export default function Hero() {
  return (
    <section className={styles.hero}>
        <svg className={styles.waves} viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,200 C300,80 600,320 900,200 C1100,120 1300,280 1440,200" stroke="#7b2fff" strokeWidth="1.5" fill="none"/>
        <path d="M0,300 C200,180 500,400 800,300 C1050,220 1280,360 1440,300" stroke="#e0198c" strokeWidth="1.5" fill="none"/>
        <path d="M0,150 C350,50 700,280 1000,150 C1200,80 1350,220 1440,150" stroke="#7b2fff" strokeWidth="1" fill="none"/>
        <path d="M0,400 C250,300 550,480 850,380 C1100,300 1300,420 1440,380" stroke="#e0198c" strokeWidth="1" fill="none"/>
        <path d="M0,500 C300,420 600,560 900,480 C1150,410 1320,520 1440,480" stroke="#7b2fff" strokeWidth="0.8" fill="none"/>
        </svg>

      <div className={styles.inner}>
        {/* Columna izquierda */}
        <div className={styles.left}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>Atrévete a Hablar</span>
          </div>

          <p className={styles.eyebrow}>Test gratuito · Solo 2 minutos</p>

          <h1 className={styles.headline}>
            Descubre qué<br />
            <span className={styles.gradientText}>bloquea tu</span><br />
            confianza social
          </h1>

          <p className={styles.sub}>
            Responde honestamente y recibe un <strong>insight personalizado</strong> sobre tus bloqueos sociales — gratis, sin juicio, en minutos.
          </p>

          <div className={styles.proof}>
            <div className={styles.proofItem}>
              <span>🔒</span>
              <span>100% privado</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span>⚡</span>
              <span>Resultado inmediato</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span>🎯</span>
              <span>Personalizado</span>
            </div>
          </div>
        </div>

        {/* Columna derecha — formulario */}
        <div className={styles.right}>
          <LeadForm inline />
        </div>
      </div>
    </section>
  )
}