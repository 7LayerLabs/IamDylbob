import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function Resources() {
  const resources = {
    websites: [
      { name: 'UNH Cooperative Extension', url: 'https://extension.unh.edu/gardens-landscapes', description: 'Local gardening advice and plant disease diagnostics' },
      { name: 'USDA Plant Hardiness Zone Map', url: 'https://planthardiness.ars.usda.gov/', description: 'Find your exact growing zone' },
      { name: 'The Spruce - Houseplants', url: 'https://www.thespruce.com/houseplants-4127746', description: 'Comprehensive houseplant care guides' },
      { name: 'Houseplant411', url: 'https://www.houseplant411.com/', description: 'Identify and care for indoor plants' },
    ],
    apps: [
      { name: 'PlantNet', platform: 'iOS/Android', description: 'Plant identification using photos' },
      { name: 'PictureThis', platform: 'iOS/Android', description: 'AI-powered plant ID and care reminders' },
      { name: 'Gardenize', platform: 'iOS/Android', description: 'Garden journal and plant diary' },
      { name: 'Seek by iNaturalist', platform: 'iOS/Android', description: 'Identify plants and learn about nature' },
    ],
    books: [
      { title: 'The New Plant Parent', author: 'Darryl Cheng', description: 'Science-based approach to houseplant care' },
      { title: 'Indoor Jungle', author: 'Lauren Camilleri', description: 'Styling with plants and care basics' },
      { title: 'The House Plant Expert', author: 'Dr. D.G. Hessayon', description: 'Comprehensive reference guide' },
      { title: 'How to Houseplant', author: 'Heather Rodino', description: 'Beginner-friendly plant parenting' },
    ],
    localResources: [
      { name: 'NH Plant Growers Association', description: 'Supporting local nurseries and growers', contact: 'nhpga.org' },
      { name: 'Nashua Garden Club', description: 'Monthly meetings and plant swaps', contact: 'nashuagardenclub.org' },
      { name: 'NH Master Gardeners', description: 'Volunteer experts for gardening questions', contact: 'nhmaster.gardeners@unh.edu' },
      { name: 'Hillsborough County Conservation', description: 'Native plant sales and education', contact: 'hccd.org' },
    ]
  }

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
            Resources
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-12">
            Curated collection of tools, guides, and communities for plant enthusiasts
          </p>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20">
              <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
                📚 Recommended Books
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.books.map((book, index) => (
                  <div key={index} className="border-l-4 border-eva-terracotta pl-4">
                    <h3 className="font-semibold text-eva-green">{book.title}</h3>
                    <p className="text-sm text-eva-ink/60 mb-1">by {book.author}</p>
                    <p className="text-sm text-eva-ink/80">{book.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20">
              <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
                🌐 Helpful Websites
              </h2>
              <div className="space-y-4">
                {resources.websites.map((site, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-grow">
                      <a 
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-eva-terracotta hover:text-eva-terracotta/80 transition-colors"
                      >
                        {site.name} →
                      </a>
                      <p className="text-sm text-eva-ink/70 mt-1">{site.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20">
              <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
                📱 Mobile Apps
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.apps.map((app, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-eva-green rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-eva-green">{app.name}</h3>
                      <p className="text-xs text-eva-ink/60 mb-1">{app.platform}</p>
                      <p className="text-sm text-eva-ink/80">{app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-eva-greenLight/20">
              <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-6">
                🌱 Local NH Resources
              </h2>
              <div className="space-y-4">
                {resources.localResources.map((resource, index) => (
                  <div key={index} className="border-b border-eva-greenLight/20 pb-4 last:border-0">
                    <h3 className="font-semibold text-eva-green">{resource.name}</h3>
                    <p className="text-sm text-eva-ink/80 mb-1">{resource.description}</p>
                    <p className="text-sm text-eva-ink/60">{resource.contact}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-eva-greenLight/20 rounded-2xl p-8">
              <h2 className="text-[24px] font-headline font-semibold text-eva-green mb-4">
                Quick Reference
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">☎️</div>
                  <h4 className="font-semibold text-eva-green mb-1">Plant Emergency</h4>
                  <p className="text-xs text-eva-ink/70">
                    UNH Extension Infoline<br />
                    1-877-398-4769
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🐛</div>
                  <h4 className="font-semibold text-eva-green mb-1">Pest ID Help</h4>
                  <p className="text-xs text-eva-ink/70">
                    NH Bug ID<br />
                    extension.unh.edu
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📧</div>
                  <h4 className="font-semibold text-eva-green mb-1">Garden Questions</h4>
                  <p className="text-xs text-eva-ink/70">
                    Master Gardeners<br />
                    answers@unh.edu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}