import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function WaterTrackerGuide() {
  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/textlogo.png"
              alt="Rooted with Eva"
              width={300}
              height={75}
              className="h-16 w-auto"
            />
          </div>
          
          <h1 className="text-[40px] font-headline font-bold text-eva-green text-center mb-4">
            Water Tracker Guide
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-12">
            Master the art of watering with our comprehensive tracking system
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20 mb-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
              How to Use the Water Tracker
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-eva-terracotta text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-eva-green mb-2">Add Plants to Your Journal</h3>
                  <p className="text-eva-ink/80">
                    Browse the Plant Explorer on the home page and click "Add to Journal" for each plant you own. 
                    The tracker automatically calculates watering schedules based on each plant's needs.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-eva-terracotta text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-eva-green mb-2">Check Today's Care Section</h3>
                  <p className="text-eva-ink/80">
                    Visit the "Today's Care" section daily to see which plants need watering. 
                    Plants are sorted by urgency - overdue plants appear first with red indicators.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-eva-terracotta text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-eva-green mb-2">Mark Plants as Watered</h3>
                  <p className="text-eva-ink/80">
                    After watering a plant, click "Mark Done" to update the schedule. 
                    The tracker automatically calculates the next watering date based on the plant's frequency.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-eva-greenLight/20">
              <h3 className="text-[20px] font-headline font-semibold text-eva-green mb-4">
                Watering Frequencies
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-eva-greenLight/20">
                  <span className="font-medium">Weekly</span>
                  <span className="text-eva-ink/70">Every 7 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-eva-greenLight/20">
                  <span className="font-medium">Biweekly</span>
                  <span className="text-eva-ink/70">Every 14 days</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Monthly</span>
                  <span className="text-eva-ink/70">Every 30 days</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-eva-greenLight/20">
              <h3 className="text-[20px] font-headline font-semibold text-eva-green mb-4">
                Status Indicators
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Overdue - needs immediate attention</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-eva-terracotta rounded-full"></div>
                  <span>Due today - water when convenient</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Due tomorrow - prepare to water</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-eva-greenLight rounded-full"></div>
                  <span>Not due yet - check back later</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-eva-greenLight/20 rounded-2xl p-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-4">
              Pro Tips for Water Tracking
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-eva-green mb-2">🌊 Adjust for Seasons</h4>
                <p className="text-sm text-eva-ink/70">
                  Plants need less water in winter. Consider extending intervals during dormant months.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-eva-green mb-2">🌡️ Check Soil First</h4>
                <p className="text-sm text-eva-ink/70">
                  The tracker is a guide - always check soil moisture before watering.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-eva-green mb-2">📱 Set Reminders</h4>
                <p className="text-sm text-eva-ink/70">
                  Check your tracker daily or set phone reminders for watering days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-eva-green mb-2">📝 Take Notes</h4>
                <p className="text-sm text-eva-ink/70">
                  Notice patterns - some plants may need schedule adjustments based on your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}