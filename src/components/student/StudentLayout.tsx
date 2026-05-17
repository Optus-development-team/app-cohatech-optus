"use client";

import { ReactNode } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

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
    <div className="min-h-screen bg-[#0f0a1a] flex">
      <StudentSidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onLogout={onLogout} 
      />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <StudentHeader userName={userName} />
          {children}
        </div>
      </main>
    </div>
  );
}