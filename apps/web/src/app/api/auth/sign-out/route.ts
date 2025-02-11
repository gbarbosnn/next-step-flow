import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/sign-in'
  cookieStore.delete('token')

  return NextResponse.redirect(redirectUrl)
}
