export interface Student {
  id: string;
  name: string;
  class: string;
  nis: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  nip: string;
}

export interface Attendance {
  present: number;
  permission: number;
  sick: number;
  absent: number;
  total: number;
}

export interface Schedule {
  id: string;
  time: string;
  endTime: string;
  subject: string;
  class: string;
  teacher: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  isNew: boolean;
}

export interface MetricData {
  label: string;
  value: string | number;
  trend: string;
  trendValue: string;
  isPositive: boolean;
}
