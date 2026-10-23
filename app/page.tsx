import Link from "next/link";
import { Shield } from "lucide-react";
import { ExploreButton } from "@/components/start/explore-button";
import { StartPreview } from "@/components/start/start-preview";
import { GuideSteps, StartGuideFooter } from "@/components/guide/guide";

/**
 * The start page: what the product does, for whom, why it matters, and one way in. The guide's four steps
 * show their live state here too, and a slice of the real demo state sits beside the promise.
 */
export default function StartPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-background">
            <Shield className="h-4 w-4" aria-hidden />
          </span>
          Deralis Ops
        </Link>
        <p className="text-right text-sm text-muted-foreground">
          <span className="sm:hidden">Démo · données fictives</span>
          <span className="hidden sm:inline">Démonstration interactive · Entreprises et données fictives</span>
        </p>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-x-12 gap-y-10 px-4 pb-12 pt-4 sm:px-6 sm:pt-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[52px]">Aucun incident ne reste sans agent.</h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.5] sm:text-lg">
            Le tableau d&apos;exploitation des sociétés de sécurité privée : missions du jour, agents disponibles et incidents à traiter sur un seul
            écran. Vous repérez l&apos;urgence, vous passez le relais à l&apos;agent libre, vous clôturez.
          </p>
          <ExploreButton className="mt-7 min-h-16 w-full rounded-md bg-foreground px-5 text-background sm:w-auto" />

          <section aria-labelledby="journey-title" className="mt-10">
            <h2 id="journey-title" className="text-base font-semibold">
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

        <div className="lg:col-span-5">
          <StartPreview />
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-6 text-sm text-muted-foreground sm:px-6">
        <a href="https://deralis.digital" rel="noopener" className="inline-flex min-h-11 items-center hover:text-foreground">
          Démonstration conçue par Deralis Digital
        </a>
      </footer>
    </div>
  );
}
