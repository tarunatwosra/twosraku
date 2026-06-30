/**
 * Mock Data for Attendance
 */

export interface Attendance {
  id: string;
  date: string;
  class: string;
  subject?: string;
  totalStudents: number;
  present: number;
  absent: number;
  sick: number;
  permission: number;
  late: number;
  attendanceRate: number;
  recordedBy: string;
  recordedAt: string;
}

// Generate mock attendance data
const mockAttendance: Attendance[] = [
  {
    id: "1",
    date: "2025-01-15",
    class: "X IPA 1",
    subject: "Matematika",
    totalStudents: 36,
    present: 34,
    absent: 1,
    sick: 1,
    permission: 0,
    late: 2,
    attendanceRate: 94.4,
    recordedBy: "DWI Handoko",
    recordedAt: "2025-01-15T07:30:00",
  },
  {
    id: "2",
    date: "2025-01-15",
    class: "X IPA 2",
    subject: "Bahasa Indonesia",
    totalStudents: 35,
    present: 33,
    absent: 2,
    sick: 0,
    permission: 0,
    late: 1,
    attendanceRate: 94.3,
    recordedBy: "Rina Wijayanti",
    recordedAt: "2025-01-15T07:35:00",
  },
  {
    id: "3",
    date: "2025-01-15",
    class: "X IPS 1",
    subject: "Ekonomi",
    totalStudents: 32,
    present: 30,
    absent: 1,
    sick: 1,
    permission: 0,
    late: 0,
    attendanceRate: 93.8,
    recordedBy: "Siti Aminah",
    recordedAt: "2025-01-15T07:40:00",
  },
  {
    id: "4",
    date: "2025-01-14",
    class: "XI IPA 1",
    subject: "Fisika",
    totalStudents: 36,
    present: 35,
    absent: 0,
    sick: 1,
    permission: 0,
    late: 1,
    attendanceRate: 97.2,
    recordedBy: "Andi Prasetyo",
    recordedAt: "2025-01-14T07:30:00",
  },
  {
    id: "5",
    date: "2025-01-14",
    class: "XI IPS 2",
    subject: "Geografi",
    totalStudents: 34,
    present: 32,
    absent: 1,
    sick: 0,
    permission: 1,
    late: 2,
    attendanceRate: 94.1,
    recordedBy: "Joko Widodo",
    recordedAt: "2025-01-14T07:35:00",
  },
  {
    id: "6",
    date: "2025-01-13",
    class: "XII IPA 1",
    subject: "Kimia",
    totalStudents: 36,
    present: 36,
    absent: 0,
    sick: 0,
    permission: 0,
    late: 0,
    attendanceRate: 100.0,
    recordedBy: "Sari Lestari",
    recordedAt: "2025-01-13T07:30:00",
  },
  {
    id: "7",
    date: "2025-01-13",
    class: "XII IPS 1",
    subject: "Sosiologi",
    totalStudents: 32,
    present: 30,
    absent: 1,
    sick: 1,
    permission: 0,
    late: 1,
    attendanceRate: 93.8,
    recordedBy: "Budi Santoso",
    recordedAt: "2025-01-13T07:35:00",
  },
];

// Simulate API call
export async function getAttendance(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    class?: string;
    date?: string;
  }
): Promise<{
  data: Attendance[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...mockAttendance];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (a) =>
        a.class.toLowerCase().includes(search) ||
        a.subject?.toLowerCase().includes(search) ||
        a.recordedBy.toLowerCase().includes(search)
    );
  }

  if (filters?.class) {
    filteredData = filteredData.filter((a) => a.class === filters.class);
  }

  if (filters?.date) {
    filteredData = filteredData.filter((a) => a.date === filters.date);
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

export function getAllClasses(): string[] {
  const classes = new Set(mockAttendance.map((a) => a.class));
  return Array.from(classes).sort();
}

// Get today's attendance summary
export function getTodaySummary() {
  const today = new Date().toISOString().split("T")[0];
  const todayData = mockAttendance.filter((a) => a.date === today);

  const totalStudents = todayData.reduce((sum, a) => sum + a.totalStudents, 0);
  const totalPresent = todayData.reduce((sum, a) => sum + a.present, 0);
  const totalAbsent = todayData.reduce((sum, a) => sum + a.absent, 0);

  return {
    totalRecords: todayData.length,
    totalStudents,
    present: totalPresent,
    absent: totalAbsent,
    averageRate: totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0,
  };
}
