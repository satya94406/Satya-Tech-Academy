import { useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { publicApi } from '../utils/api'

export default function VerifyPage() {
  const [serialNo, setSerialNo] = useState('')
  const [result, setResult] = useState(null)

  async function verifyCertificate(event) {
    event.preventDefault()

    try {
      const response = await publicApi.verify(serialNo.trim())
      setResult(response)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="card-pro w-full max-w-2xl p-7">
          <p className="text-center text-xs font-bold uppercase tracking-[4px] text-gold-400">
            Certificate Verification
          </p>

          <h1 className="mt-3 text-center font-cinzel text-3xl font-extrabold text-[#fefce8]">
            Verify Authenticity
          </h1>

          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-400">
            Enter serial number to verify whether the certificate is approved and valid.
          </p>

          <form onSubmit={verifyCertificate} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={serialNo}
              onChange={(event) => setSerialNo(event.target.value)}
              className="input-pro flex-1"
              placeholder="STA-2026-000001"
              required
            />
            <button className="btn-primary">Verify</button>
          </form>

          {result && (
            <div className="mt-7 rounded-3xl border border-white/10 bg-black/20 p-6">
              {result.valid === false ? (
                <div>
                  <p className="text-lg font-extrabold text-red-400">Invalid Certificate</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Certificate not found or not approved by admin.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-extrabold text-green-400">✓ Valid Certificate</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                    <p>Student: {result.studentName}</p>
                    <p>Course: {result.courseName}</p>
                    <p>Serial: {result.serialNo}</p>
                    <p>Status: {result.status}</p>
                  </div>

                  <a href={`/certificate/${result.serialNo}`} className="mt-5 inline-block font-bold text-gold-400">
                    Open certificate →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
