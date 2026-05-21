import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Pamoja+ Ops",
  description: "Internal control plane"
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
