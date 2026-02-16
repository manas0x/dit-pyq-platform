import { Link } from 'react-router-dom'

const semesterColors = {
  1: 'bg-blue-50 text-blue-700',
  2: 'bg-purple-50 text-purple-700',
  3: 'bg-green-50 text-green-700',
  4: 'bg-yellow-50 text-yellow-700',
  5: 'bg-orange-50 text-orange-700',
  6: 'bg-red-50 text-red-700',
  7: 'bg-pink-50 text-pink-700',
  8: 'bg-indigo-50 text-indigo-700',
}

export default function PYQCard({ pyq }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${semesterColors[pyq.semester] || 'bg-gray-100 text-gray-600'}`}>
            Sem {pyq.semester}
          </span>
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{pyq.year}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2">{pyq.title}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-4">{pyq.subject_name}</p>

        <Link
          to={`/pyqs/${pyq.id}`}
          id={`view-pyq-${pyq.id}`}
          className="mt-auto flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Paper
        </Link>
      </div>
    </div>
  )
}
