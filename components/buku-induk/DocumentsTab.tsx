"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Upload,
  FileText,
  Image,
  Download,
  Trash2,
  Eye,
  X,
  Loader2,
  File,
  FileCheck,
  AlertCircle,
  Plus,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react"
import { Card, Button, Badge } from "@/components/ui"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface StudentDocument {
  id: string
  student_id: string
  type: DocumentType
  name: string
  file_url: string
  file_size: number
  mime_type: string
  created_at: string
}

type DocumentType =
  | "photo"
  | "birth_certificate"
  | "family_card"
  | "national_id"
  | "graduation_certificate"
  | "report_card"
  | "transfer_letter"
  | "medical_record"
  | "other"

interface DocumentCategory {
  type: DocumentType
  label: string
  icon: React.ReactNode
  allowedTypes: string[]
  maxSize: number
}

// ============================================
// CONSTANTS
// ============================================

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { type: "photo", label: "Pas Foto", icon: <Image className="w-5 h-5" />, allowedTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 5 },
  { type: "birth_certificate", label: "Akta Kelahiran", icon: <FileText className="w-5 h-5" />, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 10 },
  { type: "family_card", label: "Kartu Keluarga", icon: <FileText className="w-5 h-5" />, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 10 },
  { type: "national_id", label: "KTP Orang Tua", icon: <FileText className="w-5 h-5" />, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 10 },
  { type: "graduation_certificate", label: "Ijazah", icon: <FileSpreadsheet className="w-5 h-5" />, allowedTypes: ["application/pdf"], maxSize: 20 },
  { type: "report_card", label: "Rapor/SKHUN", icon: <FileSpreadsheet className="w-5 h-5" />, allowedTypes: ["application/pdf"], maxSize: 20 },
  { type: "transfer_letter", label: "Surat Pindah", icon: <FileText className="w-5 h-5" />, allowedTypes: ["application/pdf"], maxSize: 10 },
  { type: "medical_record", label: "Rekam Medis", icon: <FileText className="w-5 h-5" />, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 10 },
  { type: "other", label: "Lainnya", icon: <File className="w-5 h-5" />, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 10 },
]

// ============================================
// HELPERS
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <Image className="w-6 h-6" />
  if (mimeType === "application/pdf") return <FileText className="w-6 h-6" />
  return <File className="w-6 h-6" />
}

function getCategoryByType(type: DocumentType): DocumentCategory | undefined {
  return DOCUMENT_CATEGORIES.find((c) => c.type === type)
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "FILE"
}

// ============================================
// TAB ERROR STATE
// ============================================

interface TabErrorStateProps {
  title?: string
  description?: string
  errorDetails?: string
  onRetry?: () => void
}

export function TabErrorState({
  title = "Dokumen tidak dapat dimuat",
  description = "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
  errorDetails,
  onRetry,
}: TabErrorStateProps) {
  return (
    <Card className="text-center py-10 px-6">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Coba lagi
        </Button>
      )}
      {process.env.NODE_ENV === "development" && errorDetails && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-left">
          <p className="text-xs font-mono text-[var(--text-muted)] break-all">
            {errorDetails}
          </p>
        </div>
      )}
    </Card>
  )
}

// ============================================
// EMPTY STATE
// ============================================

interface TabEmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function TabEmptyState({
  title = "Belum ada dokumen",
  description = "Tambahkan dokumen siswa seperti foto, akta kelahiran, dan lainnya.",
  actionLabel = "Unggah Dokumen",
  onAction,
  icon,
}: TabEmptyStateProps) {
  return (
    <Card className="text-center py-10 px-6">
      <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
        {icon || <FileText className="w-8 h-8 text-[var(--text-muted)]" />}
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <Upload className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}

// ============================================
// SKELETON
// ============================================

function DocumentSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-[var(--surface-secondary)] rounded-xl p-4 animate-pulse">
          <div className="aspect-[4/3] bg-[var(--surface-hover)] rounded-lg mb-3" />
          <div className="h-4 bg-[var(--surface-hover)] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--surface-hover)] rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// DOCUMENT CARD
// ============================================

interface DocumentCardProps {
  document: StudentDocument
  onPreview: () => void
  onDelete: () => void
}

function DocumentCard({ document, onPreview, onDelete }: DocumentCardProps) {
  const isImage = document.mime_type.startsWith("image/")
  const category = getCategoryByType(document.type)

  return (
    <div className="group bg-[var(--surface-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden hover:shadow-md transition-all">
      {/* Preview Area */}
      <div
        className={cn(
          "aspect-[4/3] flex items-center justify-center cursor-pointer relative",
          isImage ? "bg-black/5" : "bg-[var(--surface-secondary)]"
        )}
        onClick={onPreview}
      >
        {isImage ? (
          <img src={document.file_url} alt={document.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-2">
              {getFileIcon(document.mime_type)}
            </div>
            <Badge variant="outline" className="text-xs">{getFileExtension(document.name)}</Badge>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate" title={document.name}>
              {document.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {category && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {category.label}
                </Badge>
              )}
              <span className="text-xs text-[var(--text-muted)]">
                {formatFileSize(document.file_size)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(document.created_at)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-light)]">
          <Button variant="ghost" size="sm" onClick={onPreview} className="flex-1 gap-1 text-xs">
            <Eye className="w-3.5 h-3.5" />
            Lihat
          </Button>
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh
          </a>
          <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1 text-xs text-[var(--danger)] hover:bg-[var(--danger-soft)]">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// UPLOAD MODAL
// ============================================

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  onUploadComplete: () => void
}

function UploadModal({ isOpen, onClose, studentId, onUploadComplete }: UploadModalProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>("other")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const category = getCategoryByType(selectedType)

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setPreview(null)
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    if (category && !category.allowedTypes.includes(selectedFile.type)) {
      setError(`Format file tidak didukung. Gunakan: ${category.allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`)
      return
    }

    if (category && selectedFile.size > category.maxSize * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal: ${category.maxSize}MB`)
      return
    }

    setFile(selectedFile)
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile))
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) validateAndSetFile(droppedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const fileName = `${studentId}/${selectedType}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("student-documents")
        .upload(fileName, file, { cacheControl: "3600", upsert: false })

      if (uploadError) {
        console.error("Storage upload error:", {
          message: uploadError.message,
          code: uploadError.name,
          status: (uploadError as unknown as { status?: number }).status,
        })
        throw uploadError
      }

      const { data: urlData } = supabase.storage.from("student-documents").getPublicUrl(fileName)

      const { error: dbError } = await supabase.from("student_documents").insert({
        student_id: studentId,
        type: selectedType,
        name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })

      if (dbError) {
        console.error("Database insert error:", {
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
        })
        throw dbError
      }

      onUploadComplete()
      onClose()
    } catch (err) {
      const errorObj = err as { message?: string; code?: string; details?: string }
      setError("Gagal mengupload: " + (errorObj.message || "Unknown error"))
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[16px]" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Unggah Dokumen</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-[14px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Document Type */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">Jenis Dokumen</label>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value as DocumentType); setFile(null); setPreview(null) }}
              className={cn(
                "w-full h-12 px-4 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-[14px]",
                "text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]",
                "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)] transition-all"
              )}
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat.type} value={cat.type}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-[16px] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
              file ? "border-[var(--success)] bg-[var(--success-soft)]" : "border-[var(--border-default)] hover:border-[var(--border-focus)]"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept={category?.allowedTypes.join(",")} onChange={handleFileSelect} className="hidden" />

            {file ? (
              <>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-[12px]" />
                ) : (
                  <div className="w-16 h-16 rounded-[12px] bg-[var(--surface-secondary)] flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-[var(--success)]" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">{file.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }} className="text-[11px] text-[var(--danger)] hover:underline">Hapus file</button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                  <Upload className="w-7 h-7 text-[var(--text-muted)]" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">Seret file ke sini atau klik untuk pilih</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {category?.allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} • Maksimal {category?.maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--danger-soft)] rounded-[12px]">
              <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
              <p className="text-[12px] text-[var(--danger)]">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--border-light)]">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Mengupload...</> : <><Upload className="w-4 h-4" />Upload</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PREVIEW MODAL
// ============================================

interface PreviewModalProps {
  document: StudentDocument
  onClose: () => void
}

function PreviewModal({ document, onClose }: PreviewModalProps) {
  const isImage = document.mime_type.startsWith("image/")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button onClick={onClose} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="bg-white rounded-[20px] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[var(--text-primary)]">{document.name}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{formatFileSize(document.file_size)} • {formatDate(document.created_at)}</p>
            </div>
            <a href={document.file_url} download={document.name} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-[12px] font-medium rounded-[12px] hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" />Download
            </a>
          </div>
          <div className="p-4 max-h-[60vh] overflow-auto flex items-center justify-center bg-black/5">
            {isImage ? (
              <img src={document.file_url} alt={document.name} className="max-w-full max-h-[60vh] object-contain" />
            ) : (
              <iframe src={document.file_url} className="w-full h-[60vh]" title={document.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DELETE CONFIRM DIALOG
// ============================================

interface DeleteConfirmDialogProps {
  isOpen: boolean
  documentName: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirmDialog({ isOpen, documentName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[8px]" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-[20px] shadow-xl p-6">
        <div className="w-12 h-12 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-[var(--danger)]" />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] text-center mb-2">Hapus Dokumen?</h3>
        <p className="text-[13px] text-[var(--text-secondary)] text-center mb-6">
          Apakah Anda yakin ingin menghapus <span className="font-medium">{documentName}</span>? Dokumen yang dihapus tidak dapat dikembalikan.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">Batal</Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">Hapus</Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

interface DocumentsTabProps {
  studentId: string
}

export function DocumentsTab({ studentId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; code?: string; details?: string } | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentDocument | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Error fetching documents:", {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
          hint: fetchError.hint,
        })
        throw fetchError
      }

      setDocuments(data || [])
    } catch (err) {
      const errorObj = err as { message?: string; code?: string; details?: string }
      setError({
        message: errorObj.message || "Gagal memuat dokumen",
        code: errorObj.code,
        details: errorObj.details,
      })
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      // Extract file path from URL
      const filePath = deleteTarget.file_url.split("/student-documents/")[1]
      if (filePath) {
        const { error: storageError } = await supabase.storage.from("student-documents").remove([filePath])
        if (storageError) console.error("Storage delete error:", storageError)
      }

      const { error: dbError } = await supabase.from("student_documents").delete().eq("id", deleteTarget.id)
      if (dbError) throw dbError

      fetchDocuments()
      setDeleteTarget(null)
    } catch (err) {
      const errorObj = err as { message?: string }
      alert("Gagal menghapus: " + (errorObj.message || "Unknown error"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <DocumentSkeleton />

  if (error) {
    return (
      <>
        <TabErrorState
          title="Dokumen tidak dapat dimuat"
          description="Terjadi kesalahan saat memuat dokumen. Silakan coba lagi."
          errorDetails={`${error.message}${error.code ? ` (${error.code})` : ""}${error.details ? `\n${error.details}` : ""}`}
          onRetry={fetchDocuments}
        />
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} studentId={studentId} onUploadComplete={fetchDocuments} />
      </>
    )
  }

  if (documents.length === 0) {
    return (
      <>
        <TabEmptyState onAction={() => setIsUploadModalOpen(true)} />
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} studentId={studentId} onUploadComplete={fetchDocuments} />
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--text-muted)]">{documents.length} dokumen</p>
        <Button onClick={() => setIsUploadModalOpen(true)} size="sm" className="gap-2">
          <Upload className="w-4 h-4" />Unggah Dokumen
        </Button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onPreview={() => setSelectedDocument(doc)}
            onDelete={() => setDeleteTarget(doc)}
          />
        ))}
      </div>

      {/* Modals */}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} studentId={studentId} onUploadComplete={fetchDocuments} />
      {selectedDocument && <PreviewModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        documentName={deleteTarget?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
