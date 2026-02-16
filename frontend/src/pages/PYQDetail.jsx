import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import Loading from '../components/Loading'

export default function PYQDetail() {
  const { id } = useParams()
  const [pyq, setPyq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/pyqs/${id}`)
      .then(res => setPyq(res.data))
      .catch(() => setError('Paper not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Paper not found</h1>
        <Link to="/pyqs" className="text-indigo-600 font-semibold hover:underline">← Back to Papers</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/pyqs" className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline mb-8">
        ← Back to Papers
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              Semester {pyq.semester}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              {pyq.year}
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
              {pyq.subject_name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{pyq.title}</h1>
          <p className="text-sm text-gray-400 mb-8">
            Uploaded {new Date(pyq.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={pyq.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              id="view-pdf-btn"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors text-base shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View PDF
            </a>
            <a
              href={pyq.pdf_url}
              download
              id="download-pdf-btn"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-colors text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
