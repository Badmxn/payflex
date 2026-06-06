import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaymentForm from './components/PaymentForm'

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
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
        <Route path="/"        element={<Dashboard />} />
        <Route path="/send"    element={<SendMoney />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}
