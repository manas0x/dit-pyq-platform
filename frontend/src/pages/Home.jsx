import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    { icon: '🔍', title: 'Smart Search', desc: 'Find any paper by title instantly' },
    { icon: '📂', title: 'Filter by Subject', desc: 'Browse by subject, semester or year' },
    { icon: '📄', title: 'View & Download', desc: 'Open PDFs directly in your browser' },
    { icon: '🔐', title: 'Secure Auth', desc: 'JWT-protected student & admin access' },
  ]

  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span>📚</span> DIT University Previous Year Questions
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Find Your <span className="text-yellow-300">PYQ Papers</span><br />In Seconds
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Search, filter and access previous year question papers by subject, semester, and year. Study smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pyqs" id="hero-browse-btn"
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg text-lg">
              Browse Papers
            </Link>
            <Link to="/register" id="hero-register-btn"
              className="bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors text-lg">
              Register Free
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Study Smarter?</h2>
          <p className="text-gray-600 mb-8">Join students at DIT University who use this platform every exam season.</p>
          <Link to="/pyqs" className="inline-block bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-colors text-lg shadow-md">
            Explore Papers →
          </Link>
        </div>
      </section>
    </main>
  )
}
