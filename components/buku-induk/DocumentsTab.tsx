"use client"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import { Card, Button } from "@/components/ui"
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
  maxSize: number // in MB
}

// ============================================
// CONSTANTS
// ============================================

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    type: "photo",
    label: "Foto Siswa",
    icon: <Image className="w-5 h-5" />,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5,
  },
  {
    type: "birth_certificate",
    label: "Akta Kelahiran",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 10,
  },
  {
    type: "family_card",
    label: "Kartu Keluarga",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 10,
  },
  {
    type: "national_id",
    label: "KTP Orang Tua",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 10,
  },
  {
    type: "graduation_certificate",
    label: "Ijazah / STTB",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf"],
    maxSize: 20,
  },
  {
    type: "report_card",
    label: "Rapor / SKHUN",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf"],
    maxSize: 20,
  },
  {
    type: "transfer_letter",
    label: "Surat Keterangan Pindah",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf"],
    maxSize: 10,
  },
  {
    type: "medical_record",
    label: "Rekam Medis",
    icon: <FileText className="w-5 h-5" />,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 10,
  },
  {
    type: "other",
    label: "Lainnya",
    icon: <File className="w-5 h-5" />,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 10,
  },
]

// ============================================
// HELPERS
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <Image className="w-6 h-6" />
  return <FileText className="w-6 h-6" />
}

function getCategoryByType(type: DocumentType): DocumentCategory | undefined {
  return DOCUMENT_CATEGORIES.find((c) => c.type === type)
}

// ============================================
// UPLOAD MODAL
// ============================================

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  documentType?: DocumentType
  onUploadComplete: () => void
}

function UploadModal({
  isOpen,
  onClose,
  studentId,
  documentType,
  onUploadComplete,
}: UploadModalProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>(documentType || "other")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const category = getCategoryByType(selectedType)

  useEffect(() => {
    if (documentType) {
      setSelectedType(documentType)
    }
  }, [documentType])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    // Validate file type
    if (category && !category.allowedTypes.includes(selectedFile.type)) {
      setError(`Format file tidak didukung. Gunakan: ${category.allowedTypes.join(", ")}`)
      return
    }

    // Validate file size
    if (category && selectedFile.size > category.maxSize * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal: ${category.maxSize}MB`)
      return
    }

    setFile(selectedFile)

    // Generate preview for images
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Upload to Supabase Storage
      const fileName = `${studentId}/${selectedType}/${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from("student-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("student-documents")
        .getPublicUrl(fileName)

      // Save document record
      const { error: dbError } = await supabase.from("student_documents").insert({
        student_id: studentId,
        type: selectedType,
        name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })

      if (dbError) {
        throw dbError
      }

      onUploadComplete()
      handleClose()
    } catch (err) {
      console.error("Upload error:", err)
      setError("Gagal mengupload file: " + (err as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[16px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Upload Dokumen
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-[18px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Document Type Selection */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
              Jenis Dokumen
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as DocumentType)
                setFile(null)
                setPreview(null)
              }}
              className={cn(
                "w-full h-[48px] px-4",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[14px] text-[var(--text-primary)]",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                "transition-all duration-200"
              )}
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat.type} value={cat.type}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-[20px] p-8",
              "flex flex-col items-center justify-center gap-3",
              "transition-all duration-200 cursor-pointer",
              file
                ? "border-[var(--success)] bg-[var(--success-soft)]"
                : "border-[var(--border-default)] hover:border-[var(--border-focus)]"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={category?.allowedTypes.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-[16px]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-[16px] bg-[var(--surface-secondary)] flex items-center justify-center">
                    <FileCheck className="w-10 h-10 text-[var(--success)]" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    {file.name}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setPreview(null)
                  }}
                  className="text-[12px] text-[var(--danger)] hover:underline"
                >
                  Hapus file
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    Seret file ke sini atau klik untuk pilih
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {category?.allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}
                    {" • "}
                    Maksimal {category?.maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--danger-soft)] rounded-[12px]">
              <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
              <p className="text-[13px] text-[var(--danger)]">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)]">
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DOCUMENT CARD
// ============================================

interface DocumentCardProps {
  document: StudentDocument
  category: DocumentCategory
  onPreview: () => void
  onDelete: () => void
}

function DocumentCard({ document, category, onPreview, onDelete }: DocumentCardProps) {
  const isImage = document.mime_type.startsWith("image/")

  return (
    <div className="group relative bg-[var(--surface-secondary)] rounded-[20px] p-4 hover:shadow-md transition-shadow">
      {/* Preview */}
      <div
        className={cn(
          "aspect-[4/3] rounded-[16px] overflow-hidden mb-3",
          "flex items-center justify-center cursor-pointer",
          isImage ? "bg-black/5" : "bg-[var(--surface-hover)]"
        )}
        onClick={onPreview}
      >
        {isImage ? (
          <img
            src={document.file_url}
            alt={document.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-12 h-12 text-[var(--text-muted)]" />
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
              {document.name}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {formatFileSize(document.file_size)}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onPreview}
              className="w-7 h-7 rounded-[10px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)] transition-colors"
              title="Lihat"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded-[10px] flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <Card padding="lg" className="text-center">
      <div className="py-8">
        <div className="w-20 h-20 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">
          Belum Ada Dokumen
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
          Tambahkan dokumen siswa seperti foto, akta kelahiran, kartu keluarga, dan lainnya
        </p>
        <Button onClick={onUpload}>
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </Button>
      </div>
    </Card>
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
  const [error, setError] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null)

  // Fetch documents
  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setDocuments(data || [])
    } catch (err) {
      console.error("Error fetching documents:", err)
      setError("Gagal memuat dokumen")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [studentId])

  // Delete document
  const handleDelete = async (doc: StudentDocument) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return

    try {
      // Delete from storage
      const filePath = doc.file_url.split("/student-documents/")[1]
      if (filePath) {
        await supabase.storage.from("student-documents").remove([filePath])
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from("student_documents")
        .delete()
        .eq("id", doc.id)

      if (deleteError) throw deleteError

      fetchDocuments()
    } catch (err) {
      console.error("Error deleting document:", err)
      alert("Gagal menghapus dokumen: " + (err as Error).message)
    }
  }

  // Group documents by type
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = []
      }
      acc[doc.type].push(doc)
      return acc
    },
    {} as Record<DocumentType, StudentDocument[]>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-[var(--surface-hover)] rounded-[20px] animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card padding="lg" className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-[var(--danger)] mx-auto mb-4" />
        <p className="text-[14px] text-[var(--danger)]">{error}</p>
        <Button variant="outline" onClick={fetchDocuments} className="mt-4">
          Coba Lagi
        </Button>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <>
        <EmptyState onUpload={() => setIsUploadModalOpen(true)} />
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          studentId={studentId}
          onUploadComplete={fetchDocuments}
        />
        {selectedDocument && (
          <PreviewModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">
            {documents.length} dokumen
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </Button>
      </div>

      {/* Document Groups */}
      {DOCUMENT_CATEGORIES.map((category) => {
        const docs = groupedDocuments[category.type]
        if (!docs || docs.length === 0) return null

        return (
          <div key={category.type}>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              {category.icon}
              {category.label}
              <span className="text-[var(--text-muted)] font-normal">
                ({docs.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  category={category}
                  onPreview={() => setSelectedDocument(doc)}
                  onDelete={() => handleDelete(doc)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Other/Uncategorized */}
      {DOCUMENT_CATEGORIES.some(
        (c) => groupedDocuments[c.type] && groupedDocuments[c.type].length > 0
      ) &&
        documents.filter((d) => !DOCUMENT_CATEGORIES.find((c) => c.type === d.type))
          .length > 0 && (
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <File className="w-5 h-5" />
              Lainnya
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {documents
                .filter((d) => !DOCUMENT_CATEGORIES.find((c) => c.type === d.type))
                .map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    category={{
                      type: "other",
                      label: "Lainnya",
                      icon: <File className="w-5 h-5" />,
                      allowedTypes: [],
                      maxSize: 10,
                    }}
                    onPreview={() => setSelectedDocument(doc)}
                    onDelete={() => handleDelete(doc)}
                  />
                ))}
            </div>
          </div>
        )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        studentId={studentId}
        onUploadComplete={fetchDocuments}
      />

      {/* Preview Modal */}
      {selectedDocument && (
        <PreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
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
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="bg-white rounded-[20px] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[var(--text-primary)]">
                {document.name}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                {formatFileSize(document.file_size)}
              </p>
            </div>
            <a
              href={document.file_url}
              download={document.name}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-[13px] font-medium rounded-[14px] hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
          <div className="p-4 max-h-[60vh] overflow-auto flex items-center justify-center bg-black/5">
            {isImage ? (
              <img
                src={document.file_url}
                alt={document.name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : (
              <iframe
                src={document.file_url}
                className="w-full h-[60vh]"
                title={document.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
