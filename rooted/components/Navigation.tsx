'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/plant-database', label: 'Plant Library' },
    { href: '/care-tips', label: 'Care Guide' },
    { href: '/water-tracker-guide', label: 'Watering Schedule' },
    { href: '/nh-growing-guide', label: 'Indoor Growing Tips' },
    { href: '/resources', label: 'Resources' },
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
        </nav>
      </div>
    </header>
  )
}