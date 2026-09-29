import { useEffect, useState } from 'react';

export interface ShortcutKeys {
  cmd: boolean;
  shift: boolean;
  v: boolean;
}

const RELEASED: ShortcutKeys = { cmd: false, shift: false, v: false };

// Tracks which keys of the ⌘⇧V shortcut are physically held down
export function useShortcutKeys(): ShortcutKeys {
  const [keys, setKeys] = useState<ShortcutKeys>(RELEASED);

  useEffect(() => {
    const sync = (e: KeyboardEvent, isDown: boolean) => {
      setKeys((prev) => {
        const next = {
          cmd: e.metaKey || e.ctrlKey,
          shift: e.shiftKey,
          v: e.key.toLowerCase() === 'v' ? isDown : prev.v
        };
        return next.cmd === prev.cmd && next.shift === prev.shift && next.v === prev.v ? prev : next;
      });
    };
    const handleKeyDown = (e: KeyboardEvent) => sync(e, true);
    const handleKeyUp = (e: KeyboardEvent) => sync(e, false);
    const handleBlur = () => setKeys(RELEASED);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keys;
}
