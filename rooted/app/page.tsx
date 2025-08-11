'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import Navigation from '@/components/Navigation'

type FilterChip = 'Easy Care' | 'Low Light' | 'Pet Safe' | 'Air Purifying'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<FilterChip>>(new Set())

  const toggleFilter = (filter: FilterChip) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev)
      if (newFilters.has(filter)) {
        newFilters.delete(filter)
      } else {
        newFilters.add(filter)
      }
      return newFilters
    })
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5E6D3 0%, #E8F5E8 50%, #C8E6C9 100%)' }}>
      <Navigation />
      
      {/* Organic curved background shape */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -right-20 -top-20 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(200, 230, 201, 0.6) 0%, rgba(200, 230, 201, 0.3) 50%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute right-0 top-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(165, 214, 167, 0.4) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,600 Q300,500 600,550 T1200,400 L1440,0 L1440,900 L0,900 Z"
            fill="url(#organic-gradient)"
            opacity="0.3"
          />
          <path
            d="M0,700 Q400,600 700,650 T1300,500 L1440,300 L1440,900 L0,900 Z"
            fill="url(#organic-gradient2)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="organic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8E6C9" />
              <stop offset="100%" stopColor="#A5D6A7" />
            </linearGradient>
            <linearGradient id="organic-gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A5D6A7" />
              <stop offset="100%" stopColor="#81C784" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left side content */}
              <div className="max-w-xl">
                <h1 className="text-5xl lg:text-6xl font-bold text-eva-green mb-6 leading-tight">
                  Your Indoor Plant<br />Care Companion
                </h1>
                
                {/* Search bar */}
                <form onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = `/rooted/plant-database${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`
                }}>
                  <div className="mb-4">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search for plants... (e.g., lily, monstera, snake plant)" />
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(['Easy Care', 'Low Light', 'Pet Safe', 'Air Purifying'] as FilterChip[]).map(filter => (
                      <button
                        type="button"
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          activeFilters.has(filter)
                            ? 'bg-eva-green text-white'
                            : 'bg-white/80 text-eva-ink hover:bg-white backdrop-blur-sm'
                        }`}
                      >
                        {filter === 'Easy Care' && '🌱 '}
                        {filter === 'Low Light' && '🌙 '}
                        {filter === 'Pet Safe' && '🐾 '}
                        {filter === 'Air Purifying' && '🍃 '}
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-[#E67E50] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#D56A3C] transition-colors shadow-lg"
                    >
                      Search Plants
                    </button>
                    <Link
                      href="/rooted/plant-database"
                      className="inline-block bg-eva-green text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-colors shadow-lg"
                    >
                      Browse All Plants
                    </Link>
                  </div>
                </form>
              </div>

              {/* Right side - Eva character with integrated background */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Soft glow behind Eva */}
                  <div 
                    className="absolute inset-0 -inset-x-20 -inset-y-20"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(200, 230, 201, 0.5) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                  <Image
                    src="/rooted/images/eva-monstera.png"
                    alt="Eva holding a monstera plant"
                    width={500}
                    height={600}
                    className="w-full max-w-md lg:max-w-lg h-auto relative z-10 drop-shadow-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature cards */}
        <div className="relative z-10 bg-white/30 backdrop-blur-sm border-t border-white/50">
          <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plant Profiles Card */}
              <Link href="/plant-database" className="group">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-6 hover:bg-white transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🌿</div>
                    <h3 className="font-semibold text-eva-green">Indoor Plant Library</h3>
                  </div>
                  <p className="text-sm text-eva-ink/70">Houseplant care guides & tips</p>
                </div>
              </Link>

              {/* Care Schedules Card */}
              <Link href="/care-tips" className="group">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-6 hover:bg-white transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📅</div>
                    <h3 className="font-semibold text-eva-green">Watering Reminders</h3>
                  </div>
                  <p className="text-sm text-eva-ink/70">Keep your houseplants thriving</p>
                </div>
              </Link>

              {/* Local NH Card */}
              <Link href="/nh-growing-guide" className="group">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-6 hover:bg-white transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📍</div>
                    <h3 className="font-semibold text-eva-green">Indoor Growing Tips</h3>
                  </div>
                  <p className="text-sm text-eva-ink/70">Light, humidity & placement guides</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}