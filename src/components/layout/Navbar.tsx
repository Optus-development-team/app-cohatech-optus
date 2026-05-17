'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <img src="/optus logo.gif" alt="OptusCocha" className={styles.logo} />
        </Link>
        
        <button 
          className={styles.toggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        <ul className={`${styles.navList} ${isOpen ? styles.open : ''}`}>
          <li className={styles.navItem}>
            <Link 
              href="/" 
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              href="/register" 
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles.loginBox}>
                <img src="/iconolog.png" alt="Login" className={styles.loginIcon} />
                Login
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

