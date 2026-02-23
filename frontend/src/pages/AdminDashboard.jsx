import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Loading from '../components/Loading'

export default function AdminDashboard() {
  const [pyqs, setPyqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  function fetchPyqs() {
    setLoading(true)
    api.get('/pyqs').then(res => setPyqs(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPyqs() }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this PYQ?')) return
    try {
      await api.delete(`/pyqs/${id}`)
      setPyqs(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  const filtered = pyqs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.subject_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all PYQ papers</p>
        </div>
        <Link to="/admin/add" id="add-pyq-btn"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add PYQ
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <input
            id="admin-search"
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50"
          />
        </div>

        {loading ? <Loading /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Subject</th>
                  <th className="text-left px-6 py-4">Sem</th>
                  <th className="text-left px-6 py-4">Year</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">No papers found</td>
                  </tr>
                ) : filtered.map(pyq => (
                  <tr key={pyq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{pyq.title}</td>
                    <td className="px-6 py-4 text-gray-600">{pyq.subject_name}</td>
                    <td className="px-6 py-4 text-gray-600">{pyq.semester}</td>
                    <td className="px-6 py-4 text-gray-600">{pyq.year}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={pyq.pdf_url} target="_blank" rel="noopener noreferrer"
                          id={`view-pdf-${pyq.id}`}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors">
                          View
                        </a>
                        <Link to={`/admin/edit/${pyq.id}`}
                          id={`edit-pyq-${pyq.id}`}
                          className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(pyq.id)}
                          id={`delete-pyq-${pyq.id}`}
                          className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
