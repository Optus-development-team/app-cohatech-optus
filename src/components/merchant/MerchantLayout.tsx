"use client";

import MerchantSidebar from "./MerchantSidebar";
import styles from "./Merchant.module.css";

interface MerchantLayoutProps {
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function MerchantLayout({ userName, activeTab, onTabChange, onLogout, children }: MerchantLayoutProps) {
  return (
    <div className={styles.panelRoot}>
      <div className={styles.panelBackdrop} />
      <div className={styles.panelShell + " flex flex-col md:flex-row"}>
        <MerchantSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
        />
        <div className={styles.panelContent + " flex-1 md:ml-64"}>
          <div className={styles.panelContainer}>
            <div className={styles.panelHeader}>
              <div>
                <h1 className={styles.panelTitle}>Hola, {userName}</h1>
                <p className={styles.panelSubtitle}>Bienvenido al panel de comerciante</p>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}