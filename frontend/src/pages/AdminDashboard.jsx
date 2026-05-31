import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { adminApi } from '../utils/api'

const sidebarItems = [
  { key: 'overview', label: 'Dashboard', icon: '📊' },
  { key: 'payments', label: 'Payment Requests', icon: '💳' },
  { key: 'certificates', label: 'Certificate Requests', icon: '🎓' },
  { key: 'students', label: 'Students', icon: '👥' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [status, setStatus] = useState('PENDING')
  const [certificates, setCertificates] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)

  const pendingPayments = enrollments.filter(
    (enrollment) => enrollment.paymentStatus === 'PAYMENT_PENDING',
  )

  const approvedPayments = enrollments.filter(
    (enrollment) => enrollment.paymentStatus === 'PAYMENT_APPROVED',
  )

  const pendingCertificates = certificates.filter(
    (certificate) => certificate.status === 'PENDING',
  )

  async function loadData() {
    const [certificateData, enrollmentData] = await Promise.all([
      adminApi.certificates(status),
      adminApi.enrollments(),
    ])

    setCertificates(certificateData)
    setEnrollments(enrollmentData)
  }

  async function approvePayment(id) {
    setLoading(true)

    try {
      await adminApi.approvePayment(id)
      toast.success('Payment approved. Student email sent.')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function rejectPayment(id) {
    const remark = window.prompt('Reject payment reason?') || 'Payment proof not valid'
    setLoading(true)

    try {
      await adminApi.rejectPayment(id, remark)
      toast.success('Payment rejected. Student email sent.')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function approveCertificate(id) {
    setLoading(true)

    try {
      await adminApi.approve(id)
      toast.success('Certificate approved. Student email sent.')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function rejectCertificate(id) {
    const remark = window.prompt('Reject reason?') || 'Not approved by admin'
    setLoading(true)

    try {
      await adminApi.reject(id, remark)
      toast.success('Certificate rejected. Student notified.')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData().catch((error) => toast.error(error.message))
  }, [status])

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container-pro py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="card-pro h-fit p-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4">
              <p className="text-xs uppercase tracking-[3px] text-gold-400">
                Admin Panel
              </p>
              <h1 className="mt-2 font-cinzel text-xl font-extrabold text-[#fefce8]">
                Satya Tech Academy
              </h1>
              <p className="mt-1 text-xs text-slate-400">Manage students, payments and certificates</p>
            </div>

            <nav className="mt-4 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    activeTab === item.key
                      ? 'bg-gold-500 text-[#1a0a00]'
                      : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <section>
            {activeTab === 'overview' && (
              <Overview
                pendingPayments={pendingPayments}
                approvedPayments={approvedPayments}
                pendingCertificates={pendingCertificates}
                enrollments={enrollments}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentRequests
                loading={loading}
                enrollments={enrollments}
                onApprove={approvePayment}
                onReject={rejectPayment}
              />
            )}

            {activeTab === 'certificates' && (
              <CertificateRequests
                loading={loading}
                status={status}
                certificates={certificates}
                onStatusChange={setStatus}
                onApprove={approveCertificate}
                onReject={rejectCertificate}
              />
            )}

            {activeTab === 'students' && <StudentRecords enrollments={enrollments} />}
          </section>
        </div>
      </main>
    </div>
  )
}

function Overview({ pendingPayments, approvedPayments, pendingCertificates, enrollments, onNavigate }) {
  return (
    <div className="space-y-6">
      <section className="card-pro p-8">
        <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
          Admin Dashboard
        </p>
        <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8] md:text-4xl">
          Manage academy operations professionally
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Verify manual payments, approve enrollments, manage certificate requests, and track student records from one clean dashboard.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('payments')} className="btn-primary">
            Check Payments
          </button>
          <button onClick={() => onNavigate('certificates')} className="btn-secondary">
            Certificate Requests
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <MiniStat label="Total Enrollments" value={enrollments.length} />
        <MiniStat label="Pending Payments" value={pendingPayments.length} />
        <MiniStat label="Approved Payments" value={approvedPayments.length} />
        <MiniStat label="Pending Certificates" value={pendingCertificates.length} />
      </div>
    </div>
  )
}

function PaymentRequests({ loading, enrollments, onApprove, onReject }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
        Payment Verification
      </p>
      <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
        Manual Payment Requests
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Check transaction ID and screenshot link, then approve or reject the enrollment payment.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="table-pro">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>
                  <p className="font-bold text-white">{enrollment.studentName}</p>
                  <p className="text-xs text-slate-500">{enrollment.studentEmail}</p>
                </td>
                <td>{enrollment.courseName}</td>
                <td>₹{enrollment.amount || 0}</td>
                <td>
                  <p>{enrollment.paymentMethod}</p>
                  <p className="text-xs text-slate-500">{enrollment.transactionId || '-'}</p>
                </td>
                <td><PaymentBadge status={enrollment.paymentStatus} /></td>
                <td>
                  {enrollment.paymentScreenshotUrl ? (
                    <a href={enrollment.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="font-bold text-gold-400">
                      Open Proof
                    </a>
                  ) : '-'}
                </td>
                <td>
                  {enrollment.paymentStatus === 'PAYMENT_PENDING' ? (
                    <div className="flex flex-wrap gap-2">
                      <button disabled={loading} onClick={() => onApprove(enrollment.id)} className="rounded-lg bg-green-500 px-3 py-2 text-xs font-extrabold text-green-950">
                        Approve
                      </button>
                      <button disabled={loading} onClick={() => onReject(enrollment.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-extrabold text-white">
                        Reject
                      </button>
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CertificateRequests({ loading, status, certificates, onStatusChange, onApprove, onReject }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
            Certificates
          </p>
          <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
            Certificate Requests
          </h2>
        </div>

        <select value={status} onChange={(event) => onStatusChange(event.target.value)} className="input-pro max-w-xs">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-pro">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Status</th>
              <th>Serial</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.id}</td>
                <td>
                  <p className="font-bold text-white">{certificate.studentName}</p>
                  <p className="text-xs text-slate-500">{certificate.studentEmail}</p>
                </td>
                <td>{certificate.courseName}</td>
                <td><StatusBadge status={certificate.status} /></td>
                <td>{certificate.serialNo || '-'}</td>
                <td>
                  {certificate.status === 'PENDING' ? (
                    <div className="flex flex-wrap gap-2">
                      <button disabled={loading} onClick={() => onApprove(certificate.id)} className="rounded-lg bg-green-500 px-3 py-2 text-xs font-extrabold text-green-950">
                        Approve
                      </button>
                      <button disabled={loading} onClick={() => onReject(certificate.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-extrabold text-white">
                        Reject
                      </button>
                    </div>
                  ) : certificate.serialNo ? (
                    <a href={`/certificate/${certificate.serialNo}`} className="font-bold text-gold-400">Open</a>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StudentRecords({ enrollments }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
        Student Records
      </p>
      <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
        Course Enrollments
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="table-pro">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.studentName}</td>
                <td>{enrollment.studentEmail}</td>
                <td>{enrollment.phone}</td>
                <td>{enrollment.courseName}</td>
                <td>{enrollment.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-3xl font-extrabold text-gold-400">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const style = {
    APPROVED: 'bg-green-500/15 text-green-300 border-green-500/30',
    REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
    PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  }[status] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style}`}>{status}</span>
}

function PaymentBadge({ status }) {
  const label = {
    PAYMENT_PENDING: 'Pending',
    PAYMENT_APPROVED: 'Approved',
    PAYMENT_REJECTED: 'Rejected',
  }[status] || status

  const style = {
    PAYMENT_APPROVED: 'bg-green-500/15 text-green-300 border-green-500/30',
    PAYMENT_REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
    PAYMENT_PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  }[status] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style}`}>{label}</span>
}
