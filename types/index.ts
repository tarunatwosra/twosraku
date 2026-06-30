export * from "./student";

// Schedule type for dashboard
export interface Schedule {
  id: string;
  time: string;
  endTime: string;
  subject: string;
  class: string;
  teacher: string;
  room: string;
}
