import { dictionaries, Lang } from "@/actions/dictionaries"
import { redirect } from "next/navigation"

export function generateStaticParams() {
  const langs = Object.keys(dictionaries) as Array<Lang>
  return langs.map(lang => ({ lang }))
}

export default async function Callback({
    searchParams,
    }: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    
    // Get the redirect path from search params or default to home
    const redirectTo = typeof searchParams?.redirect === 'string' 
        ? searchParams.redirect 
        : '/';
    
    // Redirect to the specified path or home
    redirect(redirectTo);
    
    // If you want to show a loading spinner while redirecting, you can return a spinner component
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
    )
}