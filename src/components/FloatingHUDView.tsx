import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  Eye,
  Pin,
  Trash2,
  CornerDownLeft,
  Settings,
  Folder,
  Image as ImageIcon,
  FileText,
  Link2,
  Code2,
  ExternalLink,
  Check
} from 'lucide-react';

export type ItemContentType = 'text' | 'url' | 'code' | 'image' | 'file';

export interface HUDItem {
  id: string;
  contentType: ItemContentType;
  previewTitle: string;
  secondaryPreview?: string;
  sourceAppName: string;
  sourceAppIcon: 'safari' | 'xcode' | 'figma' | 'terminal' | 'finder' | 'cleanshot';
  createdAt: string;
  isPinned: boolean;
  textContent?: string;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageByteSize?: number;
  filePaths?: string[];
  characterCount?: number;
  lineCount?: number;
}

// Sample items matching the exact workflows captured by Clipplic on macOS
export const DEFAULT_HUD_ITEMS: HUDItem[] = [
  {
    id: '1',
    contentType: 'image',
    previewTitle: 'Screen Shot 2026-09-08 at 4.12.00 PM',
    secondaryPreview: '1920 × 1080 px • 2.4 MB',
    sourceAppName: 'CleanShot X',
    sourceAppIcon: 'cleanshot',
    createdAt: 'Today, 4:12 PM',
    isPinned: true,
    imageSrc: '/clipplic-iOS-Default-1024x1024@1x.png',
    imageWidth: 1920,
    imageHeight: 1080,
    imageByteSize: 2480120
  },
  {
    id: '2',
    contentType: 'code',
    previewTitle: 'func restoreAndPaste(item: ClipboardItem)',
    secondaryPreview: 'Swift • 12 lines',
    sourceAppName: 'Xcode',
    sourceAppIcon: 'xcode',
    createdAt: 'Today, 3:58 PM',
    isPinned: true,
    textContent: `func restoreAndPaste(item: ClipboardItem, autoPaste: Bool = true) {
    NSPasteboard.general.clearContents()
    writeItemToPasteboard(item)
    if autoPaste {
        simulateCommandV()
    }
}`,
    characterCount: 178,
    lineCount: 7
  },
  {
    id: '3',
    contentType: 'url',
    previewTitle: 'apple.com/macos/sonoma',
    secondaryPreview: 'Safari • macOS Sonoma Overview',
    sourceAppName: 'Safari',
    sourceAppIcon: 'safari',
    createdAt: 'Today, 2:40 PM',
    isPinned: false,
    textContent: 'https://www.apple.com/macos/sonoma'
  },
  {
    id: '4',
    contentType: 'text',
    previewTitle: 'Design Tokens & Glassmorphism Spec',
    secondaryPreview: '48 chars • 3 lines',
    sourceAppName: 'Figma',
    sourceAppIcon: 'figma',
    createdAt: 'Yesterday, 6:15 PM',
    isPinned: false,
    textContent: `Primary Accent: #0071E3
Font: Tanker Display / Inter Text
Radius: 18px Continuous Squircle`,
    characterCount: 88,
    lineCount: 3
  },
  {
    id: '5',
    contentType: 'file',
    previewTitle: 'Clipplic-macOS-v1.4.dmg',
    secondaryPreview: '/Users/clipplic/Downloads',
    sourceAppName: 'Finder',
    sourceAppIcon: 'finder',
    createdAt: 'Yesterday, 1:20 PM',
    isPinned: false,
    filePaths: ['/Users/clipplic/Downloads/Clipplic-macOS-v1.4.dmg']
  },
  {
    id: '6',
    contentType: 'code',
    previewTitle: 'git commit -m "feat: native clipboard history"',
    secondaryPreview: 'bash • 46 chars',
    sourceAppName: 'Terminal',
    sourceAppIcon: 'terminal',
    createdAt: 'Sep 6, 11:30 AM',
    isPinned: false,
    textContent: 'git commit -m "feat: native clipboard history"',
    characterCount: 46,
    lineCount: 1
  }
];

// Authentic Apple-Style Keycap Badge (exact recreation from UIComponents.swift)
export const KeycapBadge: React.FC<{ text: string; isAccent?: boolean }> = ({ text, isAccent = false }) => (
  <span
    className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold font-mono rounded-[4px] shadow-2xs select-none border transition-all ${
      isAccent
        ? 'text-white bg-white/20 border-white/40 shadow-xs'
        : 'text-slate-600 bg-white/80 border-slate-200/90 shadow-2xs'
    }`}
  >
    {text}
  </span>
);

// Native macOS App Icons
export const NativeAppIcon: React.FC<{ icon: string; size?: number }> = ({ icon, size = 16 }) => {
  switch (icon) {
    case 'safari':
      return (
        <div
          className="rounded-full bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-xs border border-white/40"
          style={{ width: size, height: size }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white relative">
            <span className="absolute -top-1 left-0.5 w-0.5 h-1 bg-red-500 rounded-full" />
            <span className="absolute -bottom-1 left-0.5 w-0.5 h-1 bg-blue-100 rounded-full" />
          </div>
        </div>
      );
    case 'xcode':
      return (
        <div
          className="rounded-md bg-linear-to-b from-blue-500 to-indigo-600 flex items-center justify-center shadow-xs border border-white/30 text-white font-mono text-[9px] font-black"
          style={{ width: size, height: size }}
        >
          🔨
        </div>
      );
    case 'figma':
      return (
        <div
          className="rounded-md bg-slate-900 flex items-center justify-center shadow-xs border border-white/30 text-[9px]"
          style={{ width: size, height: size }}
        >
          🎨
        </div>
      );
    case 'terminal':
      return (
        <div
          className="rounded-md bg-slate-900 flex items-center justify-center shadow-xs border border-slate-700 text-emerald-400 font-mono text-[9px] font-bold"
          style={{ width: size, height: size }}
        >
          &gt;_
        </div>
      );
    case 'finder':
      return (
        <div
          className="rounded-md bg-linear-to-b from-sky-400 to-blue-500 flex items-center justify-center shadow-xs border border-white/40 text-[10px]"
          style={{ width: size, height: size }}
        >
          🙂
        </div>
      );
    case 'cleanshot':
    default:
      return (
        <div
          className="rounded-md bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs border border-white/30 text-white text-[9px]"
          style={{ width: size, height: size }}
        >
          📸
        </div>
      );
  }
};

export interface FloatingHUDViewProps {
  isEmbedded?: boolean;
  onClose?: () => void;
  className?: string;
}

export const FloatingHUDView: React.FC<FloatingHUDViewProps> = ({
  isEmbedded = false,
  onClose,
  className = ''
}) => {
  const [items, setItems] = useState<HUDItem[]>(DEFAULT_HUD_ITEMS);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ItemContentType | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isQuickLookOpen, setIsQuickLookOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Filter items based on selected tab and search text
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter = activeFilter === null || item.contentType === activeFilter;
      const matchesSearch =
        searchText.trim() === '' ||
        item.previewTitle.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        item.sourceAppName.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        (item.textContent && item.textContent.toLowerCase().includes(searchText.toLowerCase().trim()));
      return matchesFilter && matchesSearch;
    });
  }, [items, activeFilter, searchText]);

  // Active selected item
  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedId) || filteredItems[0] || null;
  }, [items, selectedId, filteredItems]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: items.length,
      image: items.filter((i) => i.contentType === 'image').length,
      file: items.filter((i) => i.contentType === 'file').length,
      text: items.filter((i) => i.contentType === 'text').length,
      url: items.filter((i) => i.contentType === 'url').length,
      code: items.filter((i) => i.contentType === 'code').length,
      pinned: items.filter((i) => i.isPinned).length
    };
  }, [items]);

  // Paste / Copy Action
  const handlePaste = useCallback((itemToPaste: HUDItem) => {
    const text = itemToPaste.textContent || itemToPaste.previewTitle;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setToastMessage(`Pasted: "${itemToPaste.previewTitle.slice(0, 32)}"`);
    setTimeout(() => setToastMessage(null), 2200);
  }, []);

  // Toggle Pin Action
  const handleTogglePin = useCallback((itemToToggle: HUDItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemToToggle.id ? { ...item, isPinned: !item.isPinned } : item))
    );
  }, []);

  // Delete Action
  const handleDelete = useCallback((itemToDelete: HUDItem) => {
    setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedId === itemToDelete.id) {
      const remaining = items.filter((item) => item.id !== itemToDelete.id);
      if (remaining[0]) setSelectedId(remaining[0].id);
    }
  }, [items, selectedId]);

  // Clear Unpinned Action
  const handleClearUnpinned = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.isPinned));
    setToastMessage('Cleared unpinned items');
    setTimeout(() => setToastMessage(null), 2000);
  }, []);

  // Keyboard navigation when focused or active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space toggles Quick Look if search is not actively being typed
      if (e.code === 'Space' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsQuickLookOpen((prev) => !prev);
      }
      // Enter pastes selected item
      if (e.key === 'Enter') {
        if (selectedItem) {
          e.preventDefault();
          handlePaste(selectedItem);
          if (isQuickLookOpen) setIsQuickLookOpen(false);
        }
      }
      // Escape closes Quick Look or triggers onClose
      if (e.key === 'Escape') {
        if (isQuickLookOpen) {
          e.preventDefault();
          setIsQuickLookOpen(false);
        } else if (onClose && !isEmbedded) {
          e.preventDefault();
          onClose();
        }
      }
      // Arrow keys navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = filteredItems.findIndex((i) => i.id === selectedId);
        if (currentIndex < filteredItems.length - 1) {
          setSelectedId(filteredItems[currentIndex + 1].id);
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = filteredItems.findIndex((i) => i.id === selectedId);
        if (currentIndex > 0) {
          setSelectedId(filteredItems[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedId, selectedItem, isQuickLookOpen, handlePaste, onClose, isEmbedded]);

  return (
    <div
      className={`relative flex flex-col w-full max-w-[760px] ${
        isEmbedded ? 'h-[370px] sm:h-[400px] md:h-[420px]' : 'h-[480px] sm:h-[500px]'
      } bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18),0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] overflow-hidden select-none text-slate-900 transition-all ${className}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. SEARCH HEADER & CONTROLS                                  */}
      {/* ============================================================ */}
      <div className="px-4 pt-3.5 pb-2 flex items-center gap-2.5">
        {/* Search Input Bar */}
        <div
          className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100/80 border transition-all ${
            isSearchFocused
              ? 'border-[#0071E3] bg-white shadow-[0_0_0_2px_rgba(0,113,227,0.15)]'
              : 'border-slate-200/70 hover:border-slate-300/80'
          }`}
        >
          <Search
            className={`w-4 h-4 transition-colors ${
              isSearchFocused ? 'text-[#0071E3]' : 'text-slate-400'
            }`}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search history, screenshots, files, links, code..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none font-normal"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Settings Icon Button */}
        <button
          title="Open Settings (⌘,)"
          onClick={() => {
            setToastMessage('Settings (⌘,)');
            setTimeout(() => setToastMessage(null), 1500);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/60 text-slate-600 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Close Icon Button */}
        <button
          title="Close (Esc)"
          onClick={() => {
            if (onClose) onClose();
            else {
              setToastMessage('Clipplic minimized to menu bar');
              setTimeout(() => setToastMessage(null), 1500);
            }
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/60 text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. FILTER PILLS SECTION                                      */}
      {/* ============================================================ */}
      <div className="px-4 pb-2.5 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5">
          {/* All */}
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === null
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] opacity-75 font-mono">({counts.all})</span>
          </button>

          {/* Images */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'image' ? null : 'image')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === 'image'
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Images</span>
            <span className="text-[10px] opacity-75 font-mono">({counts.image})</span>
          </button>

          {/* Files */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'file' ? null : 'file')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === 'file'
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <Folder className="w-3 h-3" />
            <span>Files</span>
            <span className="text-[10px] opacity-75 font-mono">({counts.file})</span>
          </button>

          {/* Text */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'text' ? null : 'text')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === 'text'
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Text</span>
          </button>

          {/* Links */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'url' ? null : 'url')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === 'url'
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Links</span>
          </button>

          {/* Code */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'code' ? null : 'code')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              activeFilter === 'code'
                ? 'bg-[#0071E3]/15 text-[#0071E3] font-semibold border border-[#0071E3]/30'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-transparent'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Code</span>
          </button>
        </div>

        {/* Pinned Indicator on the right */}
        {counts.pinned > 0 && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 whitespace-nowrap pl-2">
            <Pin className="w-3 h-3 fill-orange-500" />
            <span>{counts.pinned} pinned</span>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-200/70 w-full" />

      {/* ============================================================ */}
      {/* 3. MAIN DUAL-PANE CONTENT (LEFT LIST 45% + RIGHT PREVIEW 55%)*/}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Left Item List Pane */}
        <div className="w-full sm:w-[325px] shrink-0 border-r border-slate-200/70 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-xs">
              <FileText className="w-8 h-8 opacity-40 mb-2" />
              <span>No clipboard history found</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = selectedId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => handlePaste(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0071E3]/15 border border-[#0071E3]/40 text-slate-950'
                      : isHovered
                      ? 'bg-slate-100/80 border border-slate-200/60 text-slate-800'
                      : 'border border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {/* Number Shortcut Badge (1..9) */}
                  <span
                    className={`w-3 text-[10px] font-mono font-bold shrink-0 text-center ${
                      isSelected ? 'text-[#0071E3]' : 'text-slate-400 opacity-60'
                    }`}
                  >
                    {index < 9 ? index + 1 : ''}
                  </span>

                  {/* Leading Visual Thumbnail */}
                  <div className="shrink-0">
                    {item.contentType === 'image' ? (
                      <div className="w-9 h-7 rounded bg-slate-950/80 overflow-hidden border border-white/40 shadow-xs flex items-center justify-center">
                        <img
                          src={item.imageSrc}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : item.contentType === 'file' ? (
                      <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                        <Folder className="w-3.5 h-3.5" />
                      </div>
                    ) : item.contentType === 'code' ? (
                      <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                    ) : item.contentType === 'url' ? (
                      <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0071E3]">
                        <Link2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Title & App Metadata */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-snug">
                      {item.previewTitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                      <NativeAppIcon icon={item.sourceAppIcon} size={12} />
                      <span className="truncate">{item.sourceAppName}</span>
                      {item.secondaryPreview && (
                        <>
                          <span className="opacity-40">•</span>
                          <span className="truncate opacity-80">{item.secondaryPreview}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Hover Quick Actions or Pin Badge */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isHovered ? (
                      <div className="flex items-center gap-1 animate-fade-in">
                        <button
                          title="Preview (Space)"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(item.id);
                            setIsQuickLookOpen(true);
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          title={item.isPinned ? 'Unpin' : 'Pin (⌘P)'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(item);
                          }}
                          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
                            item.isPinned
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          title="Delete (⌘⌫)"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded bg-slate-200/70 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : item.isPinned ? (
                      <Pin className="w-3 h-3 fill-orange-500 text-orange-500" />
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Preview Pane */}
        <div className="flex-1 flex flex-col p-3 overflow-hidden bg-slate-50/50">
          {selectedItem ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header metadata bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <NativeAppIcon icon={selectedItem.sourceAppIcon} size={18} />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">
                      {selectedItem.sourceAppName}
                    </h4>
                    <span className="text-[10px] text-slate-500">{selectedItem.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#0071E3]/15 text-[#0071E3] border border-[#0071E3]/25 uppercase tracking-wide">
                    {selectedItem.contentType}
                  </span>
                  {selectedItem.isPinned && (
                    <Pin className="w-3 h-3 fill-orange-500 text-orange-500" />
                  )}
                </div>
              </div>

              {/* Stage Body */}
              <div className="flex-1 overflow-y-auto py-2.5 flex flex-col justify-center">
                {selectedItem.contentType === 'image' && (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <div className="relative w-full max-h-[190px] rounded-lg bg-slate-950/80 border border-white/20 shadow-md overflow-hidden flex items-center justify-center p-2 group">
                      <img
                        src={selectedItem.imageSrc}
                        alt="Preview"
                        className="max-h-[170px] max-w-full object-contain rounded drop-shadow-md"
                      />
                      <button
                        onClick={() => setIsQuickLookOpen(true)}
                        className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white text-[10px] font-medium flex items-center gap-1 shadow-md transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Space to Zoom</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 border border-slate-300/60">
                        {selectedItem.imageWidth} × {selectedItem.imageHeight} px
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 border border-slate-300/60">
                        {(Number(selectedItem.imageByteSize) / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                )}

                {selectedItem.contentType === 'code' && (
                  <div className="w-full h-full rounded-lg bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-auto border border-slate-800 shadow-inner flex flex-col justify-between">
                    <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
                      <code>{selectedItem.textContent}</code>
                    </pre>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{selectedItem.lineCount} lines</span>
                      <span>{selectedItem.characterCount} characters</span>
                    </div>
                  </div>
                )}

                {selectedItem.contentType === 'url' && (
                  <div className="w-full rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0071E3]">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a
                        href={selectedItem.textContent}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate"
                      >
                        {selectedItem.textContent}
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Click to open destination in Safari or press Return to paste URL directly into active input.
                    </p>
                  </div>
                )}

                {selectedItem.contentType === 'text' && (
                  <div className="w-full h-full rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-xs text-xs text-slate-800 whitespace-pre-wrap leading-relaxed overflow-auto font-sans">
                    {selectedItem.textContent}
                  </div>
                )}

                {selectedItem.contentType === 'file' && (
                  <div className="w-full rounded-lg bg-white p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {selectedItem.previewTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {selectedItem.filePaths?.[0]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail action footer */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  {selectedItem.contentType === 'image'
                    ? 'Screenshot / Image'
                    : selectedItem.contentType === 'file'
                    ? '1 file in clipboard'
                    : `${selectedItem.characterCount || 0} chars`}
                </span>
                <button
                  onClick={() => handlePaste(selectedItem)}
                  className="px-2.5 py-1 rounded bg-[#0071E3]/15 hover:bg-[#0071E3]/25 text-[#0071E3] font-semibold transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select an item to view preview
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200/70 w-full" />

      {/* ============================================================ */}
      {/* 4. INTERACTIVE ACTION BUTTONS FOOTER BAR (EXACT CLOUD HUD)    */}
      {/* ============================================================ */}
      <div className="px-3.5 py-2 flex items-center gap-2 overflow-x-auto text-xs bg-slate-50/80">
        {/* 1. Paste Button */}
        <button
          onClick={() => selectedItem && handlePaste(selectedItem)}
          disabled={!selectedItem}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all disabled:opacity-40"
        >
          <CornerDownLeft className="w-3 h-3 stroke-[2.5]" />
          <span>Paste</span>
          <KeycapBadge text="↵" isAccent />
        </button>

        {/* 2. Preview / Quick Look Button */}
        <button
          onClick={() => selectedItem && setIsQuickLookOpen(true)}
          disabled={!selectedItem}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/70 hover:bg-slate-300/80 text-slate-800 font-medium text-xs border border-slate-300/50 transition-all disabled:opacity-40"
        >
          <Eye className="w-3 h-3 text-slate-600" />
          <span>Preview</span>
          <KeycapBadge text="Space" />
        </button>

        {/* 3. Pin / Unpin Button */}
        <button
          onClick={() => selectedItem && handleTogglePin(selectedItem)}
          disabled={!selectedItem}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/70 hover:bg-slate-300/80 text-slate-800 font-medium text-xs border border-slate-300/50 transition-all disabled:opacity-40"
        >
          <Pin
            className={`w-3 h-3 ${
              selectedItem?.isPinned ? 'fill-orange-500 text-orange-500' : 'text-slate-600'
            }`}
          />
          <span>{selectedItem?.isPinned ? 'Unpin' : 'Pin'}</span>
          <KeycapBadge text="⌘P" />
        </button>

        {/* 4. Delete Button */}
        <button
          onClick={() => selectedItem && handleDelete(selectedItem)}
          disabled={!selectedItem}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/70 hover:bg-rose-100 text-slate-800 hover:text-rose-700 font-medium text-xs border border-slate-300/50 transition-all disabled:opacity-40"
        >
          <Trash2 className="w-3 h-3 text-slate-600" />
          <span>Delete</span>
          <KeycapBadge text="⌘⌫" />
        </button>

        <div className="flex-1" />

        {/* 5. Settings Button */}
        <button
          onClick={() => {
            setToastMessage('Settings (⌘,)');
            setTimeout(() => setToastMessage(null), 1500);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/70 hover:bg-slate-300/80 text-slate-800 font-medium text-xs border border-slate-300/50 transition-all"
        >
          <Settings className="w-3 h-3 text-slate-600" />
          <span>Settings</span>
          <KeycapBadge text="⌘," />
        </button>

        {/* 6. Clear History Button */}
        <button
          title="Clear Unpinned History"
          onClick={handleClearUnpinned}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200/70 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 5. QUICK LOOK LIGHTBOX MODAL OVERLAY                         */}
      {/* ============================================================ */}
      {isQuickLookOpen && selectedItem && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col p-4 animate-fade-in text-white">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <NativeAppIcon icon={selectedItem.sourceAppIcon} size={18} />
              <span className="text-sm font-semibold truncate">{selectedItem.previewTitle}</span>
            </div>
            <button
              onClick={() => setIsQuickLookOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lightbox Body */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            {selectedItem.contentType === 'image' ? (
              <img
                src={selectedItem.imageSrc}
                alt="Enlarged"
                className="max-h-[300px] max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
              />
            ) : selectedItem.contentType === 'code' ? (
              <div className="w-full max-w-lg rounded-xl bg-slate-900/95 p-4 border border-white/10 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                {selectedItem.textContent}
              </div>
            ) : (
              <div className="w-full max-w-lg rounded-xl bg-white/10 p-4 border border-white/10 text-sm whitespace-pre-wrap">
                {selectedItem.textContent || selectedItem.previewTitle}
              </div>
            )}
          </div>

          {/* Lightbox Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/60">
            <span>Press Space or Esc to close · Enter to paste</span>
            <button
              onClick={() => {
                setIsQuickLookOpen(false);
                handlePaste(selectedItem);
              }}
              className="px-4 py-1.5 rounded-md bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold shadow-md transition-all"
            >
              Paste Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingHUDView;
