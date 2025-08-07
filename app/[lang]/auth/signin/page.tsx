import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getDictionary } from "@/actions/dictionaries"
import { SignInForm } from "@/components/signin"

export default async function SignIn({
  params,
}: {
  params: Promise<{ lang: "en" | "es" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  // Obtain user session
  let session
  let error
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    })
  } catch(err) {
    error = err
    console.error("Failed to get session:", error)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <SignInForm dict={dict} />
    </main>
  )
}


