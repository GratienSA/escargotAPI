import React from 'react'
import MainNav from './main-nav'


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex-grow flex justify-center">
              <MainNav className="mx-6" />
            </div>
            <div className="w-36 flex items-center space-x-4">
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  )
}