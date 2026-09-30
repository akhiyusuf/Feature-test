'use client';

import Script from 'next/script';

export default function ErudaLoader() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="afterInteractive"
      onLoad={() => {
        try {
          if ((window as any).eruda) {
            (window as any).eruda.init();
            console.log('Eruda initialized successfully');
          } else {
            console.error('Eruda loaded but not found on window');
          }
        } catch (e) {
          console.error('Error initializing Eruda:', e);
        }
      }}
      onError={(e) => {
        console.error('Error loading Eruda script:', e);
      }}
    />
  );
}
