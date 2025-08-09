import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email/signin-template'
import { auth } from '@/lib/auth'
import { cookies, headers } from 'next/headers'
import { getDictionary, Lang } from '@/actions/dictionaries'
import { db } from "@/db/drizzle"
import { eq } from 'drizzle-orm';
import { verification } from '@/db/schema'

// Initialize Resend with API key
const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function sendMagicLink({
  email,
  token,
  url
}: {
  email: string,
  token: string,
  url: string
}) {

  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    const value = `{"email":"${email}"}`
    const emailSent = await db.query.verification.findFirst({
      where: eq(verification.value, value)
    });
    if (!emailSent?.createdAt) {
      return;
    }
    if (emailSent) {
      const now = new Date();
      const diff = (now.getTime() - emailSent.createdAt.getTime()) / 1000; // difference in seconds
      if (diff < 120) { // less than 1 minute
        return {
          success: false,
          error: 'Too many requests. Please wait before trying again.'
        }
      }
    }
    const username = session?.user?.name || email.split('@')[0]

    // Extract language from URL or default to 'en'
    let lang: Lang = 'en' // Default language
    const cookieStore = await cookies()
    try {
      const langCookie = cookieStore.get("lang");
      if (langCookie) {
        lang = langCookie.value as Lang;
      }
    } catch {
      lang = 'en'
    } finally {
      cookieStore.delete("lang")
    }

    const dict = await getDictionary(lang)

    await resend.emails.send({
      from: `${process.env.APP_NAME || 'nBeast'} <noreply@${process.env.APP_DOMAIN || 'restoman.tech'}>`,
      to: email,
      subject: `${dict.email.signInSubject} - ${process.env.APP_NAME || 'nBeast'}`,
      react: await EmailTemplate({
        username,
        url,
        productName: process.env.APP_NAME || 'nBeast',
        dict
      }),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification email'
    }
  }

}

