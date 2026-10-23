import { DesktopSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { JobDetailSheet } from "@/components/jobs/job-detail-sheet";
import { GuideBar } from "@/components/guide/guide";

/**
 * Shell: one painted-steel frame holds the navigation and the guide; the work sits on a white sheet
 * inset 8px from the window, with a 1px edge and no shadow. On a phone the sheet is the screen.
 */
export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full bg-frame">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="min-h-0 flex-1 overflow-y-auto bg-sheet px-4 pb-28 pt-5 md:my-2 md:mr-2 md:rounded-[14px] md:px-7 md:pb-10 md:pt-7 md:border">
            {children}
          </main>
        </div>
      </div>
      <JobDetailSheet />
      <GuideBar />
    </>
  );
}
