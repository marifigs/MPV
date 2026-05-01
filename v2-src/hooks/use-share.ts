'use client';

import { useCallback, useState } from 'react';

interface ShareInput {
  title: string;
  text?: string;
  url: string;
}

type ShareResult = 'shared' | 'copied' | 'failed';

export function useShare() {
  const [lastResult, setLastResult] = useState<ShareResult | null>(null);

  const share = useCallback(async (input: ShareInput): Promise<ShareResult> => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(input);
        setLastResult('shared');
        return 'shared';
      } catch {
        // user cancelled or error — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(input.url);
      setLastResult('copied');
      return 'copied';
    } catch {
      setLastResult('failed');
      return 'failed';
    }
  }, []);

  return { share, lastResult };
}
