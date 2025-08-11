'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/plant-database', label: 'Houseplant Database' },
    { href: '/care-tips', label: 'Care Tips' },
    { href: '/water-tracker-guide', label: 'Water Tracker Guide' },
    { href: '/nh-growing-guide', label: 'NH Growing Guide' },
    { href: '/resources', label: 'Resources' },
  ]
  
  const homeLinks = [
    { href: '#plant-explorer', label: 'Plant Explorer' },
    { href: '#my-journal', label: 'My Journal' },
    { href: '#local-shops', label: 'Local Shops' },
  ]
  
  return (
    <header className="bg-white border-b border-eva-greenLight/20 sticky top-0 z-50">
      <div className="px-8 lg:px-16 py-4">
        <nav className="flex items-center justify-center gap-6 flex-wrap">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors font-medium ${
                pathname === link.href
                  ? 'text-eva-green font-semibold'
                  : 'text-eva-ink/70 hover:text-eva-green'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {pathname === '/' && homeLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-eva-ink/70 hover:text-eva-green transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}