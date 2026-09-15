import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  createEvenTimerSender,
  type EvenTimerSnapshot
} from '../utils/evenTimerSync';

export function useEvenTimerSync(read: () => EvenTimerSnapshot) {
  const latest = useRef(read);
  const sender = useRef<ReturnType<typeof createEvenTimerSender> | null>(null);
  useLayoutEffect(() => {
    latest.current = read;
  });
  useEffect(() => {
    sender.current = createEvenTimerSender(window, () => latest.current());
    return () => {
      sender.current?.dispose();
      sender.current = null;
    };
  }, []);
  useEffect(() => {
    sender.current?.publish();
  });
}
