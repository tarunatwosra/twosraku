"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";

const data = [
  { name: "Hadir", value: 1102, percent: 88.5, color: "#22c55e" },
  { name: "Izin", value: 98, percent: 7.9, color: "#3b82f6" },
  { name: "Sakit", value: 32, percent: 2.6, color: "#eab308" },
  { name: "Alpha", value: 16, percent: 1.0, color: "#ef4444" },
];

export default function AttendanceChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Presensi Hari Ini</h3>
        <a
          href="#"
          className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          Lihat detail presensi
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800">88.5%</span>
            <span className="text-[10px] text-gray-400">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800">
                  {item.value.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-gray-400 w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
