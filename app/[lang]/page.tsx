import { getDictionary } from "@/actions/dictionaries"
import Link from 'next/link'

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

