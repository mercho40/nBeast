"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Dictionary, Lang } from "@/actions/dictionaries"
import { setCookie } from 'cookies-next'
import { Mail } from "lucide-react"
import { renderTextWithActions } from "@/components/dicTextWithAction"
import { BackButton } from "@/components/backButton"

type SignInFormProps = {
  dict: Dictionary;
  lang: Lang
}

export function SignInForm({ dict, lang }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<false | "email" | "google" | "github">(false)
  // Added state for sent view + countdown + resend btn loading
  const [emailSent, setEmailSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track the last email that got a magic link
  const [lastSentEmail, setLastSentEmail] = useState<string | null>(null);
  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  // Helper: start/reset 120s countdown
  const startTimer = (duration = 120) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(duration);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Shared function for sending magic link (used by sign-in and resend)
  const sendMagicLink = async () => {
    setCookie('lang', lang, { maxAge: 60 * 5 });
    await signIn.magicLink({
      email,
      callbackURL: `/auth/callback?source=signin&provider=email`
    });
    setLastSentEmail(normalizeEmail(email));
    setEmailSent(true);
    startTimer(120);
  };

  const handleSignIn = async () => {
    setLoading("email");

    // Validate email and password fields
    if (!email) {
      toast.error(dict.error.emailRequired);
      setLoading(false);
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error(dict.error.invalidEmail);
      setLoading(false);
      return;
    }

    // If same email and countdown is active, do not resend; just show "email sent" view
    const normalizedInput = normalizeEmail(email);
    if (lastSentEmail && normalizedInput === lastSentEmail && secondsLeft > 0) {
      setEmailSent(true);
      setLoading(false);
      return;
    }

    try {
      await sendMagicLink();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : dict.error.genericError;
      console.error("Error during sign-in:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      await signIn.social({ 
        provider, 
        callbackURL: `/auth/callback?source=signin&provider=${provider}` 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : dict.error.genericError;
      console.error(`Error during ${provider} sign-in:`, errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await sendMagicLink();
      toast.success(`${dict.auth.magicLinkSent} ${email}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : dict.error.genericError;
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Reset to login (keep countdown running; do not clear)
  const handleBackToLogin = () => {
    setEmailSent(false);
    // Keep existing timer and secondsLeft so the countdown persists
  };

  return (
    <>
      {emailSent ? (
        <BackButton as="function" onClick={handleBackToLogin} />
      ) : (
        <BackButton as="link" href="goBack" />
      )}
      <Card className="w-full max-w-[95%] sm:max-w-md shadow-none bg-card/0 border-border/0">
        <CardHeader className="space-y-4">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {!emailSent ? (<>{dict.auth.logInTo} {dict.metadata.title}</>) : (dict.auth.checkYourEmail)}
            </h1>
            {emailSent && 
              <p className="text-center text-sm text-muted-foreground">
                {dict.auth.clickLinkToSignIn}
              </p>
            }
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
          {!emailSent ? (
            <>
              <div className="flex flex-col space-y-1 sm:space-y-2">
                <label className="font-semibold text-foreground text-sm sm:text-base" htmlFor="email">
                  {dict.auth.email}
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder={dict.auth.emailPlaceholder}
                    type="email"
                    className="bg-card/30 backdrop-blur-sm border border-border/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full bg-primary text-background hover:bg-primary/60 cursor-pointer mt-2 sm:mt-0"
                size={"default"}
                onClick={
                  async () => await handleSignIn()
                }
                disabled={loading === "email" || loading === "google" || loading === "github" || !email.trim()}
              >
                {loading === "email" ? dict.auth.sendingMagicLink : dict.auth.signInWithMagicLink}
              </Button>
              <div className="relative my-3 sm:my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/20"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">{dict.auth.orContinueWith}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size={"default"}
                  className="bg-card/30 backdrop-blur-sm border border-border/10 hover:bg-card/50 cursor-pointer"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={loading === "email" || loading === "github" || loading === "google"}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span className="ml-1.5 hidden sm:block">{loading === "google" ? dict.auth.signinIn : dict.auth.signInWithGoogle}</span>
                </Button>
                <Button
                  variant="outline"
                  size={"default"}
                  className="bg-card/30 backdrop-blur-sm border border-border/10 hover:bg-card/50 cursor-pointer"
                  onClick={() => handleSocialSignIn("github")}
                  disabled={loading === "email" || loading === "google" || loading === "github"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                    />
                  </svg>
                  <span className="ml-1.5 hidden sm:block">{loading === "github" ? dict.auth.signinIn : dict.auth.signInWithGithub}</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              {emailSent && (
                <div className="p-4 rounded-full bg-white/20">
                  <Mail className="mx-auto h-10 w-10 text-white" />
                </div>
              )}
              <p className="text-center text-sm text-muted-foreground">
                  {dict.auth.magicLinkSent} <span className="font-semibold text-white">{email}</span>
              </p>
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>{dict.auth.checkSpamFolder}</p>
                <p>
                  {dict.auth.didntReciveTheEmail}{" "}
                  {secondsLeft > 0 ? (
                    <span className="font-semibold text-primary">
                      {dict.auth.resendIn.replace("{{seconds}}", String(secondsLeft))}
                    </span>
                  ) : (
                    <span
                      className={`font-semibold ${resendLoading ? "opacity-60 pointer-events-none" : "text-primary hover:underline underline-offset-4 cursor-pointer"}`}
                      onClick={async () => {
                        if (resendLoading) return;
                        await handleResend();
                      }}
                    >
                      {dict.auth.resendEmail}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-0 px-3 sm:px-6">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              {
                renderTextWithActions({
                  text: dict.auth.byContinuingYouAgreeToOurTermsAndConditions,
                  as: 'link',
                  href: ["/terms", "/conditions"],
                  className: "underline underline-offset-4"
                })
              }
            </p>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}