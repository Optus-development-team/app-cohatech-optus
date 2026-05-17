"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#0b0710,#130927)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: 720, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Ha ocurrido un error</h1>
        <p style={{ color: '#d1c4ff', marginBottom: '1rem' }}>{error?.message ?? 'Error desconocido'}</p>
        {reset && (
          <button onClick={reset} style={{ padding: '0.6rem 1rem', background: '#7c3aed', color: 'white', borderRadius: 8 }}>Reintentar</button>
        )}
      </div>
    </div>
  );
}
