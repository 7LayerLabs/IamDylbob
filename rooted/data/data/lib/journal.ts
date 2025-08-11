export interface JournalEntry {
  id: string
  plant_id: string
  name: string
  water_freq: 'Weekly' | 'Biweekly' | 'Monthly'
  last: string
  next: string
}

interface AddPlantParams {
  plant_id: string
  name: string
  water_freq: 'Weekly' | 'Biweekly' | 'Monthly'
}

const JOURNAL_KEY = 'plant_journal'

export function getJournal(): JournalEntry[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(JOURNAL_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveJournal(journal: JournalEntry[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal))
}

export function addPlantToJournal({ plant_id, name, water_freq }: AddPlantParams): void {
  const journal = getJournal()
  
  const existingEntry = journal.find(entry => entry.plant_id === plant_id)
  if (existingEntry) {
    return
  }
  
  const now = new Date()
  const next = calculateNextWatering(now, water_freq)
  
  const newEntry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    plant_id,
    name,
    water_freq,
    last: now.toISOString(),
    next: next.toISOString()
  }
  
  journal.push(newEntry)
  saveJournal(journal)
}

export function markPlantWatered(id: string): void {
  const journal = getJournal()
  const entry = journal.find(e => e.id === id)
  
  if (!entry) return
  
  const now = new Date()
  entry.last = now.toISOString()
  entry.next = calculateNextWatering(now, entry.water_freq).toISOString()
  
  saveJournal(journal)
}

export function removeFromJournal(id: string): void {
  const journal = getJournal()
  const filtered = journal.filter(e => e.id !== id)
  saveJournal(filtered)
}

function calculateNextWatering(from: Date, frequency: 'Weekly' | 'Biweekly' | 'Monthly'): Date {
  const next = new Date(from)
  
  switch (frequency) {
    case 'Weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'Biweekly':
      next.setDate(next.getDate() + 14)
      break
    case 'Monthly':
      next.setDate(next.getDate() + 30)
      break
  }
  
  return next
}

// TODO: Future Supabase integration
// - Replace localStorage with Supabase client
// - Add user authentication check
// - Sync journal entries with database
// - Handle offline/online sync