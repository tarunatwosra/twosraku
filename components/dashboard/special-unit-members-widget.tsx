"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Shield,
  Heart,
  Compass,
  Flag,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecialUnit {
  id: string;
  name: string;
  shortName: string;
  members: number;
  icon: typeof Shield;
  color: string;
  href: string;
}

interface SpecialUnitMembersWidgetProps {
  className?: string;
}

const defaultUnits: SpecialUnit[] = [
  {
    id: "pasus",
    name: "Pasukan Khusus",
    shortName: "PASUS",
    members: 45,
    icon: Shield,
    color: "#4F7CFF",
    href: "/pasukan-khusus",
  },
  {
    id: "pmr",
    name: "Palang Merah Remaja",
    shortName: "PMR",
    members: 60,
    icon: Heart,
    color: "#EF4444",
    href: "/pmr",
  },
  {
    id: "pramuka",
    name: "Pramuka",
    shortName: "PRAMUKA",
    members: 120,
    icon: Compass,
    color: "#F59E0B",
    href: "/pramuka",
  },
  {
    id: "paskibra",
    name: "Paskibra",
    shortName: "PASKIBRA",
    members: 35,
    icon: Flag,
    color: "#22c55e",
    href: "/paskibra",
  },
  {
    id: "osis",
    name: "OSIS",
    shortName: "OSIS",
    members: 25,
    icon: Users,
    color: "#8b5cf6",
    href: "/osis",
  },
  {
    id: "mpk",
    name: "MPK",
    shortName: "MPK",
    members: 15,
    icon: Award,
    color: "#06b6d4",
    href: "/mpk",
  },
];

export function SpecialUnitMembersWidget({
  className,
}: SpecialUnitMembersWidgetProps) {
  const totalMembers = defaultUnits.reduce((sum, unit) => sum + unit.members, 0);

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Unit Khusus
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            {totalMembers.toLocaleString("id-ID")} anggota aktif
          </p>
        </div>
        <Link
          href="/unit-khusus"
          className="flex items-center gap-1 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat semua
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-2 gap-[12px]">
        {defaultUnits.map((unit) => (
          <Link
            key={unit.id}
            href={unit.href}
            className={cn(
              "group flex items-center gap-[12px] p-[12px]",
              "rounded-[16px] border border-transparent",
              "hover:bg-[var(--surface-secondary)]",
              "hover:border-[var(--border-light)]",
              "transition-all duration-200"
            )}
          >
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${unit.color}20` }}
            >
              <unit.icon
                className="w-5 h-5"
                style={{ color: unit.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                {unit.shortName}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                {unit.members} anggota
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
