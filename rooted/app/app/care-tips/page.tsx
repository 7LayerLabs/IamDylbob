import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function CareTips() {
  const tips = [
    {
      category: 'Watering',
      icon: '💧',
      tips: [
        'Check soil moisture before watering - stick your finger 1-2 inches deep',
        'Water thoroughly until water drains from the bottom',
        'Most plants prefer room temperature water',
        'Reduce watering frequency in winter months',
        'Yellow leaves often indicate overwatering'
      ]
    },
    {
      category: 'Light',
      icon: '☀️',
      tips: [
        'Bright indirect light: Near a window but not in direct sun',
        'Low light: 5+ feet from a window or north-facing rooms',
        'Direct light: South-facing windows with full sun exposure',
        'Rotate plants weekly for even growth',
        'Leggy growth indicates insufficient light'
      ]
    },
    {
      category: 'Humidity',
      icon: '💨',
      tips: [
        'Group plants together to create a humid microclimate',
        'Use a pebble tray with water for tropical plants',
        'Mist plants in the morning to prevent fungal issues',
        'Keep plants away from heating/cooling vents',
        'Brown leaf tips often indicate low humidity'
      ]
    },
    {
      category: 'Soil & Repotting',
      icon: '🪴',
      tips: [
        'Repot when roots circle the drainage holes',
        'Choose a pot 1-2 inches larger in diameter',
        'Spring is the best time for repotting',
        'Use well-draining soil for most houseplants',
        'Add perlite to improve drainage'
      ]
    },
    {
      category: 'Fertilizing',
      icon: '🌱',
      tips: [
        'Feed during growing season (spring/summer)',
        'Dilute fertilizer to half strength',
        'Skip fertilizing in winter months',
        'Flush soil monthly to prevent salt buildup',
        'Slow growth may indicate nutrient deficiency'
      ]
    },
    {
      category: 'Common Issues',
      icon: '🐛',
      tips: [
        'Inspect new plants for pests before bringing home',
        'Quarantine new plants for 2 weeks',
        'Wipe leaves with neem oil for pest prevention',
        'Remove dead leaves promptly to prevent disease',
        'Good air circulation prevents fungal problems'
      ]
    }
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
            Plant Care Tips
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-12">
            Essential tips and tricks to keep your plants thriving
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-eva-greenLight/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{section.icon}</span>
                  <h2 className="text-[24px] font-headline font-semibold text-eva-green">
                    {section.category}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-eva-terracotta mt-1">•</span>
                      <span className="text-eva-ink/80">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-eva-greenLight/20 rounded-2xl p-8">
            <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-4">
              Golden Rules of Plant Care
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🌿</div>
                <h3 className="font-semibold text-eva-green mb-2">Observe Daily</h3>
                <p className="text-sm text-eva-ink/70">
                  Check your plants regularly for signs of stress or pests
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💚</div>
                <h3 className="font-semibold text-eva-green mb-2">Less is More</h3>
                <p className="text-sm text-eva-ink/70">
                  Overwatering kills more plants than underwatering
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌟</div>
                <h3 className="font-semibold text-eva-green mb-2">Be Patient</h3>
                <p className="text-sm text-eva-ink/70">
                  Plants adapt slowly - give them time to adjust to changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}