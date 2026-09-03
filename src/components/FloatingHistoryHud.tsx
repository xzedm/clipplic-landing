import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link2, FileText, Check, Search, X } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'text' | 'link';
  content: string;
  timeAgo: string;
}

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: '1',
    type: 'text',
    content: 'The fastest way to keep your copied ideas close.',
    timeAgo: 'Now'
  },
  {
    id: '2',
    type: 'link',
    content: 'https://www.apple.com/macos',
    timeAgo: '2 min'
  },
  {
    id: '3',
    type: 'text',
    content: 'A good tool gets out of your way.',
    timeAgo: 'Yesterday'
  }
];

interface FloatingHistoryHudProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClip?: (text: string) => void;
}

export const FloatingHistoryHud: React.FC<FloatingHistoryHudProps> = ({
  isOpen,
  onClose,
  onSelectClip
}) => {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredItems = HISTORY_ITEMS.filter((item) =>
    searchQuery.trim() === '' || item.content.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const activeSelectedId = filteredItems.some((i) => i.id === selectedId)
    ? selectedId
    : filteredItems[0]?.id;

  const selectedItem = HISTORY_ITEMS.find((i) => i.id === activeSelectedId) || filteredItems[0];

  const handleCopyAndPaste = useCallback(
    (textToPaste: string) => {
      // Copy to real clipboard
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(textToPaste).catch(() => {});
      }

      if (onSelectClip) {
        onSelectClip(textToPaste);
      }

      setToastMessage(`Copied: "${textToPaste.slice(0, 32)}..."`);
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 700);
    },
    [onSelectClip, onClose]
  );

  // Focus search input when HUD opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  // Keyboard navigation when HUD is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedItem) {
          handleCopyAndPaste(selectedItem.content);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const curIdx = filteredItems.findIndex((i) => i.id === activeSelectedId);
        if (curIdx < filteredItems.length - 1) {
          setSelectedId(filteredItems[curIdx + 1].id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const curIdx = filteredItems.findIndex((i) => i.id === activeSelectedId);
        if (curIdx > 0) {
          setSelectedId(filteredItems[curIdx - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedItem, filteredItems, activeSelectedId, handleCopyAndPaste, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
            </div>
            <span className="text-xs font-medium text-slate-700 ml-2 select-none">
              Clipplic history
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 select-none">
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                ⌘
              </kbd>
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                ⇧
              </kbd>
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                V
              </kbd>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative my-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clipboard... (or press ↵ to paste)"
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-1" />

        {/* Clips List */}
        <div className="space-y-1 my-1 max-h-64 overflow-y-auto no-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No matching clips found</div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = item.id === activeSelectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    handleCopyAndPaste(item.content);
                  }}
                  onMouseEnter={() => setSelectedId(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-150 ease-out ${
                    isSelected
                      ? 'bg-[#EBF5FF] text-slate-900 shadow-xs'
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    {isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-[#007AFF] shrink-0" />
                    ) : item.type === 'link' ? (
                      <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}

                    <span
                      className={`text-xs truncate ${
                        isSelected ? 'font-medium text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {item.content}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {item.timeAgo}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keycap Hints */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                ↵
              </kbd>{' '}
              Paste
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>

          <button
            onClick={() => selectedItem && handleCopyAndPaste(selectedItem.content)}
            className="px-2.5 py-1 rounded-lg bg-[#2A85FF] hover:bg-[#2075EB] text-white font-sans text-xs font-semibold shadow-xs"
          >
            Paste selected
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-medium text-xs shadow-lg animate-in fade-in duration-100">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
