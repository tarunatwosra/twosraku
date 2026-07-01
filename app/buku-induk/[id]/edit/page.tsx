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
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Card, Button, Input, Select, Avatar } from "@/components/ui"
import { fetchStudent, updateStudent, checkDuplicateNIS } from "../../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

// ============================================
// CONSTANTS
// ============================================

const GENDERS = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
]

const RELIGIONS = [
  { value: "Islam", label: "Islam" },
  { value: "Kristen Protestan", label: "Kristen Protestan" },
  { value: "Katolik", label: "Katolik" },
  { value: "Hindu", label: "Hindu" },
  { value: "Buddha", label: "Buddha" },
  { value: "Konghucu", label: "Konghucu" },
  { value: "Lainnya", label: "Lainnya" },
]

const BLOOD_TYPES = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
]

const STATUSES = [
  { value: "prospective", label: "Calon Siswa" },
  { value: "active", label: "Aktif" },
  { value: "transferred", label: "Pindah" },
  { value: "graduated", label: "Lulus" },
]

// ============================================
// TYPES
// ============================================

interface FormData {
  student_number: string
  national_id: string
  full_name: string
  nickname: string
  gender: "male" | "female" | ""
  birth_place: string
  birth_date: string
  religion: string
  nationality: string
  blood_type: string
  address: string
  phone: string
  email: string
  status: "prospective" | "active" | "transferred" | "graduated" | "archived"
  enrollment_year: number
  graduation_year: number | null
  transfer_date: string
  transfer_reason: string
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
  } else if (data.student_number.length < 4) {
    errors.student_number = "NIS minimal 4 karakter"
  }

  // Nama Lengkap (required)
  if (!data.full_name.trim()) {
    errors.full_name = "Nama lengkap wajib diisi"
  } else if (data.full_name.trim().length < 3) {
    errors.full_name = "Nama minimal 3 karakter"
  }

  // Gender (required)
  if (!data.gender) {
    errors.gender = "Jenis kelamin wajib dipilih"
  }

  // Tanggal Lahir (optional but must be valid if provided)
  if (data.birth_date) {
    const birthDate = new Date(data.birth_date)
    const today = new Date()
    if (birthDate > today) {
      errors.birth_date = "Tanggal lahir tidak valid"
    }
  }

  // Email (optional but must be valid)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Format email tidak valid"
  }

  // Phone (optional but must be valid)
  if (data.phone && !/^[0-9+\-\s()]+$/.test(data.phone)) {
    errors.phone = "Format nomor telepon tidak valid"
  }

  // NIK (optional but must be valid if provided)
  if (data.national_id && !/^[0-9]{16}$/.test(data.national_id)) {
    errors.national_id = "NIK harus 16 digit angka"
  }

  return errors
}

// ============================================
// COMPONENTS
// ============================================

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-[var(--text-muted)] mb-4">{description}</p>
      )}
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
    student_number: "",
    national_id: "",
    full_name: "",
    nickname: "",
    gender: "",
    birth_place: "",
    birth_date: "",
    religion: "",
    nationality: "Indonesia",
    blood_type: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
    enrollment_year: new Date().getFullYear(),
    graduation_year: null,
    transfer_date: "",
    transfer_reason: "",
    notes: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
          student_number: data.student_number || "",
          national_id: data.national_id || "",
          full_name: data.full_name || "",
          nickname: data.nickname || "",
          gender: data.gender || "",
          birth_place: data.birth_place || "",
          birth_date: data.birth_date ? data.birth_date.split("T")[0] : "",
          religion: data.religion || "",
          nationality: data.nationality || "Indonesia",
          blood_type: data.blood_type || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          status: data.status || "active",
          enrollment_year: data.enrollment_year || new Date().getFullYear(),
          graduation_year: data.graduation_year,
          transfer_date: data.transfer_date ? data.transfer_date.split("T")[0] : "",
          transfer_reason: data.transfer_reason || "",
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
        student_number: formData.student_number,
        full_name: formData.full_name,
        nickname: formData.nickname || null,
        gender: formData.gender,
        birth_place: formData.birth_place || null,
        birth_date: formData.birth_date || null,
        religion: formData.religion || null,
        nationality: formData.nationality || null,
        blood_type: formData.blood_type || null,
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        national_id: formData.national_id || null,
        status: formData.status,
        enrollment_year: formData.enrollment_year,
        graduation_year: formData.graduation_year || null,
        transfer_date: formData.transfer_date || null,
        transfer_reason: formData.transfer_reason || null,
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
      <div className="mb-6 flex items-center gap-4">
        <Avatar
          fallback={student.full_name}
          src={student.photo_url}
          size="lg"
          className="w-16 h-16 text-xl bg-[var(--primary-soft)] text-[var(--primary)]"
        />
        <div>
          <h1 className="text-[24px] font-bold text-[var(--text-primary)]">
            Edit Data Siswa
          </h1>
          <p className="text-[14px] text-[var(--text-muted)]">
            {student.full_name} • NIS: {student.student_number}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          {/* Submit Status */}
          {submitError && (
            <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-[18px] flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
              <p className="text-[14px] text-[var(--danger)]">{submitError}</p>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 p-4 bg-[var(--success-soft)] border border-[var(--success)] rounded-[18px] flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0" />
              <p className="text-[14px] text-[var(--success)]">
                Data berhasil disimpan! Mengalihkan ke halaman detail...
              </p>
            </div>
          )}

          {/* Section 1: Data Pribadi */}
          <FormSection
            title="Data Pribadi Siswa"
            description="Informasi pribadi siswa"
          >
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
                name="national_id"
                label="NIK"
                placeholder="16 digit angka"
                value={formData.national_id}
                onChange={handleChange}
                error={errors.national_id}
                maxLength={16}
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
                name="nationality"
                label="Kewarganegaraan"
                placeholder="Contoh: Indonesia"
                value={formData.nationality}
                onChange={handleChange}
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

            <FormField fullWidth>
              <Input
                name="address"
                label="Alamat"
                placeholder="Masukkan alamat lengkap"
                value={formData.address}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Input
                name="phone"
                label="No. Telepon"
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </FormField>

            <FormField>
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Contoh: email@contoh.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </FormField>
          </FormSection>

          {/* Section 2: Data Akademik */}
          <FormSection
            title="Data Akademik"
            description="Informasi akademik siswa"
          >
            <FormField>
              <Select
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                options={STATUSES}
                required
              />
            </FormField>

            <FormField>
              <Input
                name="enrollment_year"
                label="Tahun Masuk"
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

            {formData.status === "graduated" && (
              <FormField>
                <Input
                  name="graduation_year"
                  label="Tahun Lulus"
                  type="number"
                  placeholder="Contoh: 2027"
                  value={formData.graduation_year?.toString() || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      graduation_year: parseInt(e.target.value) || null,
                    }))
                  }
                />
              </FormField>
            )}

            {formData.status === "transferred" && (
              <>
                <FormField>
                  <Input
                    name="transfer_date"
                    label="Tanggal Pindah"
                    type="date"
                    value={formData.transfer_date}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField fullWidth>
                  <Input
                    name="transfer_reason"
                    label="Alasan Pindah"
                    placeholder="Masukkan alasan perpindahan"
                    value={formData.transfer_reason}
                    onChange={handleChange}
                  />
                </FormField>
              </>
            )}
          </FormSection>

          {/* Section 3: Catatan */}
          <FormSection
            title="Catatan"
            description="Informasi tambahan (opsional)"
          >
            <FormField fullWidth>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[var(--text-primary)]">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  placeholder="Masukkan catatan tambahan jika ada"
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
