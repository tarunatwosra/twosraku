"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import {
  Search,
  Users,
  ClipboardCheck,
  GraduationCap,
  UserRound,
  FileText,
  X,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "student" | "teacher" | "class" | "attendance" | "assessment";
  title: string;
  description: string;
  href: string;
}

interface GlobalSearchProps {
  className?: string;
}

const quickLinks: SearchResult[] = [
  {
    id: "q1",
    type: "student",
    title: "Cari Siswa",
    description: "Cari berdasarkan nama atau NIS",
    href: "/buku-induk",
  },
  {
    id: "q2",
    type: "attendance",
    title: "Rekap Absensi",
    description: "Lihat laporan kehadiran",
    href: "/absensi/rekap",
  },
  {
    id: "q3",
    type: "assessment",
    title: "Input Nilai",
    description: "Masukkan nilai siswa",
    href: "/penilaian",
  },
  {
    id: "q4",
    type: "class",
    title: "Kelola Kelas",
    description: "Atur data kelas",
    href: "/kelas",
  },
];

const typeConfig = {
  student: {
    icon: Users,
    color: "var(--primary)",
    bg: "var(--primary-soft)",
  },
  teacher: {
    icon: UserRound,
    color: "var(--success)",
    bg: "var(--success-soft)",
  },
  class: {
    icon: GraduationCap,
    color: "var(--warning)",
    bg: "var(--warning-soft)",
  },
  attendance: {
    icon: ClipboardCheck,
    color: "var(--info)",
    bg: "var(--info-soft)",
  },
  assessment: {
    icon: FileText,
    color: "var(--danger)",
    bg: "var(--danger-soft)",
  },
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length > 0
    ? quickLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(query.toLowerCase()) ||
          link.description.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-[18px]",
          "bg-[var(--surface-secondary)] border border-[var(--border-light)]",
          "hover:bg-[var(--surface-hover)] transition-colors",
          "min-w-[280px]"
        )}
      >
        <Search className="w-4 h-4 text-[var(--text-muted)]" />
        <span className="text-[14px] text-[var(--text-muted)] flex-1 text-left">
          Cari siswa, guru, kelas...
        </span>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 text-[11px] font-medium bg-[var(--surface-primary)] text-[var(--text-muted)] rounded-[8px]">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <kbd className="px-2 py-0.5 text-[11px] font-medium bg-[var(--surface-primary)] text-[var(--text-muted)] rounded-[8px]">
            K
          </kbd>
        </div>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Modal */}
          <Card
            className="relative w-full max-w-[560px] mx-4 overflow-hidden"
            padding="none"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)]">
              <Search className="w-5 h-5 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Cari siswa, guru, kelas, nilai..."
                className="flex-1 text-[14px] bg-transparent outline-none placeholder:text-[var(--text-muted)]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-[8px] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              )}
              <kbd className="px-2 py-1 text-[11px] font-medium bg-[var(--surface-secondary)] text-[var(--text-muted)] rounded-[8px]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, index) => {
                    const config = typeConfig[result.type];
                    const Icon = config.icon;

                    return (
                      <button
                        key={result.id}
                        onClick={() => {
                          router.push(result.href);
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-[14px] transition-colors",
                          index === selectedIndex
                            ? "bg-[var(--surface-secondary)]"
                            : "hover:bg-[var(--surface-secondary)]"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                          style={{ backgroundColor: config.bg }}
                        >
                          <Icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[14px] font-medium text-[var(--text-primary)]">
                            {result.title}
                          </p>
                          <p className="text-[12px] text-[var(--text-muted)]">
                            {result.description}
                          </p>
                        </div>
                        {index === selectedIndex && (
                          <kbd className="px-2 py-1 text-[11px] bg-[var(--surface-primary)] text-[var(--text-muted)] rounded-[8px]">
                            Enter
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[14px] text-[var(--text-muted)]">
                    Tidak ada hasil untuk "{query}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
              <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface-primary)] rounded-[6px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface-primary)] rounded-[6px]">↓</kbd>
                  <span className="ml-1">Navigasi</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface-primary)] rounded-[6px]">Enter</kbd>
                  <span className="ml-1">Pilih</span>
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
