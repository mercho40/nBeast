"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, CheckCircle, Mail } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface SignInProps {
  dict: {
    auth: {
      signIn: string
      signInDescription: string
      email: string
      emailPlaceholder: string
      sendingMagicLink: string
      signInWithMagicLink: string
      signInWithGoogle: string
      checkYourEmail: string
      magicLinkSent: string
      clickLinkToSignIn: string
      checkSpamFolder: string
      backToSignIn: string
    }
  }
}

export default function SignIn({ dict }: SignInProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleMagicLinkSignIn = async () => {
    if (!email || !email.includes("@")) {
      return
    }

    setLoading(true)
    try {
      await signIn.magicLink({ email })
      setMagicLinkSent(true)
    } catch (error) {
      console.error("Error sending magic link:", error)
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            {dict.auth.checkYourEmail}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {dict.auth.magicLinkSent} <span className="font-semibold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Mail className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm">{dict.auth.clickLinkToSignIn}</p>
              <p className="text-xs text-muted-foreground">{dict.auth.checkSpamFolder}</p>
            </div>

            <Button variant="outline" onClick={() => setMagicLinkSent(false)}>
              {dict.auth.backToSignIn}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{dict.auth.signIn}</CardTitle>
        <CardDescription className="text-xs md:text-sm">{dict.auth.signInDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{dict.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder={dict.auth.emailPlaceholder}
              required
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
              disabled={loading}
            />
            <Button className="gap-2" onClick={handleMagicLinkSignIn} disabled={loading || !email}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {dict.auth.sendingMagicLink}
                </>
              ) : (
                dict.auth.signInWithMagicLink
              )}
            </Button>
          </div>

          <div className={cn("w-full gap-2 flex items-center", "justify-between flex-col")}>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              onClick={async () => {
                await signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              {dict.auth.signInWithGoogle}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


