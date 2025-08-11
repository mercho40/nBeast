import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Loader2 className="animate-spin w-10 h-10"/>
    </main>
  )
}
