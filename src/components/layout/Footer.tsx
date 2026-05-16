import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.2-1.6 1.6-1.6h1.6V4.7c-.8-.1-1.8-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.9v1.5H6.6V14h2.6v8h4.3Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M18.9 2H22l-6.9 7.9L23.5 22h-6.9l-5.4-7.1L4.9 22H1.8l7.5-8.6L.5 2h7l4.9 6.5L18.9 2Zm-1.2 18h1.8L6.5 3.9H4.6L17.7 20Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 3 4.2 5.9 4.2 9s-1.4 6-4.2 9c-2.8-3-4.2-5.9-4.2-9S9.2 6 12 3Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandBlock}>
            <div className={styles.brandRow}>
              
              <span className={styles.brandName}>
                Optus<span className="gradient-text">Pay</span>
              </span>
            </div>
            <p className={styles.copy}>
              Economía circular universitaria. Construyendo el futuro financiero de Bolivia.
            </p>
          </div>

          <div className={styles.linksWrap}>
            <div className={styles.links}>
              <Link href="/" className={styles.link}>Inicio</Link>
              <a href="#" className={styles.link}>Privacidad</a>
              <a href="#" className={styles.link}>Términos</a>
            </div>
            <span className={styles.copyRight}>© 2026 OptusPay · Hecho en Bolivia</span>
          </div>

          <div className={styles.socials}>
            <a href="https://www.facebook.com/optusteam/" className={styles.social} aria-label="Facebook de Optus" target="_blank" rel="noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://x.com/OptusAut" className={styles.social} aria-label="X de Optus" target="_blank" rel="noreferrer">
              <XIcon />
            </a>
            <a href="https://optus.lat" className={styles.social} aria-label="Optus Latin America" target="_blank" rel="noreferrer">
              <GlobeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
