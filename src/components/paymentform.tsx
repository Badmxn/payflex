import { useState } from 'react'
import type { PaymentFormData } from '../types'

type FormErrors = Partial<Record<keyof PaymentFormData, string>>

const calcFee = (amount: number) => Math.round(amount * 0.015)

export default function PaymentForm() {
  const [form, setForm] = useState<PaymentFormData>({
    recipient: '',
    email: '',
    amount: 0,
    type: 'transfer'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.recipient) e.recipient = 'Name is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (form.amount < 100) e.amount = 'Minimum ₦100'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) setSubmitted(true)
  }

  if (submitted) return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-800">
      ✅ ₦{form.amount.toLocaleString()} sent to {form.recipient}!
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

      <div>
        <label className="block text-sm text-gray-600 mb-1">Recipient name</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Ada Okafor"
          value={form.recipient}
          onChange={e => setForm({ ...form, recipient: e.target.value })}
        />
        {errors.recipient && <p className="text-red-500 text-xs mt-1">{errors.recipient}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Recipient email</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ada@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Amount (₦)</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          value={form.amount || ''}
          onChange={e => setForm({ ...form, amount: +e.target.value })}
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        {form.amount >= 100 && (
          <p className="text-gray-400 text-xs mt-1">
            Fee: ₦{calcFee(form.amount).toLocaleString()} · 
            Total: ₦{(form.amount + calcFee(form.amount)).toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Payment type</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value as PaymentFormData['type'] })}
        >
          <option value="transfer">Bank transfer</option>
          <option value="wallet">Wallet top-up</option>
          <option value="invoice">Invoice payment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Note <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's this for?"
          value={form.note || ''}
          onChange={e => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Send Payment
      </button>

    </form>
  )
}