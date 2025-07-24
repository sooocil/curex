'use client';

import { Toaster } from 'sonner';

export function ToasterClient() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      duration={1000}
      richColors={true}
    />
  );
}
