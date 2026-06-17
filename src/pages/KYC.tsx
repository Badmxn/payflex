import { useEffect, useState } from 'react'
import { submitKYC, getKYCStatus, verifyKYC } from '../utils/kyc'

export default function KYC() {
  const [form, setForm] = useState({
    dateOfBirth: '',
    address: '',
    idType: 'bvn',
    idNumber: ''
  })
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getKYCStatus()
        setStatus(data)
      } catch (err) {
        console.error(err)
      } finally {
        setChecking(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await submitKYC(form)
      // Auto-trigger verification (test mode)
      const result = await verifyKYC()
      setStatus({ ...status, kycStatus: result.kycStatus })
    } catch (err: any) {
      setError(err.response?.data?.message || 'KYC submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <div className="p-8 text-gray-500">Checking KYC status...</div>
  }

  if (status?.kycStatus === 'verified') {
    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-lg font-bold text-green-800 mb-1">Identity Verified</h2>
          <p className="text-sm text-green-700">
            Your account is fully verified. You can now send and receive payments without limits.
          </p>
          <p className="text-xs text-green-600 mt-3">
            Verified on {new Date(status.kycVerifiedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  }

  if (status?.kycStatus === 'pending') {
    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h2 className="text-lg font-bold text-amber-800 mb-1">Verification in Progress</h2>
          <p className="text-sm text-amber-700">
            We're reviewing your submitted documents. This usually takes a few minutes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Identity Verification</h1>
      <p className="text-gray-500 text-sm mb-6">
        Verify your identity to unlock higher transaction limits and seller features.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date of birth</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={form.dateOfBirth}
            onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Residential address</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12 Allen Avenue, Ikeja, Lagos"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">ID type</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={form.idType}
            onChange={e => setForm({ ...form, idType: e.target.value })}
          >
            <option value="bvn">BVN (Bank Verification Number)</option>
            <option value="nin">NIN (National ID Number)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {form.idType === 'bvn' ? 'BVN' : 'NIN'} number
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="11 digit number"
            value={form.idNumber}
            onChange={e => setForm({ ...form, idNumber: e.target.value })}
            maxLength={11}
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Your {form.idType.toUpperCase()} is encrypted and never shared
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  )
}
