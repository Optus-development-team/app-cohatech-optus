'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { clearAuth, getAuth, LoginResponse } from '@/services/api';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<LoginResponse['usuario'] | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setIsLoggedIn(true);
      setUser(auth.user);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsOpen(false);
    window.location.href = "/login";
  };

  const userActionLabel = user?.tipo_usuario === "comercio" ? "Desvincularse" : "Salir";

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
            <li className={styles.navItem} ref={menuRef}>
              <button
                type="button"
                className={styles.userButton}
                onClick={() => setIsUserMenuOpen((value) => !value)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <div className={styles.userInfo}>
                  <User size={18} className={styles.userIcon} />
                  <span className={styles.userName}>{user.nombre}</span>
                </div>
                <ChevronDown size={16} className={`${styles.chevron} ${isUserMenuOpen ? styles.chevronOpen : ''}`} />
              </button>

              <div className={`${styles.userMenu} ${isUserMenuOpen ? styles.userMenuOpen : ''}`} role="menu">
                <button
                  type="button"
                  className={styles.userMenuItem}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>{userActionLabel}</span>
                </button>
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

