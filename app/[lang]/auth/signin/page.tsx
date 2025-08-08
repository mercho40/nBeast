import { dictionaries, getDictionary, Lang } from "@/actions/dictionaries"
import { SignInForm } from "@/components/signin"

export function generateStaticParams() {
  const langs = Object.keys(dictionaries) as Array<Lang>
  return langs.map(lang => ({ lang }))
}

export default async function SignIn({
  params,
}: {
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <SignInForm dict={dict} lang={lang} />
    </main>
  )
}


