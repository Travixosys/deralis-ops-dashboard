import Link from "next/link";
import { ExploreButton } from "@/components/start/explore-button";
import { StartPreview } from "@/components/start/start-preview";
import { GuideSteps, StartGuideFooter } from "@/components/guide/guide";
import { Mark } from "@/components/ops/mark";

/**
 * The start page: what the product does, for whom, why it matters, and one way in. The guide's four steps
 * show their live state here too, and a real slice of the demo (the incident and the key board) sits beside the promise.
 */
export default function StartPage() {
  return (
    <div className="flex min-h-full flex-col bg-frame">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 text-[16px] font-semibold tracking-[-0.01em]">
          <Mark size={30} />
          Deralis Ops
        </Link>
        <p className="text-right text-[13px] leading-5 text-muted-ink">
          <span className="sm:hidden">Démo interactive · données fictives</span>
          <span className="hidden sm:inline">Démonstration interactive · Entreprises et données fictives</span>
        </p>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 items-start gap-x-14 gap-y-10 px-4 pb-14 pt-7 sm:px-8 sm:pt-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="condensed text-[42px] font-bold leading-[0.98] tracking-[-0.012em] sm:text-[68px]">Aucun incident ne reste sans agent.</h1>
          <p className="mt-5 max-w-[50ch] text-[17px] leading-[1.5] sm:mt-6 sm:text-[18px]">
            Le tableau d&apos;exploitation des sociétés de sécurité privée : missions du jour, agents disponibles et incidents à traiter sur un seul écran. Vous
            repérez l&apos;urgence, vous passez le relais à l&apos;agent libre, vous clôturez.
          </p>
          <ExploreButton className="mt-7 min-h-16 w-full rounded-lg bg-rail px-5 text-rail-ink shadow-[inset_0_-3px_0_var(--signal)] transition-colors hover:bg-rail-2 sm:w-[380px]" />

          <section aria-labelledby="journey-title" className="mt-10 max-w-[440px]">
            <h2 id="journey-title" className="text-[15px] font-semibold">
              Le parcours guidé
            </h2>
            <div className="-mx-3 mt-2">
              <GuideSteps variant="start" />
            </div>
            <div className="-mx-3">
              <StartGuideFooter />
            </div>
          </section>
        </div>

        <div className="lg:col-span-6">
          <StartPreview />
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1200px] px-4 pb-6 text-[13px] text-muted-ink sm:px-8">
        <a href="https://deralis.digital" rel="noopener" className="inline-flex min-h-11 items-center hover:text-ink">
          Démonstration conçue par Deralis Digital
        </a>
      </footer>
    </div>
  );
}
