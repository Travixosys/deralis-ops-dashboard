import { DesktopSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { JobDetailSheet } from "@/components/jobs/job-detail-sheet";
import { GuideBar } from "@/components/guide/guide";

/**
 * Shell: the navy rail holds the navigation and the guide and frames the work, which sits on a pale page
 * inset 8px from the window; white panels sit on that page. On a phone the page is the screen.
 */
export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full bg-rail">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="min-h-0 flex-1 overflow-y-auto bg-page px-4 pb-28 pt-5 md:my-2 md:mr-2 md:rounded-[14px] md:px-7 md:pb-10 md:pt-7">
            {children}
          </main>
        </div>
      </div>
      <JobDetailSheet />
      <GuideBar />
    </>
  );
}
