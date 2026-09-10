import React, { useEffect, useRef } from 'react';
import { FloatingHUDView } from './FloatingHUDView';

export interface FloatingHistoryHudProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClip?: (text: string) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const FloatingHistoryHud: React.FC<FloatingHistoryHudProps> = ({
  isOpen,
  onClose,
  triggerRef
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = (triggerRef?.current || document.activeElement) as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        // Restore focus to triggering button when dialog closes
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          setTimeout(() => previousActiveElementRef.current?.focus(), 10);
        }
      };
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap focus within the modal dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Clipplic Clipboard History"
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-[760px] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <FloatingHUDView onClose={onClose} isEmbedded={false} autoFocusSearch />
      </div>
    </div>
  );
};

export default FloatingHistoryHud;
