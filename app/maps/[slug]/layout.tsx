import { Suspense } from 'react'
import Loading from './loading'
import { Metadata } from 'next'
import Menu from '@/components/Menu'

export const metadata: Metadata  = {
  openGraph: {
    type: "article"
  }
}
 
export default function MapPageLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense fallback={<Loading />}>
          <Menu selectedPage={"maps"}></Menu>
            {children}
        </Suspense>
  )
}
