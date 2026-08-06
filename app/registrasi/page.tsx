"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"
import {
  Smartphone,
  Shield,
  Clock,
  ChevronRight,
  Lock,
  Loader2,
  AlertCircle,
  X,
  User,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Heart,
  FileText,
  Search,
  Eye,
} from "lucide-react"
import {
  getRegistrationSettings,
  incrementAccessCount,
  getRegistrationSession,
  isSessionValid,
} from "@/lib/registrasi"
import { supabase } from "@/lib/supabase"
import { useAcademicYear } from "@/hooks"
import { cn } from "@/lib/utils"
import type { StudentWithClass, Parent } from "@/types/database"

// Format helpers
const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Student interface for modal display
interface StudentDisplay {
  id: string;
  full_name: string;
  nickname: string | null;
  student_number: string;
  nisn: string | null;
  class_name: string;
  academic_year_name: string | null;
  attendance_number: number | null;
  gender: "male" | "female";
  birth_place: string | null;
  birth_date: string | null;
  religion: string | null;
  phone: string | null;
  address: string | null;
  blood_type: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  vision: string | null;
  hearing: string | null;
  teeth_condition: string | null;
  physical_disability: string | null;
  illness_history: string | null;
  allergies: string | null;
  health_notes: string | null;
  is_active: boolean;
  notes: string | null;
  father: Parent | null;
  mother: Parent | null;
  guardian: Parent | null;
}

// Transform database student to display format
function transformStudent(
  student: StudentWithClass,
  activeClass: (typeof student.student_classes)[0] | undefined,
  parents: Parent[]
): StudentDisplay {
  const father = parents.find(p => p.type === "father") || null;
  const mother = parents.find(p => p.type === "mother") || null;
  const guardian = parents.find(p => p.type === "guardian") || null;

  return {
    id: student.id,
    full_name: student.full_name,
    nickname: student.nickname,
    student_number: student.student_number,
    nisn: student.nisn,
    class_name: activeClass?.classes?.name || "-",
    academic_year_name: activeClass?.academic_years?.name || null,
    attendance_number: activeClass?.attendance_number || null,
    gender: student.gender,
    birth_place: student.birth_place,
    birth_date: student.birth_date,
    religion: student.religion,
    phone: student.phone,
    address: student.address,
    blood_type: student.blood_type,
    height_cm: student.height_cm,
    weight_kg: student.weight_kg,
    vision: student.vision,
    hearing: student.hearing,
    teeth_condition: student.teeth_condition,
    physical_disability: student.physical_disability,
    illness_history: student.illness_history,
    allergies: student.allergies,
    health_notes: student.health_notes,
    is_active: student.is_active,
    notes: student.notes,
    father,
    mother,
    guardian,
  };
}

// Health Badge Component
function HealthBadge({ label, value }: { label: string; value: string }) {
  const isNormal = value === "Normal" || value.includes("cm") || value.includes("kg") || value === "-";
  return (
    <div className={cn(
      "p-2 rounded-xl text-center",
      isNormal ? "bg-emerald-50" : "bg-amber-50"
    )}>
      <p className="text-[8px] text-[var(--text-muted)] uppercase">{label}</p>
      <p className={cn(
        "text-[11px] font-semibold mt-0.5",
        isNormal ? "text-emerald-700" : "text-amber-700"
      )}>
        {value}
      </p>
    </div>
  );
}

// Student Detail Modal Component
interface StudentDetailModalProps {
  student: StudentDisplay | null;
  isOpen: boolean;
  onClose: () => void;
}

function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  const genderLabel = student.gender === "male" ? "Laki-laki" : student.gender === "female" ? "Perempuan" : "-";

  return (
    <div className="fixed inset-0 z-[100] animate-slide-up">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-white to-slate-50 rounded-t-[28px] flex flex-col shadow-[0_-4px_30px_rgba(0,0,0,0.15)]"
        style={{ top: "calc(66px + env(safe-area-inset-top))" }}
      >
        {/* Drag Handle Area */}
        <div className="flex-none px-5 pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-muted)] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex-none px-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl text-base font-bold shadow-lg flex items-center justify-center flex-shrink-0",
              student.gender === "male"
                ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                : "bg-gradient-to-br from-pink-400 to-pink-500 text-white"
            )}>
              {student.full_name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)] truncate">
                {student.full_name || "-"}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {student.student_number || "-"} • {student.class_name || "-"}
              </p>
            </div>
            <span className={cn(
              "px-2.5 py-1 text-[10px] font-semibold rounded-full shadow-sm flex-none",
              student.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            )}>
              {student.is_active ? "● Aktif" : "○ Nonaktif"}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-[calc(120px+env(safe-area-inset-bottom,24px))] space-y-4">
          {/* 1. Data Diri */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Data Diri</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Nama Lengkap</p>
                <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">{student.full_name || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Nama Panggilan</p>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.nickname || "-"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Jenis Kelamin</p>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{genderLabel}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Tempat Lahir</p>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.birth_place || "-"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Tanggal Lahir</p>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.birth_date ? formatDate(student.birth_date) : "-"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Agama</p>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.religion || "-"}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">No. WhatsApp</p>
                <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  {student.phone || "-"}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Alamat Lengkap</p>
                <p className="text-[12px] text-[var(--text-primary)] mt-0.5 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                  {student.address || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Data Akademik */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Data Akademik</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Kelas</p>
                <p className="text-[13px] font-semibold text-[var(--text-primary)] mt-0.5">{student.class_name || "-"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">No. Absen</p>
                <p className="text-[13px] font-semibold text-[var(--text-primary)] mt-0.5">{student.attendance_number || "-"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">NISN</p>
                <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.nisn || "-"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">NIS</p>
                <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.student_number || "-"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Tahun Ajaran</p>
                <p className="text-[12px] font-medium text-[var(--text-primary)] mt-0.5">{student.academic_year_name || "-"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Status</p>
                <span className={cn(
                  "inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full",
                  student.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                )}>
                  {student.is_active ? "● Aktif" : "○ Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Orang Tua/Wali */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Orang Tua / Wali</h3>
            </div>
            <div className="space-y-2.5">
              {/* Ayah */}
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {student.father?.full_name ? student.father.full_name.split(" ")[0][0] : "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Ayah</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">{student.father?.full_name || "-"}</p>
                  <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {student.father?.phone || "-"}
                  </p>
                </div>
              </div>

              {/* Ibu */}
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-50 to-pink-100/50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {student.mother?.full_name ? student.mother.full_name.split(" ")[0][0] : "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">Ibu</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">{student.mother?.full_name || "-"}</p>
                  <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {student.mother?.phone || "-"}
                  </p>
                </div>
              </div>

              {/* Wali */}
              {student.guardian && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-md">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                        Wali {student.guardian.guardian_relation ? `• ${student.guardian.guardian_relation}` : ""}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">{student.guardian.full_name}</p>
                    <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {student.guardian.phone || "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Data Kesehatan */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Data Kesehatan</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <HealthBadge label="Tinggi" value={student.height_cm ? `${student.height_cm} cm` : "-"} />
              <HealthBadge label="Berat" value={student.weight_kg ? `${student.weight_kg} kg` : "-"} />
              <HealthBadge label="Gol. Darah" value={student.blood_type || "-"} />
              <HealthBadge label="Penglihatan" value={student.vision || "-"} />
              <HealthBadge label="Pendengaran" value={student.hearing || "-"} />
              <HealthBadge label="Gigi & Mulut" value={student.teeth_condition || "-"} />
              <HealthBadge label="Cacat Tubuh" value={student.physical_disability || "-"} />
            </div>
            {(student.illness_history || student.allergies || (student.health_notes && student.health_notes !== "-")) && (
              <div className="mt-3 space-y-2">
                {student.illness_history && student.illness_history !== "-" && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-[10px] text-amber-600 font-semibold mb-0.5">⚠️ Riwayat Sakit</p>
                    <p className="text-[12px] text-[var(--text-primary)]">{student.illness_history}</p>
                  </div>
                )}
                {student.allergies && student.allergies !== "-" && (
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-[10px] text-red-600 font-semibold mb-0.5">⚠️ Alergi</p>
                    <p className="text-[12px] text-[var(--text-primary)]">{student.allergies}</p>
                  </div>
                )}
                {student.health_notes && student.health_notes !== "-" && (
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-[10px] text-blue-600 font-semibold mb-0.5">📝 Catatan Kesehatan</p>
                    <p className="text-[12px] text-[var(--text-primary)] leading-relaxed">{student.health_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Lainnya - Catatan Tambahan */}
          {student.notes && student.notes !== "-" ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Lainnya</h3>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-600 font-semibold mb-0.5">Catatan Tambahan</p>
                <p className="text-[12px] text-[var(--text-primary)] leading-relaxed">{student.notes}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Input Form for NIS and Birth Date
interface LookupFormProps {
  nis: string;
  birthDate: string;
  onNisChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function LookupForm({ nis, birthDate, onNisChange, onBirthDateChange, onSubmit, onCancel, isLoading }: LookupFormProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg shadow-[var(--primary)]/10">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
          <Search className="w-7 h-7 text-[var(--primary)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
          Lihat Data Diri
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Masukkan NIS dan tanggal lahir untuk melihat data dirimu
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            NIS <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nis}
            onChange={(e) => onNisChange(e.target.value)}
            placeholder="Masukkan NIS"
            className="w-full h-12 px-4 text-sm bg-[var(--surface-secondary)] border border-[var(--border-light)]/60 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Tanggal Lahir <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="w-full h-12 px-4 text-sm bg-[var(--surface-secondary)] border border-[var(--border-light)]/60 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 h-12"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1 h-12"
          onClick={onSubmit}
          disabled={isLoading || !nis || !birthDate}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              Cari
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  const router = useRouter()
  const { academicYear } = useAcademicYear()
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State untuk fitur "Lihat Data Diri"
  const [showLookupModal, setShowLookupModal] = useState(false)
  const [lookupNis, setLookupNis] = useState("")
  const [lookupBirthDate, setLookupBirthDate] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Check if registration is enabled and handle existing session
  useEffect(() => {
    checkRegistration()
  }, [])

  async function checkRegistration() {
    try {
      // Increment access count
      await incrementAccessCount()

      // Check settings
      const settings = await getRegistrationSettings()
      setIsEnabled(settings.isEnabled)

      // Check for existing valid session
      const hasValidSession = isSessionValid()
      if (hasValidSession) {
        const session = getRegistrationSession()
        if (session?.studentId) {
          // Has valid session, redirect to form
          router.replace(`/registrasi/form?studentId=${session.studentId}`)
          return
        }
      }
    } catch (err) {
      console.error("Error checking registration:", err)
      setError("Terjadi kesalahan saat memuat halaman")
    } finally {
      setIsLoading(false)
    }
  }

  function handleManualEntry() {
    router.push("/registrasi/verify")
  }

  // Fungsi untuk mencari data siswa
  async function handleLookup() {
    if (!lookupNis || !lookupBirthDate) return

    setIsSearching(true)
    setSearchError(null)

    try {
      // Format tanggal lahir untuk comparison
      const birthDateFormatted = new Date(lookupBirthDate).toISOString().split("T")[0]

      // Cari siswa berdasarkan NIS dan tanggal lahir
      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          student_classes (
            *,
            classes (
              *,
              majors (*)
            ),
            academic_years (*)
          ),
          parents (*)
        `)
        .eq("student_number", lookupNis)
        .eq("birth_date", birthDateFormatted)
        .single()

      if (error || !data) {
        setSearchError("Data tidak ditemukan. Pastikan NIS dan tanggal lahir yang kamu masukkan benar.")
        setSelectedStudent(null)
        return
      }

      // Transform data ke format display
      const activeClass = data.student_classes?.find(
        (sc: any) => sc.academic_year_id === academicYear?.id && sc.status === "active"
      )
      const transformedStudent = transformStudent(data, activeClass, data.parents || [])

      setSelectedStudent(transformedStudent)
      setShowLookupModal(false)
      setIsDetailOpen(true)
    } catch (err) {
      console.error("Error searching student:", err)
      setSearchError("Terjadi kesalahan saat mencari data. Silakan coba lagi.")
      setSelectedStudent(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Buka modal lookup
  function handleOpenLookup() {
    setLookupNis("")
    setLookupBirthDate("")
    setSearchError(null)
    setShowLookupModal(true)
  }

  // Tutup modal lookup
  function handleCloseLookup() {
    setShowLookupModal(false)
    setLookupNis("")
    setLookupBirthDate("")
    setSearchError(null)
  }

  // Tutup modal detail siswa
  function handleCloseDetail() {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedStudent(null), 300)
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Memuat...
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Menghubungi server...
          </p>
        </div>
      </div>
    )
  }

  // Show error if any
  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {error}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  // Registration is disabled
  if (isEnabled === false) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[var(--primary)]/10 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Registrasi Ditutup
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
           Maaf, halaman registrasi sementara tidak tersedia. Silakan hubungi admin sekolah untuk informasi lebih lanjut.
          </p>
          <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <p className="text-sm text-[var(--text-muted)]">
              💡 <strong>Catatan:</strong> Hubungi admin sekolah jika kamu merasa ini adalah kesalahan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default: Welcome page
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[var(--primary)]/10 mb-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--primary)]/30">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Registrasi Siswa Baru
          </h1>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Halo! Selamat datang di halaman registrasi mandiri. Silakan lengkapi data dirimu
            dengan mengikuti langkah-langkah di bawah ini.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Masukkan Kode Registrasi</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Masukkan kode yang diberikan sekolah
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Verifikasi Identitas</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Masukkan NIS dan tanggal lahir untuk verifikasi
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Isi Form Data (6 Langkah)</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Data Diri → Alamat → Akademik → Orang Tua → Kesehatan → Lainnya
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full h-14 text-base"
            onClick={handleManualEntry}
          >
            <Shield className="w-5 h-5" />
            Masukkan Kode Registrasi
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base border-2"
            onClick={handleOpenLookup}
          >
            <Eye className="w-5 h-5" />
            Lihat Data Diri
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)] mb-1">
              Waktu Pengerjaan
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Registrasi membutuhkan waktu sekitar 5-10 menit. Pastikan kamu memiliki
              koneksi internet yang stabil dan prepare data yang diperlukan.
            </p>
          </div>
        </div>
      </div>

      {/* Lookup Modal - Form Input NIS dan Tanggal Lahir */}
      {showLookupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseLookup}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md">
            <LookupForm
              nis={lookupNis}
              birthDate={lookupBirthDate}
              onNisChange={setLookupNis}
              onBirthDateChange={setLookupBirthDate}
              onSubmit={handleLookup}
              onCancel={handleCloseLookup}
              isLoading={isSearching}
            />

            {/* Error Message */}
            {searchError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{searchError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
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
    </div>
  )
}
