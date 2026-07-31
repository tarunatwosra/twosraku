"use client";

import { useState, useMemo } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Search,
  ChevronRight,
  X,
  Phone,
  MapPin,
  User,
  Heart,
  Users,
  UserRound,
  Baby,
  BookOpen,
  Eye,
  Activity,
  Shield,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Format helpers
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return `${age} tahun`;
};

const getStatusVariant = (isActive: boolean) => isActive ? "success" : "neutral";
const getStatusLabel = (isActive: boolean) => isActive ? "Aktif" : "Tidak Aktif";

// Sample data - sesuai struktur database
const sampleStudents = [
  {
    id: "1",
    name: "Anisa Rahman",
    nickname: "Anisa",
    nis: "2025001",
    nisn: "0012345678",
    class: "X IPA 1",
    attendanceNumber: 1,
    gender: "P",
    birthPlace: "Jakarta",
    birthDate: "2010-05-15",
    religion: "Islam",
    phone: "081234567890",
    address: "Jl. Melati No. 10, RT 001/RW 005, Kel. Kebon Jeruk, Kec. Kebon Jeruk, Jakarta Barat 11540",
    bloodType: "A",
    height: 155,
    weight: 45,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "-",
    healthNotes: "Sehat, tidak ada catatan khusus",
    fatherName: "Ahmad Rahman",
    fatherPhone: "081234567891",
    motherName: "Siti Rahman",
    motherPhone: "081234567892",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "2",
    name: "Budi Santoso",
    nickname: "Budi",
    nis: "2025002",
    nisn: "0012345679",
    class: "X IPA 1",
    attendanceNumber: 2,
    gender: "L",
    birthPlace: "Bandung",
    birthDate: "2010-08-22",
    religion: "Kristen",
    phone: "082345678901",
    address: "Jl. Mawar No. 5, RT 002/RW 001, Kel. Sukajadi, Kec. Sukajadi, Bandung 40162",
    bloodType: "B",
    height: 160,
    weight: 50,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "Demam berdarah 2023",
    allergies: "Udang",
    healthNotes: "Alergi makanan laut",
    fatherName: "Joko Santoso",
    fatherPhone: "082345678902",
    motherName: "Maria Santoso",
    motherPhone: "082345678903",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "3",
    name: "Dewi Lestari",
    nickname: "Dewi",
    nis: "2025003",
    nisn: "0012345680",
    class: "X IPA 2",
    attendanceNumber: 3,
    gender: "P",
    birthPlace: "Surabaya",
    birthDate: "2010-03-10",
    religion: "Islam",
    phone: "083456789012",
    address: "Jl. Anggrek No. 8, RT 001/RW 003, Kel. Gubeng, Kec. Gubeng, Surabaya 60281",
    bloodType: "O",
    height: 152,
    weight: 48,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "Debu",
    healthNotes: "Peka terhadap debu",
    fatherName: "Hendra Lestari",
    fatherPhone: "083456789013",
    motherName: "Rini Lestari",
    motherPhone: "083456789014",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "4",
    name: "Eko Prasetyo",
    nickname: "Eko",
    nis: "2025004",
    nisn: "0012345681",
    class: "X IPS 1",
    attendanceNumber: 4,
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "2010-11-28",
    religion: "Islam",
    phone: "084567890123",
    address: "Jl. Kenanga No. 12, RT 002/RW 005, Kel. Mergangsan, Kec. Mergangsan, Yogyakarta 55152",
    bloodType: "AB",
    height: 165,
    weight: 55,
    vision: "Tidak Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "-",
    healthNotes: "Menggunakan kacamata -2.5",
    fatherName: "Budi Prasetyo",
    fatherPhone: "084567890124",
    motherName: "Wati Prasetyo",
    motherPhone: "084567890125",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "Memerlukan pemeriksaan mata rutin",
  },
  {
    id: "5",
    name: "Fitri Handayani",
    nickname: "Fitri",
    nis: "2025005",
    nisn: "0012345682",
    class: "X IPA 2",
    attendanceNumber: 5,
    gender: "P",
    birthPlace: "Semarang",
    birthDate: "2010-07-05",
    religion: "Islam",
    phone: "085678901234",
    address: "Jl. Dahlia No. 3, RT 001/RW 002, Kel. Banyumanik, Kec. Banyumanik, Semarang 50262",
    bloodType: "A",
    height: 158,
    weight: 46,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "-",
    healthNotes: "Sehat",
    fatherName: "Dedi Handayani",
    fatherPhone: "085678901235",
    motherName: "Ani Handayani",
    motherPhone: "085678901236",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "6",
    name: "Galang Ramadhan",
    nickname: "Galang",
    nis: "2025006",
    nisn: "0012345683",
    class: "X IPS 1",
    attendanceNumber: 6,
    gender: "L",
    birthPlace: "Medan",
    birthDate: "2010-09-18",
    religion: "Islam",
    phone: "086789012345",
    address: "Jl. Seruni No. 7, RT 003/RW 001, Kel. Polonia, Kec. Medan Polonia, Medan 20152",
    bloodType: "B",
    height: 162,
    weight: 52,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "-",
    healthNotes: "Sehat",
    fatherName: "Surya Ramadhan",
    fatherPhone: "086789012346",
    motherName: "Lina Ramadhan",
    motherPhone: "086789012347",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2025,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "7",
    name: "Hana Wijaya",
    nickname: "Hana",
    nis: "2025007",
    nisn: "0012345684",
    class: "XI IPA 1",
    attendanceNumber: 1,
    gender: "P",
    birthPlace: "Palembang",
    birthDate: "2009-04-12",
    religion: "Islam",
    phone: "087890123456",
    address: "Jl. Flamboyan No. 15, RT 002/RW 004, Kel. 9 Ilir, Kec. Ilir Timur II, Palembang 30114",
    bloodType: "O",
    height: 156,
    weight: 47,
    vision: "Normal",
    hearing: "Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "-",
    allergies: "-",
    healthNotes: "Sehat",
    fatherName: "Herman Wijaya",
    fatherPhone: "087890123457",
    motherName: "Dewi Wijaya",
    motherPhone: "087890123458",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    enrollmentYear: 2024,
    status: "active",
    additionalNotes: "-",
  },
  {
    id: "8",
    name: "Irfan Kurniawan",
    nickname: "Irfan",
    nis: "2025008",
    nisn: "0012345685",
    class: "XI IPS 1",
    attendanceNumber: 2,
    gender: "L",
    birthPlace: "Makassar",
    birthDate: "2009-12-03",
    religion: "Islam",
    phone: "088901234567",
    address: "Jl. Bougenville No. 9, RT 001/RW 003, Kel. Ballaparang, Kec. Rappocini, Makassar 90222",
    bloodType: "A",
    height: 168,
    weight: 58,
    vision: "Normal",
    hearing: "Tidak Normal",
    teeth: "Normal",
    disability: "Tidak Ada",
    illnessHistory: "Otitis media 2023",
    allergies: "-",
    healthNotes: "Peka terhadap suara keras di telinga kanan",
    fatherName: "Rudi Kurniawan",
    fatherPhone: "088901234568",
    motherName: "Sari Kurniawan",
    motherPhone: "088901234569",
    guardianName: "Bapak Hari",
    guardianRelation: "Kakek",
    guardianPhone: "088901234570",
    enrollmentYear: 2024,
    status: "active",
    additionalNotes: "Wali: Kakek (karena orang tua bekerja di luar kota)",
  },
];

// Available classes
const availableClasses = [
  { value: "", label: "Semua Kelas" },
  { value: "X IPA 1", label: "X IPA 1" },
  { value: "X IPA 2", label: "X IPA 2" },
  { value: "X IPS 1", label: "X IPS 1" },
  { value: "XI IPA 1", label: "XI IPA 1" },
  { value: "XI IPS 1", label: "XI IPS 1" },
];

// Student Detail Modal Component
interface StudentDetailModalProps {
  student: typeof sampleStudents[0] | null;
  isOpen: boolean;
  onClose: () => void;
}

function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  const isActive = student.status === "active";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content - Slide up from bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[32px] max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-[var(--border-light)] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-[var(--border-light)]/60">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold",
                  student.gender === "L"
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "bg-pink-100 text-pink-600"
                )}
              >
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  {student.name}
                </h2>
                <p className="text-[13px] text-[var(--text-muted)] font-mono">
                  NIS: {student.nis}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 text-[11px] font-medium rounded-lg",
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                  <span className="text-[12px] text-[var(--text-muted)]">
                    {student.class}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 pb-[calc(24px+env(safe-area-inset-bottom,24px))] max-h-[calc(90vh-220px)]">
          {/* 1. Data Diri */}
          <Section title="Data Diri" icon={<User className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Nama Lengkap" value={student.name} fullWidth />
              {student.nickname && <InfoItem label="Nama Panggilan" value={student.nickname} />}
              <InfoItem label="Jenis Kelamin" value={student.gender === "L" ? "Laki-laki" : "Perempuan"} />
              <InfoItem label="Tempat Lahir" value={student.birthPlace} />
              <InfoItem label="Tanggal Lahir" value={`${formatDate(student.birthDate)} (${formatAge(student.birthDate)})`} fullWidth />
              <InfoItem label="Gol. Darah" value={student.bloodType} />
              <InfoItem label="Agama" value={student.religion} />
              {student.phone && <InfoItem label="No. WhatsApp" value={student.phone} icon={<Phone className="w-3 h-3" />} fullWidth />}
              {student.address && <InfoItem label="Alamat Lengkap" value={student.address} icon={<MapPin className="w-3 h-3" />} fullWidth />}
            </div>
          </Section>

          {/* 2. Data Akademik */}
          <Section title="Data Akademik" icon={<BookOpen className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Kelas" value={student.class} />
              <InfoItem label="No. Absen" value={student.attendanceNumber.toString()} />
              <InfoItem label="NISN" value={student.nisn} />
              <InfoItem label="NIS" value={student.nis} />
              <InfoItem label="Angkatan" value={student.enrollmentYear.toString()} />
              <InfoItem
                label="Status"
                value={
                  <span className={cn(
                    "px-2 py-0.5 text-[11px] font-medium rounded-lg",
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                }
              />
            </div>
          </Section>

          {/* 3. Orang Tua/Wali */}
          <Section title="Orang Tua/Wali" icon={<Users className="w-4 h-4" />}>
            <div className="space-y-3">
              {/* Ayah */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <UserRound className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[13px] font-semibold text-blue-700">Ayah</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">{student.fatherName}</p>
                  <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {student.fatherPhone}
                  </p>
                </div>
              </div>

              {/* Ibu */}
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Baby className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-[13px] font-semibold text-pink-700">Ibu</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">{student.motherName}</p>
                  <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {student.motherPhone}
                  </p>
                </div>
              </div>

              {/* Wali (jika ada) */}
              {student.guardianName && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-[13px] font-semibold text-purple-700">
                      Wali - {student.guardianRelation || "Lainnya"}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">{student.guardianName}</p>
                    {student.guardianPhone && (
                      <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        {student.guardianPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* 4. Data Kesehatan */}
          <Section title="Data Kesehatan" icon={<Heart className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Tinggi" value={`${student.height} cm`} />
              <InfoItem label="Berat" value={`${student.weight} kg`} />
              <InfoItem label="Penglihatan" value={student.vision} icon={<Eye className="w-3 h-3" />} />
              <InfoItem label="Pendengaran" value={student.hearing} icon={<Activity className="w-3 h-3" />} />
              <InfoItem label="Gigi & Mulut" value={student.teeth} />
              <InfoItem label="Cacat Tubuh" value={student.disability} />
            </div>
            {(student.illnessHistory !== "-" || student.allergies !== "-") && (
              <div className="mt-3 space-y-2">
                {student.illnessHistory !== "-" && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-[11px] text-amber-600 font-medium mb-1">Riwayat Sakit</p>
                    <p className="text-[13px] text-[var(--text-primary)]">{student.illnessHistory}</p>
                  </div>
                )}
                {student.allergies !== "-" && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-[11px] text-red-600 font-medium mb-1">Alergi</p>
                    <p className="text-[13px] text-[var(--text-primary)]">{student.allergies}</p>
                  </div>
                )}
                {student.healthNotes !== "-" && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-[11px] text-blue-600 font-medium mb-1">Catatan Kesehatan</p>
                    <p className="text-[13px] text-[var(--text-primary)]">{student.healthNotes}</p>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* 5. Lainnya */}
          <Section title="Lainnya" icon={<FileText className="w-4 h-4" />}>
            {(student.healthNotes && student.healthNotes !== "-") || (student.additionalNotes && student.additionalNotes !== "-") ? (
              <div className="space-y-3">
                {student.healthNotes && student.healthNotes !== "-" && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-[11px] text-blue-600 font-medium mb-1">Catatan Kesehatan</p>
                    <p className="text-[13px] text-[var(--text-primary)]">{student.healthNotes}</p>
                  </div>
                )}
                {student.additionalNotes && student.additionalNotes !== "-" && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-600 font-medium mb-1">Catatan Tambahan</p>
                    <p className="text-[13px] text-[var(--text-primary)]">{student.additionalNotes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[13px] text-[var(--text-muted)] text-center py-4 bg-[var(--surface-secondary)] rounded-xl">
                Tidak ada catatan tambahan
              </p>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}

// Section Component
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-[var(--primary)]">{icon}</div>
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Info Item Component
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

function InfoItem({ label, value, icon, fullWidth }: InfoItemProps) {
  return (
    <div className={cn(fullWidth ? "col-span-2" : "")}>
      <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
        <p className="text-[13px] font-medium text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

// Main Page Component
export default function MobileBukuIndukPage() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof sampleStudents[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter students based on search and class
  const filteredStudents = useMemo(() => {
    return sampleStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.nis.includes(search);
      const matchesClass = selectedClass === "" || student.class === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [search, selectedClass]);

  // Open student detail
  const openStudentDetail = (student: typeof sampleStudents[0]) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  // Close student detail
  const closeStudentDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  return (
    <MobileShell>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[var(--text-primary)]">
          Buku Induk
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Daftar siswa aktif
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-10 text-[14px] bg-[var(--surface-primary)] border border-[var(--border-light)]/60 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors"
          >
            <span className="text-[var(--text-muted)] text-xs">✕</span>
          </button>
        )}
      </div>

      {/* Class Filter */}
      <div className="mb-4">
        <Select
          options={availableClasses}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          placeholder="Semua Kelas"
        />
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-[var(--text-muted)]">
          Menampilkan <span className="font-medium text-[var(--text-primary)]">{filteredStudents.length}</span> siswa
        </p>
        {selectedClass && (
          <button
            onClick={() => setSelectedClass("")}
            className="text-[12px] text-[var(--primary)] hover:underline"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Student List */}
      <Card className="p-0 overflow-hidden" padding="none">
        {/* Student List */}
        <div className="divide-y divide-[var(--border-light)]/40">
          {filteredStudents.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-[14px] text-[var(--text-secondary)]">
                {search || selectedClass
                  ? "Tidak ada siswa yang cocok"
                  : "Belum ada data siswa"}
              </p>
              {(search || selectedClass) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedClass("");
                  }}
                  className="mt-3 text-[13px] text-[var(--primary)] hover:underline"
                >
                  Reset pencarian
                </button>
              )}
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer active:bg-[var(--surface-secondary)]"
                onClick={() => openStudentDetail(student)}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                    student.gender === "L"
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "bg-pink-100 text-pink-600"
                  )}
                >
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                    {student.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {student.nis}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">•</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {student.class}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailOpen}
        onClose={closeStudentDetail}
      />

      {/* Animation Style */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </MobileShell>
  );
}
