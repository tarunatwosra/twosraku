"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, Button, Badge, Avatar } from "@/components/ui";
import { DetailPageTemplate } from "@/components/templates";
import { getStudents } from "../lib/data";
import type { Student } from "@/types";
import { getGenderLabel, getStatusLabel } from "@/constants";
import { cn } from "@/lib/utils";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      setIsLoading(true);
      try {
        const result = await getStudents(1, 10, {});
        const found = result.data.find((s) => s.id === studentId);
        setStudent(found || null);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [studentId]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[var(--surface-hover)] rounded w-48" />
          <div className="h-48 bg-[var(--surface-hover)] rounded-[28px]" />
          <div className="h-64 bg-[var(--surface-hover)] rounded-[28px]" />
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Siswa Tidak Ditemukan
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Data siswa dengan ID ini tidak ditemukan dalam sistem
          </p>
          <Link href="/buku-induk">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Buku Induk
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const statusVariant = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "graduated":
        return "info";
      case "transferred":
        return "warning";
      case "dropout":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <AppLayout>
      <DetailPageTemplate
        title={student.name}
        description={`NIS: ${student.nis} | NISN: ${student.nisn}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Akademik", href: "/buku-induk" },
          { label: student.name },
        ]}
        actions={[
          {
            label: "Edit",
            icon: <Pencil className="w-4 h-4" />,
            onClick: () => console.log("Edit student"),
            variant: "outline",
          },
          {
            label: "Hapus",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => console.log("Delete student"),
            variant: "danger",
          },
        ]}
        tabs={[
          {
            label: "Informasi Pribadi",
            content: <PersonalInfoSection student={student} />,
          },
          {
            label: "Data Orang Tua",
            content: <ParentInfoSection student={student} />,
          },
          {
            label: "Riwayat Akademik",
            content: <AcademicHistorySection student={student} />,
          },
        ]}
        headerContent={
          <Card padding="lg">
            <div className="flex items-start gap-6">
              <Avatar
                fallback={student.name}
                size="lg"
                className="w-24 h-24 text-2xl bg-[var(--primary-soft)] text-[var(--primary)]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                    {student.name}
                  </h2>
                  <Badge variant={statusVariant(student.status)}>
                    {getStatusLabel(student.status)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                    {getGenderLabel(student.gender)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                    {new Date(student.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.birthPlace}
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mt-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.class || "-"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.email || "-"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.phone || "-"}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        }
      />
    </AppLayout>
  );
}

function PersonalInfoSection({ student }: { student: Student }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="NIS" value={student.nis} />
      <InfoItem label="NISN" value={student.nisn} />
      <InfoItem label="Nama Lengkap" value={student.name} />
      <InfoItem label="Jenis Kelamin" value={getGenderLabel(student.gender)} />
      <InfoItem label="Tempat Lahir" value={student.birthPlace} />
      <InfoItem
        label="Tanggal Lahir"
        value={new Date(student.birthDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />
      <InfoItem label="Agama" value={student.religion} />
      <InfoItem label="Alamat" value={student.address} fullWidth />
      <InfoItem
        label="Kota/Kabupaten"
        value={`${student.city || "-"}, ${student.province || "-"}`}
      />
      <InfoItem label="Kode Pos" value={student.postalCode || "-"} />
      <InfoItem label="No. Telepon" value={student.phone || "-"} />
      <InfoItem label="Email" value={student.email || "-"} />
    </div>
  );
}

function ParentInfoSection({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      <Card padding="md" className="bg-[var(--surface-secondary)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Data Ayah
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Nama Ayah" value={student.fatherName || "-"} />
          <InfoItem label="Pekerjaan Ayah" value={student.fatherJob || "-"} />
        </div>
      </Card>
      <Card padding="md" className="bg-[var(--surface-secondary)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Data Ibu
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Nama Ibu" value={student.motherName || "-"} />
          <InfoItem label="Pekerjaan Ibu" value={student.motherJob || "-"} />
        </div>
      </Card>
      {(student.guardianName || student.guardianPhone) && (
        <Card padding="md" className="bg-[var(--surface-secondary)]">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Data Wali
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nama Wali" value={student.guardianName || "-"} />
            <InfoItem label="No. Telepon Wali" value={student.guardianPhone || "-"} />
          </div>
        </Card>
      )}
    </div>
  );
}

function AcademicHistorySection({ student }: { student: Student }) {
  const historyData = [
    {
      year: "2024/2025",
      class: student.class || "-",
      status: "Aktif",
      average: "85.5",
    },
    {
      year: "2023/2024",
      class: "X IPA 1",
      status: "Naik",
      average: "82.0",
    },
    {
      year: "2022/2023",
      class: "IX",
      status: "Naik",
      average: "84.2",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border-light)]">
            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              Tahun Ajaran
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              Kelas
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              Rata-rata Nilai
            </th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                {item.year}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                {item.class}
              </td>
              <td className="px-4 py-3">
                <Badge variant="success">{item.status}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                {item.average}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoItem({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-medium">{value}</p>
    </div>
  );
}
