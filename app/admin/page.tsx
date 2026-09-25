import type { Metadata } from "next";
import AdminRefresh from "@/components/AdminRefresh";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="admin-page">
      <h1 className="page-title">Admin</h1>
      <p className="page-sub">Tools for managing the job board.</p>
      <AdminRefresh />
    </div>
  );
}
