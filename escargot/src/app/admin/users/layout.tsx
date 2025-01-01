import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants/index'

export const metadata: Metadata = {
  title: `Admin Users - ${APP_NAME}`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}