"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Users,
  Heart,
  StickyNote,
} from "lucide-react"
import { Button, Input, Select } from "@/components/ui"
import {
  verifyStudent,
  submitRegistration,
  getRegistrationSession,
  clearRegistrationSession,
} from "@/lib/registrasi"
import { cn } from "@/lib/utils"
import type { RegistrationFormData, RegistrationParentData, RegistrationStep } from "@/types/registrasi"
import type { Student } from "@/types/database"

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

const GUARDIAN_RELATION_OPTIONS = [
  { value: "grandfather", label: "Kakek" },
  { value: "grandmother", label: "Nenek" },
  { value: "uncle", label: "Paman" },
  { value: "aunt", label: "Tante" },
  { value: "sibling", label: "Kakak" },
  { value: "orphanage", label: "Pengurus Panti" },
  { value: "other", label: "Lainnya" },
]

const STEPS: Array<{ key: RegistrationStep; label: string; icon: React.ReactNode }> = [
  { key: "personal", label: "Data Diri", icon: <User className="w-4 h-4" /> },
  { key: "academic", label: "Akademik", icon: <GraduationCap className="w-4 h-4" /> },
  { key: "parents", label: "Orang Tua", icon: <Users className="w-4 h-4" /> },
  { key: "health", label: "Kesehatan", icon: <Heart className="w-4 h-4" /> },
  { key: "other", label: "Lainnya", icon: <StickyNote className="w-4 h-4" /> },
]

// ============================================
// TYPES
// ============================================

interface FormErrors {
  [key: string]: string
}

// ============================================
// DEFAULT FORM DATA
// ============================================

function getDefaultFormData(): Partial<RegistrationFormData> {
  return {
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
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_phone: "",
    height_cm: "",
    weight_kg: "",
    vision: "normal",
    hearing: "normal",
    teeth: "normal",
    physical_disability: "none",
    illness_history: "",
    allergies: "",
    health_notes: "",
    notes: "",
  }
}

// ============================================
// VALIDATION
// ============================================

function validateStep(step: RegistrationStep, data: Partial<RegistrationFormData>): FormErrors {
  const errors: FormErrors = {}

  if (step === "personal") {
    if (!data.full_name?.trim()) {
      errors.full_name = "Nama lengkap wajib diisi"
    } else if (data.full_name.trim().length < 2) {
      errors.full_name = "Nama minimal 2 karakter"
    }

    if (!data.gender) {
      errors.gender = "Jenis kelamin wajib dipilih"
    }

    if (!data.birth_date) {
      errors.birth_date = "Tanggal lahir wajib diisi"
    }

    if (data.nisn && !/^\d{10}$/.test(data.nisn)) {
      errors.nisn = "NISN harus 10 digit angka"
    }

    if (data.phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.phone.replace(/\s/g, ""))) {
      errors.phone = "Format nomor tidak valid"
    }
  }

  if (step === "parents") {
    if (data.father_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.father_phone.replace(/\s/g, ""))) {
      errors.father_phone = "Format nomor tidak valid"
    }

    if (data.mother_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.mother_phone.replace(/\s/g, ""))) {
      errors.mother_phone = "Format nomor tidak valid"
    }

    if (data.guardian_phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(data.guardian_phone.replace(/\s/g, ""))) {
      errors.guardian_phone = "Format nomor tidak valid"
    }
  }

  return errors
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function RegistrationFormPage({
  params,
}: {
  params: Promise<{ studentId?: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const studentIdFromQuery = searchParams.get("studentId")

  const [studentId, setStudentId] = useState<string | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("personal")
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>(getDefaultFormData())
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load student data
  useEffect(() => {
    loadStudentData()
  }, [])

  async function loadStudentData() {
    try {
      // Get studentId from URL params or session
      let sid = studentIdFromQuery

      if (!sid) {
        const session = getRegistrationSession()
        if (session?.studentId) {
          sid = session.studentId
        }
      }

      if (!sid) {
        // No student ID, redirect to verify
        router.replace("/registrasi/verify")
        return
      }

      setStudentId(sid)

      // Fetch student data
      const result = await verifyStudent("", "") // Just to check session
      const session = getRegistrationSession()

      if (session?.studentId === sid) {
        // Pre-fill form with existing student data
        setStudent(session.studentId ? { id: session.studentId, student_number: session.studentNumber, full_name: "", gender: "male", birth_date: null } as Student : null)
      }
    } catch (err) {
      console.error("Error loading student:", err)
    } finally {
      setIsLoading(false)
    }
  }

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

  // Go to next step
  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    const currentIndex = STEPS.findIndex((s) => s.key === currentStep)
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].key)
      setErrors({})
    }
  }

  // Go to previous step
  const handlePrev = () => {
    const currentIndex = STEPS.findIndex((s) => s.key === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key)
      setErrors({})
    }
  }

  // Submit form
  const handleSubmit = async () => {
    // Validate all steps
    let allErrors: FormErrors = {}
    for (const step of STEPS) {
      const stepErrors = validateStep(step.key, formData)
      allErrors = { ...allErrors, ...stepErrors }
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Go to first step with errors
      const firstErrorKey = Object.keys(allErrors)[0]
      const stepMapping: Record<string, RegistrationStep> = {
        full_name: "personal",
        gender: "personal",
        birth_date: "personal",
        nisn: "personal",
        phone: "personal",
        father_phone: "parents",
        mother_phone: "parents",
        guardian_phone: "parents",
      }
      const errorStep = stepMapping[firstErrorKey] || "personal"
      setCurrentStep(errorStep)
      return
    }

    if (!studentId) {
      setSubmitError("Sesi registrasi tidak valid")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Prepare parents data
      const parentsData: RegistrationParentData[] = []

      if (formData.father_name?.trim()) {
        parentsData.push({
          type: "father",
          full_name: formData.father_name,
          phone: formData.father_phone,
        })
      }

      if (formData.mother_name?.trim()) {
        parentsData.push({
          type: "mother",
          full_name: formData.mother_name,
          phone: formData.mother_phone,
        })
      }

      if (formData.guardian_name?.trim()) {
        parentsData.push({
          type: "guardian",
          full_name: formData.guardian_name,
          phone: formData.guardian_phone,
          guardian_relation: formData.guardian_relation,
        })
      }

      // Submit registration
      const result = await submitRegistration(studentId, formData, parentsData)

      if (result.success) {
        setIsComplete(true)
        clearRegistrationSession()
      } else {
        setSubmitError(result.error || "Terjadi kesalahan saat menyimpan data")
      }
    } catch (err) {
      console.error("Error submitting registration:", err)
      setSubmitError("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current step index
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100
  const isLastStep = currentStepIndex === STEPS.length - 1

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mx-auto mb-4" />
            <p className="text-sm text-[var(--text-muted)]">Memuat...</p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Registrasi Berhasil!
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            Data dirimu telah tersimpan. Terima kasih telah melengkapi data.
          </p>
          <div className="p-4 bg-green-50 rounded-2xl text-left mb-6">
            <p className="text-sm text-green-700">
              📋 <strong>Catatan:</strong> Kamu bisa melengkapi data lainnya melalui
              admin sekolah atau saat periode pembaruan data dibuka kembali.
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Kembalikan HP ke sekolah. Terima kasih! 🙏
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back Button */}
      <Link
        href="/registrasi/verify"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
          <span>Langkah {currentStepIndex + 1} dari {STEPS.length}</span>
          <span>{STEPS[currentStepIndex].label}</span>
        </div>
        <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {STEPS.map((step, index) => (
          <button
            key={step.key}
            onClick={() => {
              setCurrentStep(step.key)
              setErrors({})
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
              step.key === currentStep
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                : index < currentStepIndex
                ? "bg-green-100 text-green-700"
                : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
            )}
          >
            {index < currentStepIndex ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              step.icon
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-5 shadow-lg">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-light)]">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            {STEPS[currentStepIndex].icon}
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              {STEPS[currentStepIndex].label}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {currentStepIndex + 1} / {STEPS.length}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Personal Data Step */}
        {currentStep === "personal" && (
          <div className="space-y-4">
            <Input
              name="nisn"
              label="NISN"
              placeholder="10 digit angka"
              value={formData.nisn || ""}
              onChange={handleChange}
              error={errors.nisn}
              maxLength={10}
            />

            <Input
              name="full_name"
              label="Nama Lengkap"
              placeholder="Sesuai akta kelahiran"
              value={formData.full_name || ""}
              onChange={handleChange}
              error={errors.full_name}
              required
            />

            <Input
              name="nickname"
              label="Nama Panggilan"
              placeholder="Opsional"
              value={formData.nickname || ""}
              onChange={handleChange}
            />

            <Select
              name="gender"
              label="Jenis Kelamin"
              placeholder="Pilih jenis kelamin"
              value={formData.gender || ""}
              onChange={handleChange}
              options={GENDERS}
              error={errors.gender}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                name="blood_type"
                label="Gol. Darah"
                placeholder="Pilih"
                value={formData.blood_type || ""}
                onChange={handleChange}
              />

              <Input
                name="birth_place"
                label="Tempat Lahir"
                placeholder="Contoh: Jakarta"
                value={formData.birth_place || ""}
                onChange={handleChange}
              />
            </div>

            <Input
              name="birth_date"
              label="Tanggal Lahir"
              type="date"
              value={formData.birth_date || ""}
              onChange={handleChange}
              error={errors.birth_date}
              required
            />

            <Select
              name="religion"
              label="Agama"
              placeholder="Pilih agama"
              value={formData.religion || ""}
              onChange={handleChange}
              options={RELIGIONS}
            />

            <Input
              name="phone"
              label="No. WhatsApp"
              placeholder="Contoh: 081234567890"
              value={formData.phone || ""}
              onChange={handleChange}
              error={errors.phone}
            />

            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                Alamat
              </label>
              <textarea
                name="address"
                placeholder="Masukkan alamat lengkap"
                value={formData.address || ""}
                onChange={handleChange}
                rows={3}
                className={cn(
                  "w-full px-4 py-3",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-xl",
                  "text-[15px] text-[var(--text-primary)]",
                  "focus:outline-none focus:border-[var(--border-focus)]",
                  "resize-none"
                )}
              />
            </div>
          </div>
        )}

        {/* Academic Step */}
        {currentStep === "academic" && (
          <div className="space-y-4">
            <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
              <p className="text-sm text-[var(--text-muted)]">
                Data akademik seperti kelas dan tahun ajaran akan diisi oleh admin sekolah.
              </p>
            </div>
            <Input
              name="enrollment_year"
              label="Angkatan"
              type="number"
              placeholder="Contoh: 2024"
              value={formData.enrollment_year?.toString() || new Date().getFullYear().toString()}
              onChange={handleChange}
              disabled
            />
          </div>
        )}

        {/* Parents Step */}
        {currentStep === "parents" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700 font-medium mb-2">👨 Data Ayah</p>
            </div>
            <Input
              name="father_name"
              label="Nama Ayah"
              placeholder="Nama lengkap ayah"
              value={formData.father_name || ""}
              onChange={handleChange}
            />
            <Input
              name="father_phone"
              label="No. HP Ayah"
              placeholder="Contoh: 081234567890"
              value={formData.father_phone || ""}
              onChange={handleChange}
              error={errors.father_phone}
            />

            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="text-sm text-pink-700 font-medium mb-2">👩 Data Ibu</p>
            </div>
            <Input
              name="mother_name"
              label="Nama Ibu"
              placeholder="Nama lengkap ibu"
              value={formData.mother_name || ""}
              onChange={handleChange}
            />
            <Input
              name="mother_phone"
              label="No. HP Ibu"
              placeholder="Contoh: 081234567890"
              value={formData.mother_phone || ""}
              onChange={handleChange}
              error={errors.mother_phone}
            />

            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-700 font-medium mb-2">👤 Data Wali (opsional)</p>
            </div>
            <Input
              name="guardian_name"
              label="Nama Wali"
              placeholder="Jika berbeda dari orang tua"
              value={formData.guardian_name || ""}
              onChange={handleChange}
            />
            <Select
              name="guardian_relation"
              label="Hubungan dengan Wali"
              placeholder="Pilih hubungan"
              value={formData.guardian_relation || ""}
              onChange={handleChange}
              options={GUARDIAN_RELATION_OPTIONS}
            />
            <Input
              name="guardian_phone"
              label="No. HP Wali"
              placeholder="Contoh: 081234567890"
              value={formData.guardian_phone || ""}
              onChange={handleChange}
              error={errors.guardian_phone}
            />
          </div>
        )}

        {/* Health Step */}
        {currentStep === "health" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                name="height_cm"
                label="Tinggi (cm)"
                type="number"
                placeholder="Contoh: 165"
                value={formData.height_cm || ""}
                onChange={handleChange}
              />
              <Input
                name="weight_kg"
                label="Berat (kg)"
                type="number"
                placeholder="Contoh: 55"
                value={formData.weight_kg || ""}
                onChange={handleChange}
              />
            </div>

            <Select
              name="vision"
              label="Penglihatan"
              value={formData.vision || "normal"}
              onChange={handleChange}
              options={VISION_OPTIONS}
            />
            <Select
              name="hearing"
              label="Pendengaran"
              value={formData.hearing || "normal"}
              onChange={handleChange}
              options={HEARING_OPTIONS}
            />
            <Select
              name="teeth"
              label="Gigi dan Mulut"
              value={formData.teeth || "normal"}
              onChange={handleChange}
              options={TEETH_OPTIONS}
            />
            <Select
              name="physical_disability"
              label="Cacat Tubuh"
              value={formData.physical_disability || "none"}
              onChange={handleChange}
              options={PHYSICAL_DISABILITY_OPTIONS}
            />

            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                Riwayat Sakit
              </label>
              <textarea
                name="illness_history"
                placeholder="Contoh: Asma, Diabetes, dll (kosongkan jika tidak ada)"
                value={formData.illness_history || ""}
                onChange={handleChange}
                rows={2}
                className={cn(
                  "w-full px-4 py-3",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-xl",
                  "text-[15px] text-[var(--text-primary)]",
                  "focus:outline-none focus:border-[var(--border-focus)]",
                  "resize-none"
                )}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                Alergi
              </label>
              <textarea
                name="allergies"
                placeholder="Contoh: Alergi udang, alergi debu, dll (kosongkan jika tidak ada)"
                value={formData.allergies || ""}
                onChange={handleChange}
                rows={2}
                className={cn(
                  "w-full px-4 py-3",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-xl",
                  "text-[15px] text-[var(--text-primary)]",
                  "focus:outline-none focus:border-[var(--border-focus)]",
                  "resize-none"
                )}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                Catatan Kesehatan
              </label>
              <textarea
                name="health_notes"
                placeholder="Catatan kesehatan tambahan (opsional)"
                value={formData.health_notes || ""}
                onChange={handleChange}
                rows={2}
                className={cn(
                  "w-full px-4 py-3",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-xl",
                  "text-[15px] text-[var(--text-primary)]",
                  "focus:outline-none focus:border-[var(--border-focus)]",
                  "resize-none"
                )}
              />
            </div>
          </div>
        )}

        {/* Other Step */}
        {currentStep === "other" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                Catatan Lainnya
              </label>
              <textarea
                name="notes"
                placeholder="Informasi tambahan yang ingin disampaikan (opsional)"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={4}
                className={cn(
                  "w-full px-4 py-3",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-xl",
                  "text-[15px] text-[var(--text-primary)]",
                  "focus:outline-none focus:border-[var(--border-focus)]",
                  "resize-none"
                )}
              />
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700">
                ✅ Periksa kembali semua data sebelum提交. Data yang sudah dikirim
                akan langsung tersimpan ke database.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-light)]">
          {currentStepIndex > 0 ? (
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handlePrev}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-5 h-5" />
              Sebelumnya
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {isLastStep ? (
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleNext}
            >
              Selanjutnya
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
