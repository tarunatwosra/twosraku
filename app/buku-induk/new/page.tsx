"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { FormPageTemplate, type FormSection, type FormField } from "@/components/templates";
import { GENDERS, RELIGIONS, CLASS_LEVELS, ACADEMIC_YEARS } from "@/constants";

export default function NewStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      router.push("/buku-induk");
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections: FormSection[] = [
    {
      title: "Data Pribadi Siswa",
      description: "Masukkan informasi pribadi siswa",
      fields: [
        { name: "nis", label: "NIS", type: "text", placeholder: "Contoh: 2021001", required: true } as FormField,
        { name: "nisn", label: "NISN", type: "text", placeholder: "Contoh: 0012345678", required: true } as FormField,
        { name: "name", label: "Nama Lengkap", type: "text", placeholder: "Masukkan nama lengkap", required: true } as FormField,
        { name: "gender", label: "Jenis Kelamin", type: "select", placeholder: "Pilih jenis kelamin", required: true, options: GENDERS.map((g) => ({ value: g.value, label: g.label })) } as FormField,
        { name: "birthPlace", label: "Tempat Lahir", type: "text", placeholder: "Contoh: Yogyakarta", required: true } as FormField,
        { name: "birthDate", label: "Tanggal Lahir", type: "date", required: true } as FormField,
        { name: "religion", label: "Agama", type: "select", placeholder: "Pilih agama", required: true, options: RELIGIONS.map((r) => ({ value: r, label: r })) } as FormField,
        { name: "phone", label: "No. Telepon", type: "phone", placeholder: "Contoh: 081234567890" } as FormField,
        { name: "email", label: "Email", type: "email", placeholder: "Contoh: email@contoh.com" } as FormField,
        { name: "address", label: "Alamat", type: "textarea", placeholder: "Masukkan alamat lengkap", required: true, colSpan: 2 } as FormField,
      ],
    },
    {
      title: "Data Akademik",
      description: "Informasi akademik siswa",
      fields: [
        { name: "class", label: "Kelas", type: "select", placeholder: "Pilih kelas", required: true, options: [
          { value: "X IPA 1", label: "X IPA 1" },
          { value: "X IPA 2", label: "X IPA 2" },
          { value: "X IPS 1", label: "X IPS 1" },
          { value: "X IPS 2", label: "X IPS 2" },
          { value: "XI IPA 1", label: "XI IPA 1" },
          { value: "XI IPA 2", label: "XI IPA 2" },
          { value: "XI IPS 1", label: "XI IPS 1" },
          { value: "XI IPS 2", label: "XI IPS 2" },
          { value: "XII IPA 1", label: "XII IPA 1" },
          { value: "XII IPA 2", label: "XII IPA 2" },
          { value: "XII IPS 1", label: "XII IPS 1" },
          { value: "XII IPS 2", label: "XII IPS 2" },
        ] } as FormField,
        { name: "academicYear", label: "Tahun Ajaran", type: "select", placeholder: "Pilih tahun ajaran", required: true, options: ACADEMIC_YEARS.map((y) => ({ value: y, label: y })) } as FormField,
        { name: "entryDate", label: "Tanggal Masuk", type: "date", required: true } as FormField,
      ],
    },
    {
      title: "Data Orang Tua/Wali",
      description: "Informasi orang tua atau wali siswa",
      fields: [
        { name: "fatherName", label: "Nama Ayah", type: "text", placeholder: "Masukkan nama ayah" } as FormField,
        { name: "fatherJob", label: "Pekerjaan Ayah", type: "text", placeholder: "Contoh: PNS, Wiraswasta" } as FormField,
        { name: "motherName", label: "Nama Ibu", type: "text", placeholder: "Masukkan nama ibu" } as FormField,
        { name: "motherJob", label: "Pekerjaan Ibu", type: "text", placeholder: "Contoh: Ibu Rumah Tangga" } as FormField,
        { name: "guardianName", label: "Nama Wali (opsional)", type: "text", placeholder: "Masukkan nama wali" } as FormField,
        { name: "guardianPhone", label: "No. Telepon Wali", type: "phone", placeholder: "Contoh: 081234567890" } as FormField,
      ],
    },
  ];

  return (
    <AppLayout>
      <FormPageTemplate
        title="Tambah Siswa Baru"
        description="Masukkan data siswa untuk添加到 buku induk"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Akademik", href: "/buku-induk" },
          { label: "Tambah Siswa" },
        ]}
        sections={sections}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Simpan Siswa"
        cancelHref="/buku-induk"
      />
    </AppLayout>
  );
}
