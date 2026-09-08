import React, { useEffect } from 'react';
import { FloatingHUDView } from './FloatingHUDView';

interface FloatingHistoryHudProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClip?: (text: string) => void;
}

export const FloatingHistoryHud: React.FC<FloatingHistoryHudProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-[760px] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <FloatingHUDView onClose={onClose} isEmbedded={false} />
      </div>
    </div>
  );
};

export default FloatingHistoryHud;
