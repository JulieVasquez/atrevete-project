import styles from './Benefits.module.css'

const items = [
  {
    icon: '⚡',
    color: '#7b2fff',
    title: 'Resultado inmediato',
    desc: 'Conoce tu nivel de confianza social desde el primer momento.',
  },
  {
    icon: '🎁',
    color: '#e0198c',
    title: '100% gratuito',
    desc: 'Sin costos ocultos. Tu crecimiento es nuestra misión.',
  },
  {
    icon: '🎯',
    color: '#00d4ff',
    title: 'Enfoque personalizado',
    desc: 'Recibe un insight adaptado exactamente a tu situación.',
  },
  {
    icon: '🛡️',
    color: '#9b4dff',
    title: 'Espacio seguro',
    desc: 'Responde con libertad. Aquí estás en confianza, sin juicio.',
  },
]

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.label}>¿Qué obtendrás?</p>
        <h2 className={styles.title}>
          Tu primer paso hacia<br />
          <span className={styles.accent}>hablar con más seguridad</span>
        </h2>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <div className={styles.card} key={i} style={{ '--accent': item.color }}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{item.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}