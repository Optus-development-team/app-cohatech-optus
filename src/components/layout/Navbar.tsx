'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { getAuth, LoginResponse } from '@/services/api';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<LoginResponse['usuario'] | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setIsLoggedIn(true);
      setUser(auth.user);
    }
  }, []);

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
          {isLoggedIn && user ? (
            <li className={styles.navItem}>
              <div className={styles.userInfo}>
                <User size={18} className={styles.userIcon} />
                <span className={styles.userName}>{user.nombre}</span>
              </div>
            </li>
          ) : (
            <>
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
                  href="/login" 
                  className={styles.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.loginBox}>
                    <img src="/iconolog.png" alt="Login" className={styles.loginIcon} />
                    Login
                  </div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

