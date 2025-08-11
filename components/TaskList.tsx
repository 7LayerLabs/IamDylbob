'use client'

import { useState, useEffect } from 'react'
import { getJournal, markPlantWatered, removeFromJournal, type JournalEntry } from '@/data/lib/journal'

export default function TaskList() {
  const [tasks, setTasks] = useState<JournalEntry[]>([])

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = () => {
    const journal = getJournal()
    const sortedTasks = journal.sort((a, b) => 
      new Date(a.next).getTime() - new Date(b.next).getTime()
    )
    setTasks(sortedTasks)
  }

  const handleMarkDone = (id: string) => {
    markPlantWatered(id)
    loadTasks()
  }

  const handleDelete = (id: string) => {
    removeFromJournal(id)
    loadTasks()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    return `In ${diffDays} days`
  }

  const getDateColor = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-red-600'
    if (diffDays === 0) return 'text-eva-terracotta'
    if (diffDays === 1) return 'text-yellow-600'
    return 'text-eva-ink/60'
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-eva-greenLight/20">
        <p className="text-eva-ink/60">
          No plants in your journal yet. Add plants from the Explorer below to start tracking their care!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div
          key={task.id}
          className="bg-white rounded-2xl p-4 flex items-center justify-between border border-eva-greenLight/20 hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <h4 className="font-semibold text-eva-green">{task.name}</h4>
            <p className={`text-sm font-data ${getDateColor(task.next)}`} data-label>
              Water {formatDate(task.next)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkDone(task.id)}
              className="px-4 py-2 bg-eva-green text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity focus:ring-2 focus:ring-eva-green/30"
            >
              Mark Done
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity focus:ring-2 focus:ring-red-500/30"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}