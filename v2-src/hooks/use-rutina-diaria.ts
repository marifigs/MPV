'use client';

import { useEffect, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

interface RutinaState {
  fecha: string;
  marcados: Record<string, boolean>;
  racha: number;
  ultimaCompletada: string | null;
}

const KEY = 'mpv:rutina-diaria';

const TZ = 'America/Santiago';

function todayChile(): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date());
}

function previousDay(yyyymmdd: string): string {
  const d = new Date(yyyymmdd + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const initial: RutinaState = {
  fecha: '',
  marcados: {},
  racha: 0,
  ultimaCompletada: null,
};

export function useRutinaDiaria(allItemIds: string[]) {
  const [state, setState, hydrated] = useLocalStorage<RutinaState>(KEY, initial);

  // Reset diario a 00:00 hora Chile
  useEffect(() => {
    if (!hydrated) return;
    const today = todayChile();
    if (state.fecha !== today) {
      setState((prev) => ({
        ...prev,
        fecha: today,
        marcados: {},
      }));
    }
  }, [hydrated, state.fecha, setState]);

  const total = allItemIds.length;
  const completados = useMemo(
    () => allItemIds.filter((id) => state.marcados[id]).length,
    [allItemIds, state.marcados]
  );
  const todoCompletado = total > 0 && completados === total;

  function toggle(id: string) {
    setState((prev) => {
      const today = todayChile();
      const nextMarcados = { ...prev.marcados, [id]: !prev.marcados[id] };

      const allDone =
        allItemIds.length > 0 && allItemIds.every((iid) => nextMarcados[iid]);

      let nextRacha = prev.racha;
      let nextUltima = prev.ultimaCompletada;
      if (allDone && prev.ultimaCompletada !== today) {
        const yesterday = previousDay(today);
        nextRacha = prev.ultimaCompletada === yesterday ? prev.racha + 1 : 1;
        nextUltima = today;
      }

      return {
        fecha: today,
        marcados: nextMarcados,
        racha: nextRacha,
        ultimaCompletada: nextUltima,
      };
    });
  }

  function resetHoy() {
    setState((prev) => ({ ...prev, marcados: {}, fecha: todayChile() }));
  }

  return {
    hydrated,
    marcados: state.marcados,
    racha: state.racha,
    completados,
    total,
    todoCompletado,
    toggle,
    resetHoy,
  };
}
