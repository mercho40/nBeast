import { auth } from "@/lib/auth" // path to your Better Auth server instance
import { headers } from "next/headers"
import SignIn from "@/components/signin"
import { SignOut } from "@/components/signout-button"
import { getDictionary } from "@/actions/dictionaries"

export default async function Account({
  params,
}: {
  params: Promise<{ lang: "en" | "es" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl flex items-center justify-center">
          <SignIn dict={dict} />
        </div>
      </main>
    )
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            {dict.users.welcome}, {session.user.email}
            <SignOut dict={dict} />
          </h1>
        </div>
      </main>
    )
  }
}


