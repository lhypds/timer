import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  createEvenTimerSender,
  type EvenTimerCommand,
  type EvenTimerSnapshot
} from '../utils/evenTimerSync';

export function useEvenTimerSync(
  read: () => EvenTimerSnapshot,
  onCommand?: (command: EvenTimerCommand) => void
) {
  const latest = useRef(read);
  const command = useRef(onCommand);
  const sender = useRef<ReturnType<typeof createEvenTimerSender> | null>(null);
  useLayoutEffect(() => {
    latest.current = read;
    command.current = onCommand;
  });
  useEffect(() => {
    sender.current = createEvenTimerSender(
      window,
      () => latest.current(),
      c => command.current?.(c)
    );
    return () => {
      sender.current?.dispose();
      sender.current = null;
    };
  }, []);
  useEffect(() => {
    sender.current?.publish();
  });
}
