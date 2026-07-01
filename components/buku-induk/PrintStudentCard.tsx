"use client"

import { useRef } from "react"
import { Printer, Download } from "lucide-react"
import { Button } from "@/components/ui"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface StudentCardProps {
  student: StudentWithClass
  academicYearName?: string
  className?: string
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ============================================
// SINGLE STUDENT CARD
// ============================================

export function StudentCard({ student, academicYearName, className }: StudentCardProps) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-[var(--border-default)] rounded-[20px] p-6",
        "aspect-[3/2]", // Standard card ratio
        className
      )}
    >
      <div className="flex items-start justify-between h-full">
        {/* Left Side - School Info */}
        <div className="flex-1">
          <div className="text-center mb-4">
            <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Kartu Identitas Siswa
            </p>
            <h3 className="text-[14px] font-bold text-[var(--text-primary)] mt-1">
              {academicYearName || "Tahun Ajaran"}
            </h3>
          </div>

          {/* Student Photo Placeholder */}
          <div className="w-20 h-24 bg-[var(--surface-secondary)] rounded-[12px] mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] mx-auto mb-1" />
                <p className="text-[8px] text-[var(--text-muted)]">4x6</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Student Info */}
        <div className="flex-1 pl-4">
          <table className="w-full text-[10px]">
            <tbody>
              <tr>
                <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">NIS</td>
                <td className="font-semibold text-[var(--text-primary)] py-0.5">{student.student_number}</td>
              </tr>
              <tr>
                <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">Nama</td>
                <td className="font-semibold text-[var(--text-primary)] py-0.5">{student.full_name}</td>
              </tr>
              {student.nickname && (
                <tr>
                  <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">Panggilan</td>
                  <td className="text-[var(--text-primary)] py-0.5">{student.nickname}</td>
                </tr>
              )}
              <tr>
                <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">L/P</td>
                <td className="text-[var(--text-primary)] py-0.5">
                  {student.gender === "male" ? "L" : "P"}
                </td>
              </tr>
              <tr>
                <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">Tgl Lahir</td>
                <td className="text-[var(--text-primary)] py-0.5">{formatDate(student.birth_date)}</td>
              </tr>
              {student.birth_place && (
                <tr>
                  <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">Tempat</td>
                  <td className="text-[var(--text-primary)] py-0.5">{student.birth_place}</td>
                </tr>
              )}
              {student.parents?.find((p) => p.type === "father") && (
                <tr>
                  <td className="text-[var(--text-muted)] pr-2 py-0.5 align-top">Ortu/Wali</td>
                  <td className="text-[var(--text-primary)] py-0.5">
                    {student.parents?.find((p) => p.type === "father")?.full_name || "-"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PRINT MULTIPLE CARDS (2x4 grid)
// ============================================

interface PrintCardsProps {
  students: StudentWithClass[]
  academicYearName?: string
}

export function PrintStudentCards({ students, academicYearName }: PrintCardsProps) {
  return (
    <div className="hidden print:block">
      {/* Print layout - 2 cards per row, 4 rows per page */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            academicYearName={academicYearName}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// PRINT BUTTON COMPONENT
// ============================================

interface PrintStudentCardButtonProps {
  student: StudentWithClass
  academicYearName?: string
}

export function PrintStudentCardButton({
  student,
  academicYearName,
}: PrintStudentCardButtonProps) {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Tidak dapat membuka window print. Pastikan popup tidak diblokir.")
      return
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kartu Siswa - ${student.full_name}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .card-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            .card {
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 24px;
              aspect-ratio: 3/2;
            }
            .card-header {
              text-align: center;
              margin-bottom: 16px;
            }
            .card-header h4 {
              font-size: 10px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin: 0;
            }
            .card-header h3 {
              font-size: 14px;
              font-weight: bold;
              color: #111827;
              margin: 4px 0 0 0;
            }
            .card-content {
              display: flex;
              gap: 16px;
            }
            .card-photo {
              width: 80px;
              height: 96px;
              background: #f3f4f6;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .card-photo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .card-info {
              flex: 1;
              font-size: 10px;
            }
            .card-info table {
              width: 100%;
              border-collapse: collapse;
            }
            .card-info td {
              padding: 2px 0;
              vertical-align: top;
            }
            .card-info .label {
              color: #6b7280;
              padding-right: 8px;
              width: 50px;
            }
            .card-info .value {
              color: #111827;
              font-weight: 500;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-grid">
            <div class="card">
              <div class="card-header">
                <h4>Kartu Identitas Siswa</h4>
                <h3>${academicYearName || "Tahun Ajaran"}</h3>
              </div>
              <div class="card-content">
                <div class="card-photo">
                  ${student.photo_url ? `<img src="${student.photo_url}" alt="${student.full_name}" />` : ""}
                </div>
                <div class="card-info">
                  <table>
                    <tr>
                      <td class="label">NIS</td>
                      <td class="value">${student.student_number}</td>
                    </tr>
                    <tr>
                      <td class="label">Nama</td>
                      <td class="value">${student.full_name}</td>
                    </tr>
                    ${student.nickname ? `<tr><td class="label">Panggilan</td><td class="value">${student.nickname}</td></tr>` : ""}
                    <tr>
                      <td class="label">L/P</td>
                      <td class="value">${student.gender === "male" ? "L" : "P"}</td>
                    </tr>
                    <tr>
                      <td class="label">Tgl Lahir</td>
                      <td class="value">${formatDate(student.birth_date)}</td>
                    </tr>
                    ${student.birth_place ? `<tr><td class="label">Tempat</td><td class="value">${student.birth_place}</td></tr>` : ""}
                    ${student.parents?.find((p) => p.type === "father") ? `<tr><td class="label">Ortu/Wali</td><td class="value">${student.parents?.find((p) => p.type === "father")?.full_name || "-"}</td></tr>` : ""}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Printer className="w-4 h-4" />
      Cetak Kartu
    </Button>
  )
}

// ============================================
// PRINT ALL SELECTED CARDS
// ============================================

interface PrintSelectedCardsButtonProps {
  students: StudentWithClass[]
  academicYearName?: string
}

export function PrintSelectedCardsButton({
  students,
  academicYearName,
}: PrintSelectedCardsButtonProps) {
  const handlePrint = () => {
    if (students.length === 0) {
      alert("Pilih siswa terlebih dahulu")
      return
    }

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Tidak dapat membuka window print. Pastikan popup tidak diblokir.")
      return
    }

    const cardsHtml = students
      .map(
        (student) => `
        <div class="card">
          <div class="card-header">
            <h4>Kartu Identitas Siswa</h4>
            <h3>${academicYearName || "Tahun Ajaran"}</h3>
          </div>
          <div class="card-content">
            <div class="card-photo">
              ${student.photo_url ? `<img src="${student.photo_url}" alt="${student.full_name}" />` : ""}
            </div>
            <div class="card-info">
              <table>
                <tr>
                  <td class="label">NIS</td>
                  <td class="value">${student.student_number}</td>
                </tr>
                <tr>
                  <td class="label">Nama</td>
                  <td class="value">${student.full_name}</td>
                </tr>
                ${student.nickname ? `<tr><td class="label">Panggilan</td><td class="value">${student.nickname}</td></tr>` : ""}
                <tr>
                  <td class="label">L/P</td>
                  <td class="value">${student.gender === "male" ? "L" : "P"}</td>
                </tr>
                <tr>
                  <td class="label">Tgl Lahir</td>
                  <td class="value">${formatDate(student.birth_date)}</td>
                </tr>
                ${student.birth_place ? `<tr><td class="label">Tempat</td><td class="value">${student.birth_place}</td></tr>` : ""}
                ${student.parents?.find((p) => p.type === "father") ? `<tr><td class="label">Ortu/Wali</td><td class="value">${student.parents?.find((p) => p.type === "father")?.full_name || "-"}</td></tr>` : ""}
              </table>
            </div>
          </div>
        </div>
      `
      )
      .join("")

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kartu Siswa - ${students.length} Siswa</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .card-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            .card {
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 24px;
              aspect-ratio: 3/2;
            }
            .card-header {
              text-align: center;
              margin-bottom: 16px;
            }
            .card-header h4 {
              font-size: 10px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin: 0;
            }
            .card-header h3 {
              font-size: 14px;
              font-weight: bold;
              color: #111827;
              margin: 4px 0 0 0;
            }
            .card-content {
              display: flex;
              gap: 16px;
            }
            .card-photo {
              width: 80px;
              height: 96px;
              background: #f3f4f6;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .card-photo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .card-info {
              flex: 1;
              font-size: 10px;
            }
            .card-info table {
              width: 100%;
              border-collapse: collapse;
            }
            .card-info td {
              padding: 2px 0;
              vertical-align: top;
            }
            .card-info .label {
              color: #6b7280;
              padding-right: 8px;
              width: 50px;
            }
            .card-info .value {
              color: #111827;
              font-weight: 500;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-grid">
            ${cardsHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Button variant="outline" onClick={handlePrint}>
      <Printer className="w-4 h-4" />
      Cetak Kartu ({students.length})
    </Button>
  )
}
