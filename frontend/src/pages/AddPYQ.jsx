import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function AddPYQ() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState({ subject_id: '', semester: '', year: '', title: '' })
  const [pdf, setPdf] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/subjects').then(res => setSubjects(res.data))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!pdf) { setError('Please select a PDF file'); return }
    setError('')
    setLoading(true)

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    data.append('pdf', pdf)

    try {
      await api.post('/pyqs', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload PYQ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/admin" className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline mb-8">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Add New PYQ</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input
              id="add-title"
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              placeholder="e.g. DBMS End Semester 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
            <select
              id="add-subject"
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
                id="add-semester"
                required
                value={form.semester}
                onChange={e => setForm({ ...form, semester: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              >
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
              <input
                id="add-year"
                type="number"
                required
                min="2000"
                max="2099"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder="2024"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">PDF File</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                id="add-pdf"
                type="file"
                accept="application/pdf"
                onChange={e => setPdf(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="add-pdf" className="cursor-pointer">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm text-gray-500 mb-1">
                  {pdf ? <span className="text-indigo-600 font-semibold">{pdf.name}</span> : 'Click to select PDF'}
                </p>
                <p className="text-xs text-gray-400">Only PDF files accepted</p>
              </label>
            </div>
          </div>

          <button
            id="add-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading to Cloudinary...' : 'Upload PYQ'}
          </button>
        </form>
      </div>
    </div>
  )
}
