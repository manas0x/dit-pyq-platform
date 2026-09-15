export default function Filter({ subjects, filters, onChange }) {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="flex flex-wrap gap-3">
      <select
        id="filter-subject"
        value={filters.subject}
        onChange={e => onChange({ ...filters, subject: e.target.value })}
        className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
      >
        <option value="">All Subjects</option>
        {subjects.map(s => (
          <option key={s.id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <select
        id="filter-semester"
        value={filters.semester}
        onChange={e => onChange({ ...filters, semester: e.target.value })}
        className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
      >
        <option value="">All Semesters</option>
        {semesters.map(s => (
          <option key={s} value={s}>Semester {s}</option>
        ))}
      </select>

      <select
        id="filter-year"
        value={filters.year}
        onChange={e => onChange({ ...filters, year: e.target.value })}
        className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
      >
        <option value="">All Years</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}
