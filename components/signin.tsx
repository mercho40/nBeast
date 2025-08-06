"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, CheckCircle, Mail } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
      signInWithGithub: string
      checkYourEmail: string
      magicLinkSent: string
      clickLinkToSignIn: string
      checkSpamFolder: string
      backToSignIn: string
    },
    error: {
      invalidEmail: string,
      emailRequired: string,
      magicLinkError: string,
      signInError: string,
      passwordResetError: string,
      userNotFound: string,
      genericError: string,
      ohno: string,
      somethingWentWrong: string,

    },
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
  const handleSocialSignIn = async (provider: "github" | "google") => {
    try {
      setLoading(true);

      await signIn.social(
        {
          provider,
          // Use a consistent callback URL format
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
          onError: (ctx: { error: { message: string } }) => {
            console.error("Social sign-in error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to sign in");
            setLoading(false);
          },
          onSuccess: async () => {
            setLoading(false);
            toast.success("Authentication successful");
          },
        }
      );
    } catch (error: unknown) {
      console.error("Exception during social sign-in:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

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
              onClick={() => handleSocialSignIn("google")}
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
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              disabled={loading}
              onClick={() => handleSocialSignIn("github")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                ></path>
              </svg>
              {dict.auth.signInWithGithub}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


