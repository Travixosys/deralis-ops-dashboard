import { DesktopSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PageTransition } from "@/components/page-transition";
import { JobDetailSheet } from "@/components/jobs/job-detail-sheet";
import { GuideBar } from "@/components/guide/guide";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full">
        <DesktopSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4 pb-24 md:p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <JobDetailSheet />
      <GuideBar />
    </>
  );
}
