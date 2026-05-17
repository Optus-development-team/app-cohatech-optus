import styles from "./Student.module.css";

interface StudentHeaderProps {
  userName: string;
}

export default function StudentHeader({ userName }: StudentHeaderProps) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <h1 className={styles.panelTitle}>
          Hola, <span className={styles.accentText}>{userName}</span>
        </h1>
        <p className={styles.panelSubtitle}>Gestiona tu presupuesto estudiantil</p>
      </div>
      <div className={styles.headerAvatar}>
        {userName.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}