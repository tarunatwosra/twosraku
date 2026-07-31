"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  ChevronRight,
  X,
  Phone,
  MapPin,
  User,
  Heart,
  Users,
  BookOpen,
  Shield,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAcademicYear } from "@/hooks";
import type { StudentWithClass, StudentFilters, Class, Parent } from "@/types/database";

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

const formatAge = (birthDate: string | null) => {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  const today = new Date();
  const age = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return `${age} tahun`;
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-white to-slate-50 rounded-t-[28px] max-h-[92vh] flex flex-col shadow-[0_-4px_30px_rgba(0,0,0,0.15)]">
        {/* Drag Handle Area */}
        <div className="flex-none pt-[env(safe-area-inset-top,12px)] px-5 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="w-10 h-1 bg-slate-300 rounded-full mt-2" />
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
            <Avatar
              src={undefined}
              fallback={student.full_name}
              size="md"
              className={cn(
                "w-12 h-12 rounded-2xl text-base font-bold shadow-lg flex-shrink-0",
                student.gender === "male"
                  ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                  : "bg-gradient-to-br from-pink-400 to-pink-500 text-white"
              )}
            />
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
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Cacat Tubuh</p>
              <p className="text-[12px] text-[var(--text-primary)] mt-0.5">{student.physical_disability || "-"}</p>
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

// Main Page Component
export default function MobileBukuIndukPage() {
  const { academicYear } = useAcademicYear();

  // State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch classes - hanya kelas yang memiliki siswa di tahun ajaran aktif
  useEffect(() => {
    const fetchClasses = async () => {
      if (!academicYear?.id) {
        setClasses([]);
        return;
      }

      try {
        // Ambil student_classes untuk tahun ajaran aktif
        const { data: studentClasses } = await supabase
          .from("student_classes")
          .select("class_id")
          .eq("academic_year_id", academicYear.id)
          .eq("status", "active");

        if (!studentClasses || studentClasses.length === 0) {
          setClasses([]);
          return;
        }

        // Ambil unique class IDs
        const uniqueClassIds = [...new Set(studentClasses.map(sc => sc.class_id))];

        // Ambil detail kelas
        const { data, error } = await supabase
          .from("classes")
          .select("*, majors(*)")
          .eq("status", "active")
          .in("id", uniqueClassIds)
          .order("name", { ascending: true });

        if (error) throw error;
        setClasses(data || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, [academicYear?.id]);

  // Fetch students - selalu filter berdasarkan tahun ajaran aktif
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      // Pastikan ada tahun ajaran aktif
      if (!academicYear?.id) {
        setStudents([]);
        setLoading(false);
        return;
      }

      let studentIds: string[] = [];

      // Ambil siswa berdasarkan tahun ajaran aktif
      const { data: studentClassesData, error: scError } = await supabase
        .from("student_classes")
        .select("student_id, class_id")
        .eq("academic_year_id", academicYear.id)
        .eq("status", "active");

      if (scError) throw scError;

      // Jika ada filter kelas, ambil hanya siswa di kelas tersebut
      if (selectedClassId) {
        studentIds = (studentClassesData || [])
          .filter(sc => sc.class_id === selectedClassId)
          .map(sc => sc.student_id);
      } else {
        // Jika tidak ada filter kelas, ambil semua siswa di tahun ajaran aktif
        studentIds = (studentClassesData || []).map(sc => sc.student_id);
      }

      // Jika tidak ada siswa yang match, tampilkan empty
      if (studentIds.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Build students query
      let query = supabase
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
        `, { count: "exact" })
        .in("id", studentIds);

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(
          `full_name.ilike.%${debouncedSearch}%,student_number.ilike.%${debouncedSearch}%,nickname.ilike.%${debouncedSearch}%`
        );
      }

      // Sort by name
      query = query.order("full_name", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      // Transform to display format
      const displayStudents = (data || []).map((student) => {
        const activeClass = student.student_classes?.find(
          (sc: any) => sc.academic_year_id === academicYear?.id && sc.status === "active"
        );
        return transformStudent(student, activeClass, student.parents || []);
      });

      setStudents(displayStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [academicYear?.id, selectedClassId, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Class options for select
  const classOptions = useMemo(() => {
    const options = [{ value: "", label: "Semua Kelas" }];
    classes.forEach((cls) => {
      const className = `${cls.majors?.name || ""} ${cls.name}`.trim();
      options.push({ value: cls.id, label: className });
    });
    return options;
  }, [classes]);

  // Open student detail
  const openStudentDetail = (student: StudentDisplay) => {
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
          {loading ? "Memuat..." : `${students.length} siswa`}
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
          options={classOptions}
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          placeholder="Semua Kelas"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
          <span className="ml-2 text-[14px] text-[var(--text-muted)]">Memuat data...</span>
        </div>
      )}

      {/* Student List */}
      {!loading && (
        <Card className="p-0 overflow-hidden" padding="none">
          <div className="divide-y divide-[var(--border-light)]/40">
            {students.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--text-secondary)]">
                  {search || selectedClassId
                    ? "Tidak ada siswa yang cocok"
                    : "Belum ada data siswa"}
                </p>
                {(search || selectedClassId) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedClassId("");
                    }}
                    className="mt-3 text-[13px] text-[var(--primary)] hover:underline"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer active:bg-[var(--surface-secondary)]"
                  onClick={() => openStudentDetail(student)}
                >
                  <Avatar
                    src={undefined}
                    fallback={student.full_name}
                    size="sm"
                    className={cn(
                      "w-11 h-11 rounded-xl text-sm font-bold flex-shrink-0",
                      student.gender === "male"
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "bg-pink-100 text-pink-600"
                    )}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                      {student.full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {student.student_number}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">•</span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {student.class_name}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
              ))
            )}
          </div>
        </Card>
      )}

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
