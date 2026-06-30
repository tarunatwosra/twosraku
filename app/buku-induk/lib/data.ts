/**
 * Mock Data for Student Registry
 * This will be replaced with actual API calls
 */

import type { Student, PaginatedStudents } from "@/types";

// Generate mock students
const mockStudents: Student[] = [
  {
    id: "1",
    nis: "2021001",
    nisn: "0012345678",
    name: "Ahmad Rizki Pratama",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "2008-03-15",
    religion: "Islam",
    class: "X IPA 1",
    academicYear: "2024/2025",
    address: "Jl. Malioboro No. 123",
    village: "Gedong Tengen",
    district: "Gedong Tengen",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    postalCode: "55213",
    phone: "081234567890",
    email: "ahmad.rizki@email.com",
    fatherName: "Budi Pratama",
    fatherJob: "PNS",
    motherName: "Siti Aminah",
    motherJob: "Guru",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "2",
    nis: "2021002",
    nisn: "0012345679",
    name: "Anisa Rahma Putri",
    gender: "P",
    birthPlace: "Sleman",
    birthDate: "2008-05-22",
    religion: "Islam",
    class: "X IPA 1",
    academicYear: "2024/2025",
    address: "Jl. Solo No. 45",
    village: "Caturtunggal",
    district: "Depok",
    city: "Sleman",
    province: "DI Yogyakarta",
    postalCode: "55281",
    phone: "081234567891",
    email: "anisa.rahma@email.com",
    fatherName: "Joko Rahmat",
    fatherJob: "Wiraswasta",
    motherName: "Dewi Lestari",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "3",
    nis: "2021003",
    nisn: "0012345680",
    name: "Bagas Setiawan",
    gender: "L",
    birthPlace: "Bantul",
    birthDate: "2008-01-10",
    religion: "Islam",
    class: "X IPS 1",
    academicYear: "2024/2025",
    address: "Jl. Imogiri No. 78",
    village: "Imogiri",
    district: "Imogiri",
    city: "Bantul",
    province: "DI Yogyakarta",
    postalCode: "55782",
    phone: "081234567892",
    email: "bagas.setiawan@email.com",
    fatherName: "Surya Setiawan",
    fatherJob: "Petani",
    motherName: "Kartika Sari",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "4",
    nis: "2021004",
    nisn: "0012345681",
    name: "Citra Dewi Lestari",
    gender: "P",
    birthPlace: "Gunung Kidul",
    birthDate: "2008-07-30",
    religion: "Islam",
    class: "X IPA 2",
    academicYear: "2024/2025",
    address: "Jl. Wonosari Km 10",
    village: "Nologaten",
    district: "Wonosari",
    city: "Gunung Kidul",
    province: "DI Yogyakarta",
    postalCode: "55813",
    phone: "081234567893",
    fatherName: "Hendra Wijaya",
    fatherJob: "Karyawan Swasta",
    motherName: "Lina Marlina",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "5",
    nis: "2021005",
    nisn: "0012345682",
    name: "Dimas Permana",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "2008-09-18",
    religion: "Kristen",
    class: "X IPA 2",
    academicYear: "2024/2025",
    address: "Jl. Gejayan No. 12",
    village: "Sleman",
    district: "Sleman",
    city: "Sleman",
    province: "DI Yogyakarta",
    postalCode: "55284",
    phone: "081234567894",
    email: "dimas.permana@email.com",
    fatherName: "Robertus Permana",
    fatherJob: "Dosen",
    motherName: "Maria Goretti",
    motherJob: "Guru",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "6",
    nis: "2021006",
    nisn: "0012345683",
    name: "Evi Susilowati",
    gender: "P",
    birthPlace: "Kulon Progo",
    birthDate: "2008-04-05",
    religion: "Islam",
    class: "X IPS 2",
    academicYear: "2024/2025",
    address: "Jl. Sentolo No. 33",
    village: "Sentolo",
    district: "Sentolo",
    city: "Kulon Progo",
    province: "DI Yogyakarta",
    postalCode: "55663",
    phone: "081234567895",
    fatherName: "Ahmad Susilo",
    fatherJob: "Petani",
    motherName: "Siti Rahayu",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2024-07-15",
  },
  {
    id: "7",
    nis: "2021007",
    nisn: "0012345684",
    name: "Farhan Akbar",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "2008-11-20",
    religion: "Islam",
    class: "XI IPA 1",
    academicYear: "2024/2025",
    address: "Jl. Prawirotaman No. 56",
    village: "Brontokusuman",
    district: "Mergangsan",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    postalCode: "55153",
    phone: "081234567896",
    email: "farhan.akbar@email.com",
    fatherName: "Irwan Akbar",
    fatherJob: "Pengusaha",
    motherName: "Nurul Hidayah",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2023-07-17",
  },
  {
    id: "8",
    nis: "2021008",
    nisn: "0012345685",
    name: "Gita Nurulfia",
    gender: "P",
    birthPlace: "Sleman",
    birthDate: "2008-02-14",
    religion: "Islam",
    class: "XI IPA 1",
    academicYear: "2024/2025",
    address: "Jl. Kaliurang Km 7",
    village: "Sinduadi",
    district: "Mlati",
    city: "Sleman",
    province: "DI Yogyakarta",
    postalCode: "55284",
    phone: "081234567897",
    email: "gita.nurulfia@email.com",
    fatherName: "Hafiz Nurul",
    fatherJob: "Konsultan",
    motherName: "Rina Marlina",
    motherJob: "Dokter",
    status: "active",
    entryDate: "2023-07-17",
  },
  {
    id: "9",
    nis: "2021009",
    nisn: "0012345686",
    name: "Hendra Gunawan",
    gender: "L",
    birthPlace: "Bantul",
    birthDate: "2007-06-08",
    religion: "Hindu",
    class: "XII IPS 1",
    academicYear: "2024/2025",
    address: "Jl. Parangtritis Km 25",
    village: "Tirtosari",
    district: "Panggang",
    city: "Gunung Kidul",
    province: "DI Yogyakarta",
    postalCode: "55872",
    phone: "081234567898",
    fatherName: "Made Gunawan",
    fatherJob: "Petani",
    motherName: "Ketut Suarni",
    motherJob: "Ibu Rumah Tangga",
    status: "graduated",
    entryDate: "2022-07-18",
    graduationDate: "2025-06-30",
  },
  {
    id: "10",
    nis: "2021010",
    nisn: "0012345687",
    name: "Ika Putri Maharani",
    gender: "P",
    birthPlace: "Yogyakarta",
    birthDate: "2008-08-25",
    religion: "Islam",
    class: "X IPS 1",
    academicYear: "2024/2025",
    address: "Jl. AFFAND Park No. 8",
    village: "Kota Gude",
    district: "Condongcatur",
    city: "Sleman",
    province: "DI Yogyakarta",
    postalCode: "55283",
    phone: "081234567899",
    email: "ika.maharani@email.com",
    fatherName: "Dedi Kurniawan",
    fatherJob: "Karyawan Bank",
    motherName: "Yuni Astuti",
    motherJob: "Ibu Rumah Tangga",
    status: "active",
    entryDate: "2024-07-15",
  },
];

// Simulate API call
export async function getStudents(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    gender?: string;
    class?: string;
    status?: string;
  }
): Promise<PaginatedStudents> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...mockStudents];

  // Apply filters
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.nis.toLowerCase().includes(search) ||
        s.nisn.toLowerCase().includes(search)
    );
  }

  if (filters?.gender) {
    filteredData = filteredData.filter((s) => s.gender === filters.gender);
  }

  if (filters?.class) {
    filteredData = filteredData.filter((s) => s.class === filters.class);
  }

  if (filters?.status) {
    filteredData = filteredData.filter((s) => s.status === filters.status);
  }

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filteredData.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

// Get all classes for filter options
export function getAllClasses(): string[] {
  const classes = new Set(
    mockStudents.map((s) => s.class).filter((c): c is string => !!c)
  );
  return Array.from(classes).sort();
}
