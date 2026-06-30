/**
 * Mock Data for Teachers
 */

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  gender: "L" | "P";
  birthPlace: string;
  birthDate: string;
  religion: string;
  position: string;
  subject?: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

// Generate mock teachers
const mockTeachers: Teacher[] = [
  {
    id: "1",
    nip: "198501152010121001",
    name: "DWI Handoko, S.Pd.",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "1985-01-15",
    religion: "Islam",
    position: "Guru Matematika",
    subject: "Matematika",
    phone: "081234567890",
    email: "dwi.handoko@sman1yogya.sch.id",
    address: "Jl. Solo No. 45, Sleman",
    status: "active",
  },
  {
    id: "2",
    nip: "198201202010121002",
    name: "Rina Wijayanti, S.Pd.",
    gender: "P",
    birthPlace: "Sleman",
    birthDate: "1982-02-20",
    religion: "Islam",
    position: "Guru Bahasa Indonesia",
    subject: "Bahasa Indonesia",
    phone: "081234567891",
    email: "rina.wijayanti@sman1yogya.sch.id",
    address: "Jl. Kaliurang Km 7, Sleman",
    status: "active",
  },
  {
    id: "3",
    nip: "197905102008011001",
    name: "Andi Prasetyo, M.Pd.",
    gender: "L",
    birthPlace: "Bantul",
    birthDate: "1979-05-10",
    religion: "Islam",
    position: "Guru Fisika",
    subject: "Fisika",
    phone: "081234567892",
    email: "andi.prasetyo@sman1yogya.sch.id",
    address: "Jl. Imogiri No. 78, Bantul",
    status: "active",
  },
  {
    id: "4",
    nip: "199003152015012001",
    name: "Sari Lestari, S.Pd.",
    gender: "P",
    birthPlace: "Gunung Kidul",
    birthDate: "1990-03-15",
    religion: "Islam",
    position: "Guru Kimia",
    subject: "Kimia",
    phone: "081234567893",
    email: "sari.lestari@sman1yogya.sch.id",
    address: "Jl. Wonosari Km 10, Gunung Kidul",
    status: "active",
  },
  {
    id: "5",
    nip: "198808202012011002",
    name: "Robertus Wijaya",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "1988-08-20",
    religion: "Kristen",
    position: "Guru Matematika",
    subject: "Matematika",
    phone: "081234567894",
    email: "robertus.wijaya@sman1yogya.sch.id",
    address: "Jl. Gejayan No. 12, Sleman",
    status: "active",
  },
  {
    id: "6",
    nip: "199204252018012001",
    name: "Maria Goretti",
    gender: "P",
    birthPlace: "Sleman",
    birthDate: "1992-04-25",
    religion: "Katolik",
    position: "Guru Bahasa Inggris",
    subject: "Bahasa Inggris",
    phone: "081234567895",
    email: "maria.goretti@sman1yogya.sch.id",
    address: "Jl. Parangtritis No. 33, Sleman",
    status: "active",
  },
  {
    id: "7",
    nip: "198512302008011003",
    name: "Hendra Wijaya, S.Si.",
    gender: "L",
    birthPlace: "Yogyakarta",
    birthDate: "1985-12-30",
    religion: "Islam",
    position: "Guru Biologi",
    subject: "Biologi",
    phone: "081234567896",
    email: "hendra.wijaya@sman1yogya.sch.id",
    address: "Jl. Prawirotaman No. 56, Yogyakarta",
    status: "active",
  },
  {
    id: "8",
    nip: "198009102005011001",
    name: "Dr. Ahmad Fauzi, M.Pd.",
    gender: "L",
    birthPlace: "Kulon Progo",
    birthDate: "1980-09-10",
    religion: "Islam",
    position: "Kepala Sekolah",
    phone: "081234567897",
    email: "ahmad.fauzi@sman1yogya.sch.id",
    address: "Jl. Sentolo No. 33, Kulon Progo",
    status: "active",
  },
];

// Simulate API call
export async function getTeachers(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    gender?: string;
    position?: string;
    status?: string;
  }
): Promise<{
  data: Teacher[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...mockTeachers];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.nip.toLowerCase().includes(search)
    );
  }

  if (filters?.gender) {
    filteredData = filteredData.filter((t) => t.gender === filters.gender);
  }

  if (filters?.position) {
    filteredData = filteredData.filter((t) => t.position === filters.position);
  }

  if (filters?.status) {
    filteredData = filteredData.filter((t) => t.status === filters.status);
  }

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

export function getAllPositions(): string[] {
  const positions = new Set(mockTeachers.map((t) => t.position));
  return Array.from(positions).sort();
}
