import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function NHGrowingGuide() {
  const seasons = [
    {
      season: 'Spring (March - May)',
      icon: '🌸',
      tips: [
        'Start seeds indoors 6-8 weeks before last frost (typically mid-May)',
        'Harden off seedlings gradually over 7-10 days',
        'Plant cool-season crops like lettuce and peas in April',
        'Wait until after Memorial Day for tomatoes and peppers',
        'Apply mulch to retain moisture as temperatures rise'
      ]
    },
    {
      season: 'Summer (June - August)',
      icon: '☀️',
      tips: [
        'Water deeply in early morning to combat humidity',
        'Provide shade cloth for lettuce and cool-season crops',
        'Monitor for Japanese beetles and tomato hornworms',
        'Harvest herbs frequently to encourage growth',
        'Start fall crops indoors in late July'
      ]
    },
    {
      season: 'Fall (September - November)',
      icon: '🍂',
      tips: [
        'Plant garlic in October for next summer harvest',
        'Cover tender plants before first frost (typically early October)',
        'Harvest winter squash before hard freeze',
        'Collect leaves for composting',
        'Plant spring bulbs before ground freezes'
      ]
    },
    {
      season: 'Winter (December - February)',
      icon: '❄️',
      tips: [
        'Move houseplants away from cold windows',
        'Reduce watering frequency for indoor plants',
        'Use grow lights to supplement short days',
        'Start planning next year\'s garden',
        'Order seeds by late January for best selection'
      ]
    }
  ]

  const nhPlants = [
    { name: 'Tomatoes', bestVarieties: 'Early Girl, Stupice, Sub Arctic', plantingTime: 'After May 15' },
    { name: 'Peppers', bestVarieties: 'Ace, King of the North', plantingTime: 'After May 20' },
    { name: 'Lettuce', bestVarieties: 'Black Seeded Simpson, Buttercrunch', plantingTime: 'April 15 - May 1' },
    { name: 'Beans', bestVarieties: 'Provider, Blue Lake', plantingTime: 'May 15 - June 15' },
    { name: 'Squash', bestVarieties: 'Butternut, Blue Hubbard', plantingTime: 'May 20 - June 10' },
    { name: 'Herbs', bestVarieties: 'Basil, Cilantro, Dill, Parsley', plantingTime: 'May 15 - June 1' },
  ]

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
            New Hampshire Growing Guide
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-12">
            Gardening tips tailored for USDA Zone 5b (Southern NH including Nashua)
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20 mb-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-4">
              NH Climate Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌡️</div>
                <h4 className="font-semibold mb-1">Zone 5b</h4>
                <p className="text-sm text-eva-ink/70">-15°F to -10°F winter lows</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-semibold mb-1">Last Frost</h4>
                <p className="text-sm text-eva-ink/70">May 10-20 average</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🍁</div>
                <h4 className="font-semibold mb-1">First Frost</h4>
                <p className="text-sm text-eva-ink/70">October 1-10 average</p>
              </div>
            </div>
            <p className="text-eva-ink/80">
              Southern New Hampshire experiences humid continental climate with cold winters and warm, 
              humid summers. The growing season typically runs 140-150 days, requiring careful plant 
              selection and timing for successful gardening.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {seasons.map((season, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-eva-greenLight/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{season.icon}</span>
                  <h3 className="text-[20px] font-headline font-semibold text-eva-green">
                    {season.season}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {season.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-eva-terracotta mt-1">•</span>
                      <span className="text-eva-ink/80 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20 mb-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
              Best Plants for NH Gardens
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-eva-greenLight/30">
                    <th className="text-left py-3 font-semibold text-eva-green">Plant</th>
                    <th className="text-left py-3 font-semibold text-eva-green">Best Varieties</th>
                    <th className="text-left py-3 font-semibold text-eva-green">Planting Time</th>
                  </tr>
                </thead>
                <tbody>
                  {nhPlants.map((plant, index) => (
                    <tr key={index} className="border-b border-eva-greenLight/20">
                      <td className="py-3 font-medium">{plant.name}</td>
                      <td className="py-3 text-eva-ink/70 text-sm">{plant.bestVarieties}</td>
                      <td className="py-3 text-eva-ink/70 text-sm">{plant.plantingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-eva-greenLight/20 rounded-2xl p-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-4">
              NH Indoor Plant Care
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-eva-green mb-2">Winter Challenges</h4>
                <ul className="space-y-1 text-sm text-eva-ink/70">
                  <li>• Low humidity from heating (aim for 40-50%)</li>
                  <li>• Reduced daylight hours (consider grow lights)</li>
                  <li>• Cold drafts from windows</li>
                  <li>• Temperature fluctuations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-eva-green mb-2">Summer Considerations</h4>
                <ul className="space-y-1 text-sm text-eva-ink/70">
                  <li>• High humidity (monitor for fungal issues)</li>
                  <li>• Intense afternoon sun through south windows</li>
                  <li>• AC can dry out plants quickly</li>
                  <li>• Increased watering needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}