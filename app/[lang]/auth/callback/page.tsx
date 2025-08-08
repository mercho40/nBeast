import { locales } from "@/actions/dictionaries"
import { redirect } from "next/navigation"

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export default async function Callback({
    searchParams,
    }: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    
    // Await the search params
    const resolvedSearchParams = await searchParams || {};
    
    // Get the redirect path from search params or default to home
    const redirectTo = typeof resolvedSearchParams.redirect === 'string' 
        ? resolvedSearchParams.redirect 
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