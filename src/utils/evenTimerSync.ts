import type { ClockAnchor } from './timerClock';

export interface EvenTimerSnapshot extends ClockAnchor {
  countTo: number | null;
}

// Opt-in only: ordinary visits to timer.gcc3.com never publish timer state.
export function createEvenTimerSender(
  host: Window,
  read: () => EvenTimerSnapshot
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
  let sequence = 0;
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
      data.type !== 'request-state' ||
      data.session !== session
    )
      return;
    connected = true;
    publish(true);
  }
  host.addEventListener('message', receive);
  return {
    publish,
    dispose: () => host.removeEventListener('message', receive)
  };
}
