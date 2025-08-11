'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import PlantCard from '@/components/PlantCard'
import TaskList from '@/components/TaskList'
import ShopList from '@/components/ShopList'
import Navigation from '@/components/Navigation'
import plantsData from '@/data/plants.json'
import shopsData from '@/data/shops.json'
import { addPlantToJournal } from '@/data/lib/journal'

type FilterChip = 'Indoor' | 'Low Light' | 'Pet Safe' | 'Water: Weekly'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<FilterChip>>(new Set())
  const [journalUpdateTrigger, setJournalUpdateTrigger] = useState(0)

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

  const filteredPlants = plantsData.filter(plant => {
    const matchesSearch = 
      plant.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (activeFilters.size === 0) return true
    
    let matchesFilters = true
    activeFilters.forEach(filter => {
      switch(filter) {
        case 'Indoor':
          matchesFilters = matchesFilters && plant.indoor_outdoor === 'Indoor'
          break
        case 'Low Light':
          matchesFilters = matchesFilters && plant.light === 'Low'
          break
        case 'Pet Safe':
          matchesFilters = matchesFilters && plant.pet_safe === true
          break
        case 'Water: Weekly':
          matchesFilters = matchesFilters && plant.water_freq === 'Weekly'
          break
      }
    })
    
    return matchesFilters
  })

  const handleAddPlant = (plant: typeof plantsData[0]) => {
    addPlantToJournal({
      plant_id: plant.id,
      name: plant.common_name,
      water_freq: plant.water_freq as 'Weekly' | 'Biweekly' | 'Monthly'
    })
    setJournalUpdateTrigger(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 px-8 py-12 lg:px-16 lg:py-24">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/textlogo.png"
              alt="Rooted with Eva"
              width={400}
              height={100}
              className="h-20 w-auto"
              priority
            />
          </div>
          <h1 className="text-[44px] font-headline font-bold text-eva-green mb-6 leading-tight text-center">
            Discover, Track, and Grow with Eva
          </h1>
          <p className="text-lg mb-8 text-eva-ink/80 text-center">
            Your personal plant companion for nurturing a thriving indoor jungle. 
            Track watering schedules, discover new plants, and connect with local shops.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (searchTerm.trim()) {
                window.location.href = `/plant-database?search=${encodeURIComponent(searchTerm)}`
              } else {
                window.location.href = '/plant-database'
              }
            }}
          >
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="flex justify-center gap-4">
              <button 
                type="submit"
                className="mt-6 bg-eva-terracotta text-white px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity focus:ring-4 focus:ring-eva-terracotta/30"
              >
                Search Plant Database
              </button>
              <Link
                href="/plant-database"
                className="mt-6 bg-eva-green text-white px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity focus:ring-4 focus:ring-eva-green/30 inline-block"
              >
                Browse All Plants
              </Link>
            </div>
          </form>
        </div>
        
        <div className="w-full lg:w-1/2 p-8 lg:p-16">
          <div className="bg-gradient-to-br from-eva-beige via-eva-greenLight/40 to-eva-greenLight/60 rounded-3xl p-8 h-full flex items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-eva-greenLight/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-eva-greenLight/30"></div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-eva-beige/50 via-eva-greenLight/30 to-eva-greenLight/50 rounded-3xl blur-2xl"></div>
              <Image
                src="/images/logo_new.png"
                alt="Rooted with Eva"
                width={500}
                height={500}
                className="w-full h-auto max-w-md relative z-10 drop-shadow-2xl mix-blend-multiply opacity-95 rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-16 pb-16">
        <section id="my-journal" className="mb-16">
          <h2 className="text-[28px] font-bold text-eva-green mb-6">Today's Care</h2>
          <TaskList key={journalUpdateTrigger} />
        </section>

        <section id="plant-explorer" className="mb-16">
          <h2 className="text-[28px] font-bold text-eva-green mb-6">Plant Explorer</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {(['Indoor', 'Low Light', 'Pet Safe', 'Water: Weekly'] as FilterChip[]).map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-data transition-all ${
                  activeFilters.has(filter)
                    ? 'bg-eva-green text-white'
                    : 'bg-eva-greenLight/30 text-eva-ink hover:bg-eva-greenLight/50'
                } focus:ring-2 focus:ring-eva-green/30`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onAdd={() => handleAddPlant(plant)}
              />
            ))}
          </div>
          
          {filteredPlants.length === 0 && (
            <p className="text-eva-ink/60 text-center py-8">
              No plants match your search criteria. Try adjusting your filters.
            </p>
          )}
        </section>

        <section id="local-shops">
          <h2 className="text-[28px] font-bold text-eva-green mb-6">Local Shops (NH)</h2>
          <ShopList shops={shopsData} />
        </section>
      </div>
    </main>
  )
}