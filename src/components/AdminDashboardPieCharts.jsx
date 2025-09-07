"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Legend, Pie, PieChart, Tooltip } from "recharts";

export function AdminDashboardPieCharts() {
  // User-related data
  const userChartData = [
    { name: "Total Users", value: 21, fill: "#A0522D" },
    { name: "Admins", value: 5, fill: "#D2691E" },
    { name: "Members", value: 2, fill: "#F4A460" },
    { name: "Pending Requests", value: 1, fill: "#CD853F" },
    { name: "Blacklisted Users", value: 0, fill: "#FFE4B5" },
  ];

  // Book-related data
  const bookChartData = [
    { name: "Total Borrows", value: 19, fill: "#A0522D" },
    { name: "Pending Borrows", value: 4, fill: "#D2691E" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* User-Related Pie Chart */}
      <Card className="flex flex-col p-4 md:p-6">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-sm md:text-base">User Statistics</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Overview of user-related data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <PieChart width={300} height={300}>
            <Pie
              data={userChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, value }) => (
                <text
                  style={{ fontWeight: "bold", fontSize: "10px" }}
                >{`${name}: ${value}`}</text>
              )}
            />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "10px" }}
            />
          </PieChart>
        </CardContent>
      </Card>

      {/* Book-Related Pie Chart */}
      <Card className="flex flex-col p-4 md:p-6">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-sm md:text-base">Book Statistics</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Overview of book-related data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <PieChart width={300} height={300}>
            <Pie
              data={bookChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label={({ name, value }) => (
                <text
                  style={{ fontWeight: "bold", fontSize: "10px" }}
                >{`${name}: ${value}`}</text>
              )}
            />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "10px" }}
            />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}
