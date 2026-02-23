import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PYQList from './pages/PYQList'
import PYQDetail from './pages/PYQDetail'
import AdminDashboard from './pages/AdminDashboard'
import AddPYQ from './pages/AddPYQ'
import EditPYQ from './pages/EditPYQ'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pyqs" element={<PYQList />} />
        <Route path="/pyqs/:id" element={<PYQDetail />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/add" element={<AdminRoute><AddPYQ /></AdminRoute>} />
        <Route path="/admin/edit/:id" element={<AdminRoute><EditPYQ /></AdminRoute>} />
      </Routes>
    </div>
  )
}
