import { useState, useEffect } from 'react'
import api from '../api'
import PYQCard from '../components/PYQCard'
import SearchBar from '../components/SearchBar'
import Filter from '../components/Filter'
import Loading from '../components/Loading'

export default function PYQList() {
  const [pyqs, setPyqs] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ subject: '', semester: '', year: '' })

  useEffect(() => {
    api.get('/subjects').then(res => setSubjects(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filters.subject) params.set('subject', filters.subject)
    if (filters.semester) params.set('semester', filters.semester)
    if (filters.year) params.set('year', filters.year)

    api.get(`/pyqs?${params.toString()}`)
      .then(res => setPyqs(res.data))
      .catch(() => setError('Failed to load papers. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [search, filters])

  function clearFilters() {
    setSearch('')
    setFilters({ subject: '', semester: '', year: '' })
  }

  const hasFilters = search || filters.subject || filters.semester || filters.year

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Browse Papers</h1>
        <p className="text-gray-500">Search and filter previous year question papers</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Filter subjects={subjects} filters={filters} onChange={setFilters} />
          {hasFilters && (
            <button
              onClick={clearFilters}
              id="clear-filters-btn"
              className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg font-medium">No papers found</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-indigo-600 font-semibold hover:underline">
              Clear filters and try again
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4 font-medium">{pyqs.length} paper{pyqs.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pyqs.map(pyq => <PYQCard key={pyq.id} pyq={pyq} />)}
          </div>
        </>
      )}
    </div>
  )
}
