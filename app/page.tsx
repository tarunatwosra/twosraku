"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import AttendanceChart from "./components/AttendanceChart";
import ScheduleList from "./components/ScheduleList";
import Announcements from "./components/Announcements";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentData = [
    { value: 1200 },
    { value: 1220 },
    { value: 1215 },
    { value: 1230 },
    { value: 1240 },
    { value: 1245 },
    { value: 1248 },
  ];

  const teacherData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 86 },
    { value: 87 },
    { value: 87 },
  ];

  const attendanceData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 84 },
    { value: 86 },
    { value: 88.5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Greeting */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Content */}
        <main className="flex-1 p-5 overflow-auto">
          {/* School Info Banner */}
          <div className="mb-5 flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">SMA Negeri 1 Yogyakarta</span>
            <span>•</span>
            <span>Tahun Ajaran 2023/2024</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <MetricCard
              title="Jumlah Siswa"
              value="1.248"
              trend="dari bulan lalu"
              trendValue="↑ 2.4%"
              isPositive={true}
              color="blue"
              data={studentData}
            />
            <MetricCard
              title="Guru & Staff"
              value="87"
              trend="dari bulan lalu"
              trendValue="↑ 1.6%"
              isPositive={true}
              color="emerald"
              data={teacherData}
            />
            <MetricCard
              title="Presensi Hari Ini"
              value="88.5%"
              trend="dari kemarin"
              trendValue="↑ 3.2%"
              isPositive={true}
              color="purple"
              data={attendanceData}
            />
          </div>

          {/* Content Grid - Attendance & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            {/* Attendance Chart */}
            <AttendanceChart />

            {/* Schedule List */}
            <ScheduleList />
          </div>

          {/* Announcements */}
          <Announcements />
        </main>
      </div>
    </div>
  );
}
