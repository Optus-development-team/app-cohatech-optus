"use client";

import { ReactNode } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import styles from "./Student.module.css";

interface StudentLayoutProps {
  children: ReactNode;
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function StudentLayout({ 
  children, 
  userName, 
  activeTab, 
  onTabChange, 
  onLogout 
}: StudentLayoutProps) {
  return (
    <div className={styles.panelRoot}>
      <div className={styles.panelBackdrop} />
      <div className={styles.panelShell + " flex flex-col md:flex-row"}>
        <StudentSidebar 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          onLogout={onLogout} 
        />
        <main className={styles.panelContent + " flex-1 md:ml-64"}>
          <div className={styles.panelContainer}>
            <StudentHeader userName={userName} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}