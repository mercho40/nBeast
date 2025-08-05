import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email/signin-template'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getDictionary } from '@/actions/dictionaries'

// Initialize Resend with API key
const resend = new Resend(process.env.AUTH_RESEND_KEY || '')

export async function sendLink({
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
    const username = session?.user?.name || email.split('@')[0]

    // Extract language from URL or default to 'en'
    let lang: 'en' | 'es' = 'en'
    try {
      const urlObj = new URL(url)
      const pathSegments = urlObj.pathname.split('/')
      if (pathSegments[1] === 'es' || pathSegments[1] === 'en') {
        lang = pathSegments[1] as 'en' | 'es'
      }
    } catch {
      // If URL parsing fails, use default language
      lang = 'en'
    }

    const dict = await getDictionary(lang)

    await resend.emails.send({
      from: `${process.env.APP_NAME || 'OpenStore'} <noreply@${process.env.APP_DOMAIN || 'restoman.tech'}>`,
      to: email,
      subject: `${dict.email.signInSubject} - ${process.env.APP_NAME || 'OpenStore'}`,
      react: await EmailTemplate({
        username,
        url,
        productName: process.env.APP_NAME || 'OpenStore',
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

