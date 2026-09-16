import type { ClockAnchor } from './timerClock';

export interface EvenTimerSnapshot extends ClockAnchor {
  countTo: number | null;
}

/** What the companion may ask of the timer: a tap on the glasses is the Enter key. */
export type EvenTimerCommand = 'toggle';

// Opt-in only: ordinary visits to timer.gcc3.com never publish timer state.
export function createEvenTimerSender(
  host: Window,
  read: () => EvenTimerSnapshot,
  onCommand?: (command: EvenTimerCommand) => void
) {
  const params = new URLSearchParams(host.location.search);
  const session = params.get('evenSession');
  const parentOrigin = params.get('evenParentOrigin');
  const noop = { publish: () => {}, dispose: () => {} };
  if (
    host.parent === host ||
    !session ||
    !/^[\w-]{16,100}$/.test(session) ||
    !parentOrigin
  )
    return noop;
  if (parentOrigin !== 'null') {
    try {
      if (new URL(parentOrigin).origin !== parentOrigin) return noop;
    } catch {
      return noop;
    }
  }
  let connected = false;
  // Starts at the clock rather than at zero, so a sender re-created without a
  // page load — a remounted component, a hot reload — continues above every
  // number its predecessor sent, and the parent never takes it for old news.
  let sequence = Date.now();
  let lastSignature = '';
  function publish(force = false) {
    if (!connected) return;
    const snapshot = read();
    const signature = JSON.stringify([
      snapshot.mode,
      Math.floor(snapshot.seconds),
      snapshot.running,
      snapshot.countTo
    ]);
    if (!force && signature === lastSignature) return;
    lastSignature = signature;
    host.parent.postMessage(
      {
        ...snapshot,
        source: 'gcc3-timer',
        version: 1,
        type: 'state',
        session,
        sequence: sequence++
      },
      parentOrigin === 'null' ? '*' : parentOrigin!
    );
  }
  function receive(event: MessageEvent) {
    if (event.source !== host.parent || event.origin !== parentOrigin) return;
    const data = event.data;
    if (
      !data ||
      data.source !== 'gcc3-timer-even' ||
      data.version !== 1 ||
      data.session !== session
    )
      return;
    if (data.type === 'request-state') {
      connected = true;
      publish(true);
    } else if (data.type === 'toggle' && connected) {
      // Only after the handshake: a command is something the connected
      // companion says, never the first thing a window says.
      onCommand?.('toggle');
    }
  }
  host.addEventListener('message', receive);
  return {
    publish,
    dispose: () => host.removeEventListener('message', receive)
  };
}
