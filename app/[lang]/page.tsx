import { dictionaries, getDictionary, Lang } from "@/actions/dictionaries"
import Link from 'next/link'

export const dynamic = "force-static" // Force static generation for this page
export function generateStaticParams() {
  const langs = Object.keys(dictionaries) as Array<Lang>
  return langs.map(lang => ({ lang }))
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: "en" | "es" }>
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Link href="/auth/signin">{dict.auth.account}</Link>
      </div>
    </main>
  )
}

