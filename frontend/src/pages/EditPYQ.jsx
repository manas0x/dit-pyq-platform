import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api'
import Loading from '../components/Loading'

export default function EditPYQ() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState({ subject_id: '', semester: '', year: '', title: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/subjects'),
      api.get(`/pyqs/${id}`)
    ]).then(([subjRes, pyqRes]) => {
      setSubjects(subjRes.data)
      const p = pyqRes.data
      setForm({ subject_id: p.subject_id, semester: p.semester, year: p.year, title: p.title })
    }).catch(() => setError('Failed to load PYQ'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.put(`/pyqs/${id}`, {
        subject_id: Number(form.subject_id),
        semester: Number(form.semester),
        year: Number(form.year),
        title: form.title
      })
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update PYQ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/admin" className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline mb-8">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Edit PYQ</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input
              id="edit-title"
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
            <select
              id="edit-subject"
              required
              value={form.subject_id}
              onChange={e => setForm({ ...form, subject_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            >
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semester</label>
              <select
                id="edit-semester"
                required
                value={form.semester}
                onChange={e => setForm({ ...form, semester: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
              <input
                id="edit-year"
                type="number"
                required
                min="2000"
                max="2099"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 px-4 py-3 rounded-xl">
            ℹ️ To replace the PDF, delete this PYQ and re-upload it.
          </p>

          <button
            id="edit-submit-btn"
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
