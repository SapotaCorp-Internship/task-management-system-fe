import { useState, ReactNode } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import AppSidebar from "./AppSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <AppSidebar collapsed={!sidebarOpen} />

      <div className="flex-1 p-6">
        <Button type="text" icon={<MenuOutlined />} onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-6" />
        {children}
      </div>
    </div>
  );
}