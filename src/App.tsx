import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isLoggedIn } from './utils/auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PaymentForm from './components/PaymentForm'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" />
}

function SendMoney() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Send Money</h1>
      <PaymentForm />
    </div>
  )
}

function History() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">History</h1>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/send" element={<PrivateRoute><SendMoney /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
