import { RestoShell } from "@/components/RestoShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RestoShell>{children}</RestoShell>;
}
