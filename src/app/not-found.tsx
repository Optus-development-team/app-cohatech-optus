import React from "react";

export default function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05020a', color: '#ddd', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Página no encontrada</h1>
        <p style={{ color: '#bfb3ff' }}>Lo sentimos, la página que buscas no existe.</p>
      </div>
    </div>
  );
}
