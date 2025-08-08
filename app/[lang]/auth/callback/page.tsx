import { dictionaries, Lang } from "@/actions/dictionaries"

export function generateStaticParams() {
  const langs = Object.keys(dictionaries) as Array<Lang>
  return langs.map(lang => ({ lang }))
}

export default async function Callback({
    params,
    }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">Authentication Callback</h1>
                <p className="text-lg">Processing your authentication...</p>
            </div>
        </main>
    )
}