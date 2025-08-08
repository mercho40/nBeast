import { getDictionary, Lang, locales } from "@/actions/dictionaries"
import Link from 'next/link'

export const dynamic = "force-static" // Force static generation for this page

export function generateStaticParams() {
  return locales
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Link href="/auth/signin">{dict.auth.account}</Link>
      </div>
    </main>
  )
}

