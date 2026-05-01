'use client';

import { useLocalStorage } from './use-local-storage';

const KEY = 'mpv:mi-tienda';

export function useMiTienda() {
  const [tiendaId, setTiendaId, hydrated] = useLocalStorage<string | null>(KEY, null);
  return { tiendaId, setTiendaId, hydrated };
}
