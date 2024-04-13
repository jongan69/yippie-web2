'use client'
 
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
 
export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log("Navidation Event, URL is: ", url)
    // You can now use the current URL
    // Example: /app?
    // ...
  }, [pathname, searchParams])
 
  return null
}