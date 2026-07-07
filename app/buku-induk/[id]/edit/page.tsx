"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Pencil,
  GraduationCap,
  Heart,
  Users,
  StickyNote,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Card, Button, Input, Select } from "@/components/ui"
import { fetchStudent, updateStudent, checkDuplicateNIS } from "../../lib/supabase"
import { useAcademicYear, useClasses } from "@/hooks"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

// ============================================
// CONSTANTS
// ============================================

const GENDERS = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
]

const BLOOD_TYPES = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
  { value: "unknown", label: "Tidak Tahu" },
]

const RELIGIONS = [
  { value: "Islam", label: "Islam" },
  { value: "Kristen", label: "Kristen" },
  { value: "Katolik", label: "Katolik" },
  { value: "Hindu", label: "Hindu" },
  { value: "Buddha", label: "Buddha" },
  { value: "Konghucu", label: "Konghucu" },
  { value: "Kepercayaan Lainnya", label: "Kepercayaan Lainnya" },
]

const VISION_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "abnormal", label: "Tidak Normal" },
]

const HEARING_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "abnormal", label: "Tidak Normal" },
]

const TEETH_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "abnormal", label: "Tidak Normal" },
]

const PHYSICAL_DISABILITY_OPTIONS = [
  { value: "none", label: "Tidak Ada" },
  { value: "exists", label: "Ada" },
]

const ACTIVE_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Tidak Aktif" },
]

const GUARDIAN_RELATION_OPTIONS = [
  { value: "grandfather", label: "Kakek" },
  { value: "grandmother", label: "Nenek" },
  { value: "uncle", label: "Paman" },
  { value: "aunt", label: "Tante" },
  { value: "sibling", label: "Kakak" },
  { value: "orphanage", label: "Pengurus Panti" },
  { value: "other", label: "Lainnya" },
]

// ============================================
// TYPES
// ============================================

interface FormData {
  // Data Diri
  student_number: string
  nisn: string
  full_name: string
  nickname: string
  gender: "male" | "female"
  blood_type: string
  birth_place: string
  birth_date: string
  religion: string
  phone: string
  address: string

  // Data Akademik
  class_id: string
  enrollment_year: number

  // Data Orang Tua
  father_name: string
  father_phone: string
  mother_name: string
  mother_phone: string
  guardian_name: string
  guardian_relation: string
  guardian_phone: string

  // Fisik dan Kesehatan
  height_cm: string
  weight_kg: string
  vision: string
  hearing: string
  teeth: string
  physical_disability: string
  illness_history: string
  allergies: string
  health_notes: string

  // Lainnya
  is_active: boolean
  notes: string
}

interface FormErrors {
  [key: string]: string
}

// ============================================
// VALIDATION
// ============================================

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  // NIS (required)
  if (!data.student_number.trim()) {
    errors.student_number = "NIS wajib diisi"
  }

  // Nama Lengkap (required)
  if (!data.full_name.trim()) {
    errors.full_name = "Nama lengkap wajib diisi"
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = "Nama minimal 2 karakter"
  }

  // Gender (required)
  if (!data.gender) {
    errors.gender = "Jenis kelamin wajib dipilih"
  }

  // Tanggal Lahir (required)
  if (!data.birth_date) {
    errors.birth_date = "Tanggal lahir wajib diisi"
  } else {
    const birthDate = new Date(data.birth_date)
    const today = new Date()
    if (birthDate > today) {
      errors.birth_date = "Tanggal lahir tidak valid"
    }
  }

  // NISN format (10 digit)
  if (data.nisn && !/^\d{10}$/.test(data.nisn)) {
    errors.nisn = "NISN harus 10 digit angka"
  }

  // Phone format (Indonesian)
  if (data.phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Format nomor tidak valid"
  }

  // Father phone
  if (data.father_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.father_phone.replace(/\s/g, ""))) {
    errors.father_phone = "Format nomor tidak valid"
  }

  // Mother phone
  if (data.mother_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.mother_phone.replace(/\s/g, ""))) {
    errors.mother_phone = "Format nomor tidak valid"
  }

  // Guardian phone
  if (data.guardian_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.guardian_phone.replace(/\s/g, ""))) {
    errors.guardian_phone = "Format nomor tidak valid"
  }

  return errors
}

// ============================================
// COMPONENTS
// ============================================

function FormSection({
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function FormField({
  children,
  fullWidth,
}: {
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return <div className={fullWidth ? "md:col-span-2" : ""}>{children}</div>
}

function SectionDivider({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="col-span-2 my-2">
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[var(--surface-secondary)] via-[var(--surface-hover)]/50 to-[var(--surface-secondary)] rounded-2xl border border-[var(--border-light)]/50 shadow-sm">
        <div className="w-1 h-10 bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/50 rounded-full shadow-sm shadow-[var(--primary)]/20" />
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm">
              {icon}
            </div>
          )}
          <div>
            <span className="text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
              {title}
            </span>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Lengkapi data di bawah ini dengan benar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

interface EditStudentPageProps {
  params: Promise<{ id: string }>
}

export default function EditStudentPage({ params }: EditStudentPageProps) {
  const router = useRouter()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    // Data Diri
    student_number: "",
    nisn: "",
    full_name: "",
    nickname: "",
    gender: "" as "male" | "female",
    blood_type: "",
    birth_place: "",
    birth_date: "",
    religion: "",
    phone: "",
    address: "",

    // Data Akademik
    class_id: "",
    enrollment_year: new Date().getFullYear(),

    // Data Orang Tua
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_phone: "",

    // Fisik dan Kesehatan
    height_cm: "",
    weight_kg: "",
    vision: "normal",
    hearing: "normal",
    teeth: "normal",
    physical_disability: "none",
    illness_history: "",
    allergies: "",
    health_notes: "",

    // Lainnya
    is_active: true,
    notes: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Academic data
  const { academicYear } = useAcademicYear()
  const { classes } = useClasses({
    academicYearId: academicYear?.id,
  })

  // Resolve params
  useEffect(() => {
    params.then((p) => setStudentId(p.id))
  }, [params])

  // Fetch student data
  useEffect(() => {
    if (!studentId) return

    const loadStudent = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStudent(studentId)
        if (!data) {
          setError("Siswa tidak ditemukan")
          return
        }
        setStudent(data)

        // Pre-fill form
        setFormData({
          // Data Diri
          student_number: data.student_number || "",
          nisn: data.nisn || "",
          full_name: data.full_name || "",
          nickname: data.nickname || "",
          gender: data.gender || "" as "male" | "female",
          blood_type: data.blood_type || "",
          birth_place: data.birth_place || "",
          birth_date: data.birth_date ? data.birth_date.split("T")[0] : "",
          religion: data.religion || "",
          phone: data.phone || "",
          address: data.address || "",

          // Data Akademik
          class_id: (data as any).class_id || "",
          enrollment_year: data.enrollment_year || new Date().getFullYear(),

          // Data Orang Tua - dari parents relation
          father_name: (data as any).father_name || "",
          father_phone: (data as any).father_phone || "",
          mother_name: (data as any).mother_name || "",
          mother_phone: (data as any).mother_phone || "",
          guardian_name: (data as any).guardian_name || "",
          guardian_relation: (data as any).guardian_relation || "",
          guardian_phone: (data as any).guardian_phone || "",

          // Fisik dan Kesehatan
          height_cm: data.height_cm?.toString() || "",
          weight_kg: data.weight_kg?.toString() || "",
          vision: data.vision || "normal",
          hearing: data.hearing || "normal",
          teeth: data.teeth_condition || "normal",
          physical_disability: data.physical_disability || "none",
          illness_history: data.illness_history || "",
          allergies: data.allergies || "",
          health_notes: data.health_notes || "",

          // Lainnya
          is_active: data.is_active ?? true,
          notes: data.notes || "",
        })
      } catch (err) {
        console.error("Error loading student:", err)
        setError("Gagal memuat data siswa")
      } finally {
        setLoading(false)
      }
    }

    loadStudent()
  }, [studentId])

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return

    setSubmitError(null)
    setSubmitSuccess(false)

    // Validate
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorField = Object.keys(validationErrors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      if (element instanceof HTMLElement) {
        element.focus()
      }
      return
    }

    // Check for duplicate NIS
    const isDuplicate = await checkDuplicateNIS(formData.student_number, studentId)
    if (isDuplicate) {
      setErrors({ student_number: "NIS sudah terdaftar" })
      return
    }

    setIsSubmitting(true)

    try {
      const updates: Record<string, unknown> = {
        // Data Diri
        student_number: formData.student_number,
        nisn: formData.nisn || null,
        full_name: formData.full_name,
        nickname: formData.nickname || null,
        gender: formData.gender,
        blood_type: formData.blood_type || null,
        birth_place: formData.birth_place || null,
        birth_date: formData.birth_date || null,
        religion: formData.religion || null,
        phone: formData.phone || null,
        address: formData.address || null,

        // Fisik dan Kesehatan
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        vision: formData.vision || null,
        hearing: formData.hearing || null,
        teeth_condition: formData.teeth || null,
        physical_disability: formData.physical_disability || null,
        illness_history: formData.illness_history || null,
        allergies: formData.allergies || null,
        health_notes: formData.health_notes || null,

        // Lainnya
        is_active: formData.is_active,
        enrollment_year: formData.enrollment_year,
        notes: formData.notes || null,
        updated_at: new Date().toISOString(),
      }

      const result = await updateStudent(studentId, updates)

      if (result.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          router.push(`/buku-induk/${studentId}`)
        }, 1500)
      } else {
        setSubmitError(result.error || "Terjadi kesalahan saat menyimpan data")
      }
    } catch (err) {
      console.error("Error updating student:", err)
      setSubmitError("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.push(`/buku-induk/${studentId}`)
  }

  // Loading state
  if (loading) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href={`/buku-induk/${studentId}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Siswa
          </Link>
        </div>

        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-[var(--surface-hover)] rounded-[28px]" />
          <div className="h-96 bg-[var(--surface-hover)] rounded-[28px]" />
        </div>
      </AppShell>
    )
  }

  // Error state
  if (error || !student) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href="/buku-induk"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Buku Induk
          </Link>
        </div>

        <Card padding="lg" className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-[var(--danger)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            {error || "Siswa Tidak Ditemukan"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Data siswa tidak dapat dimuat
          </p>
          <Button onClick={() => router.push("/buku-induk")}>
            Kembali ke Buku Induk
          </Button>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell showHeader={true}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/buku-induk/${studentId}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Siswa
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
          <Pencil className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[var(--text-primary)]">
            Edit Data Siswa
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-1">
            Ubah data lengkap siswa di buku induk
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card variant="elevated" padding="lg">
          {/* Submit Status */}
          {submitError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-red-50/50 border border-red-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-[14px] text-red-600 font-medium">{submitError}</p>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/50 border border-emerald-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-[14px] text-emerald-700 font-medium">
                  Data siswa berhasil disimpan! Mengalihkan ke halaman detail...
                </p>
              </div>
            </div>
          )}

          {/* Section Divider: Data Diri */}
          <SectionDivider title="Data Diri" icon={<User className="w-5 h-5" />} />

          {/* Section 1: Data Diri */}
          <FormSection title="">
            <FormField>
              <Input
                name="student_number"
                label="NIS"
                placeholder="Contoh: 2024001"
                value={formData.student_number}
                onChange={handleChange}
                error={errors.student_number}
                required
              />
            </FormField>

            <FormField>
              <Input
                name="nisn"
                label="NISN"
                placeholder="10 digit angka"
                value={formData.nisn}
                onChange={handleChange}
                error={errors.nisn}
                maxLength={10}
              />
            </FormField>

            <FormField fullWidth>
              <Input
                name="full_name"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap sesuai akta"
                value={formData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                required
              />
            </FormField>

            <FormField>
              <Input
                name="nickname"
                label="Nama Panggilan"
                placeholder="Nama panggilan (opsional)"
                value={formData.nickname}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Select
                name="gender"
                label="Jenis Kelamin"
                placeholder="Pilih jenis kelamin"
                value={formData.gender}
                onChange={handleChange}
                options={GENDERS}
                error={errors.gender}
                required
              />
            </FormField>

            <FormField>
              <Select
                name="blood_type"
                label="Golongan Darah"
                placeholder="Pilih gol. darah"
                value={formData.blood_type}
                onChange={handleChange}
                options={BLOOD_TYPES}
              />
            </FormField>

            <FormField>
              <Input
                name="birth_place"
                label="Tempat Lahir"
                placeholder="Contoh: Jakarta"
                value={formData.birth_place}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Input
                name="birth_date"
                label="Tanggal Lahir"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                error={errors.birth_date}
                required
              />
            </FormField>

            <FormField>
              <Select
                name="religion"
                label="Agama"
                placeholder="Pilih agama"
                value={formData.religion}
                onChange={handleChange}
                options={RELIGIONS}
              />
            </FormField>

            <FormField>
              <Input
                name="phone"
                label="No. WhatsApp"
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Alamat
                </label>
                <textarea
                  name="address"
                  placeholder="Masukkan alamat lengkap"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={cn(
                    "w-full px-4 py-3",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "resize-none"
                  )}
                />
              </div>
            </FormField>
          </FormSection>

          {/* Section Divider: Data Akademik */}
          <SectionDivider title="Data Akademik" icon={<GraduationCap className="w-5 h-5" />} />

          {/* Section 2: Data Akademik */}
          <FormSection title="">
            <FormField>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Tahun Ajaran
                </label>
                <div className="h-[48px] px-4 flex items-center bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-[18px] text-[15px] text-[var(--text-primary)]">
                  {academicYear?.name || "Tidak ada tahun ajaran aktif"}
                </div>
              </div>
            </FormField>

            <FormField>
              <Input
                name="enrollment_year"
                label="Angkatan"
                type="number"
                placeholder="Contoh: 2024"
                value={formData.enrollment_year.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    enrollment_year: parseInt(e.target.value) || prev.enrollment_year,
                  }))
                }
                required
              />
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Kelas
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className={cn(
                    "w-full h-[48px] px-4",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "cursor-pointer"
                  )}
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.majors?.name} {cls.name || ""}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>
          </FormSection>

          {/* Section Divider: Data Orang Tua/Wali */}
          <SectionDivider title="Data Orang Tua / Wali" icon={<Users className="w-5 h-5" />} />

          {/* Section 3: Data Orang Tua/Wali */}
          <FormSection title="">
            <FormField>
              <Input
                name="father_name"
                label="Nama Ayah"
                placeholder="Nama lengkap ayah"
                value={formData.father_name}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Input
                name="father_phone"
                label="No. HP Ayah"
                placeholder="Contoh: 081234567890"
                value={formData.father_phone}
                onChange={handleChange}
                error={errors.father_phone}
              />
            </FormField>

            <FormField>
              <Input
                name="mother_name"
                label="Nama Ibu"
                placeholder="Nama lengkap ibu"
                value={formData.mother_name}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Input
                name="mother_phone"
                label="No. HP Ibu"
                placeholder="Contoh: 081234567890"
                value={formData.mother_phone}
                onChange={handleChange}
                error={errors.mother_phone}
              />
            </FormField>

            <FormField>
              <Input
                name="guardian_name"
                label="Nama Wali"
                placeholder="Nama lengkap wali"
                value={formData.guardian_name}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Select
                name="guardian_relation"
                label="Hubungan dengan Wali"
                placeholder="Pilih hubungan"
                value={formData.guardian_relation}
                onChange={handleChange}
                options={GUARDIAN_RELATION_OPTIONS}
              />
            </FormField>

            <FormField>
              <Input
                name="guardian_phone"
                label="No. HP Wali"
                placeholder="Contoh: 081234567890"
                value={formData.guardian_phone}
                onChange={handleChange}
                error={errors.guardian_phone}
              />
            </FormField>
          </FormSection>

          {/* Section Divider: Fisik dan Kesehatan */}
          <SectionDivider title="Fisik dan Kesehatan" icon={<Heart className="w-5 h-5" />} />

          {/* Section 4: Fisik dan Kesehatan */}
          <FormSection title="">
            <FormField>
              <Input
                name="height_cm"
                label="Tinggi Badan (cm)"
                type="number"
                placeholder="Contoh: 165"
                value={formData.height_cm}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Input
                name="weight_kg"
                label="Berat Badan (kg)"
                type="number"
                placeholder="Contoh: 55"
                value={formData.weight_kg}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Select
                name="vision"
                label="Penglihatan"
                value={formData.vision}
                onChange={handleChange}
                options={VISION_OPTIONS}
              />
            </FormField>

            <FormField>
              <Select
                name="hearing"
                label="Pendengaran"
                value={formData.hearing}
                onChange={handleChange}
                options={HEARING_OPTIONS}
              />
            </FormField>

            <FormField>
              <Select
                name="teeth"
                label="Gigi dan Mulut"
                value={formData.teeth}
                onChange={handleChange}
                options={TEETH_OPTIONS}
              />
            </FormField>

            <FormField>
              <Select
                name="physical_disability"
                label="Cacat Tubuh"
                value={formData.physical_disability}
                onChange={handleChange}
                options={PHYSICAL_DISABILITY_OPTIONS}
              />
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Riwayat Sakit
                </label>
                <textarea
                  name="illness_history"
                  placeholder="Contoh: Asma, Diabetes, dll (kosongkan jika tidak ada)"
                  value={formData.illness_history}
                  onChange={handleChange}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-3",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "resize-none"
                  )}
                />
              </div>
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Alergi
                </label>
                <textarea
                  name="allergies"
                  placeholder="Contoh: Alergi udang, alergi debu, dll (kosongkan jika tidak ada)"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-3",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "resize-none"
                  )}
                />
              </div>
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Catatan Kesehatan
                </label>
                <textarea
                  name="health_notes"
                  placeholder="Catatan kesehatan tambahan (opsional)"
                  value={formData.health_notes}
                  onChange={handleChange}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-3",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "resize-none"
                  )}
                />
              </div>
            </FormField>
          </FormSection>

          {/* Section Divider: Lainnya */}
          <SectionDivider title="Lainnya" icon={<StickyNote className="w-5 h-5" />} />

          {/* Section 5: Lainnya */}
          <FormSection title="">
            <FormField>
              <Select
                name="is_active"
                label="Status Siswa"
                value={formData.is_active.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.value === "true",
                  }))
                }
                options={ACTIVE_OPTIONS}
                required
              />
            </FormField>

            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Catatan Lainnya
                </label>
                <textarea
                  name="notes"
                  placeholder="Catatan tambahan (opsional)"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className={cn(
                    "w-full px-4 py-3",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "resize-none"
                  )}
                />
              </div>
            </FormField>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || submitSuccess}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </AppShell>
  )
}
