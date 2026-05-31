import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { getUser, studentApi } from '../utils/api'

const courses = [
  { name: 'React Complete Course', price: 4999, duration: '10 Weeks' },
  { name: 'JavaScript Deep Dive', price: 3999, duration: '8 Weeks' },
  { name: 'Full Stack Web Development', price: 9999, duration: '20 Weeks' },
  { name: 'REST API Development', price: 2999, duration: '4 Weeks' },
  { name: 'Java with Spring Boot', price: 6999, duration: '12 Weeks' },
  { name: 'Git and GitHub', price: 1499, duration: '2 Weeks' },
  { name: 'Python for Data Science', price: 7999, duration: '14 Weeks' },
  { name: 'DSA & System Design', price: 8999, duration: '16 Weeks' },
  { name: 'DevOps & Cloud Fundamentals', price: 7999, duration: '12 Weeks' },
]

const sidebarItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'enroll', label: 'Enroll Course', icon: '📚' },
  { key: 'payments', label: 'My Payments', icon: '💳' },
  { key: 'certificates', label: 'My Certificates', icon: '🎓' },
]

export default function StudentDashboard() {
  const user = getUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [certificateRequests, setCertificateRequests] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentName: user.name || '',
    studentEmail: user.email || '',
    phone: '',
    courseName: '',
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    paymentScreenshotUrl: '',
    message: '',
  })

  const [certificateForm, setCertificateForm] = useState({
    studentName: user.name || '',
    studentEmail: user.email || '',
    courseName: '',
    instructorName: 'Satya Prakash',
    duration: '',
    issueDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  })

  const approvedEnrollments = enrollments.filter(
    (enrollment) => enrollment.paymentStatus === 'PAYMENT_APPROVED',
  )

  const pendingPayments = enrollments.filter(
    (enrollment) => enrollment.paymentStatus === 'PAYMENT_PENDING',
  )

  const approvedCertificates = certificateRequests.filter(
    (request) => request.status === 'APPROVED',
  )

  const selectedCourse = useMemo(
    () => courses.find((course) => course.name === enrollmentForm.courseName),
    [enrollmentForm.courseName],
  )

  function updateEnrollment(key, value) {
    setEnrollmentForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function updateCertificate(key, value) {
    setCertificateForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleCourseChange(courseName) {
    const course = courses.find((item) => item.name === courseName)

    setEnrollmentForm((current) => ({
      ...current,
      courseName,
      amount: course ? course.price : '',
    }))
  }


  function handleScreenshotUpload(file) {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      updateEnrollment('paymentScreenshotUrl', reader.result)
    }

    reader.readAsDataURL(file)
  }

  async function loadData() {
    const [myCertificates, myEnrollments] = await Promise.all([
      studentApi.myCertificates(),
      studentApi.myEnrollments(),
    ])

    setCertificateRequests(myCertificates)
    setEnrollments(myEnrollments)
  }

  async function submitEnrollment(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await studentApi.enroll({
        ...enrollmentForm,
        amount: Number(enrollmentForm.amount),
      })

      toast.success('Enrollment and payment proof submitted for admin verification')

      setEnrollmentForm((current) => ({
        ...current,
        phone: '',
        courseName: '',
        amount: '',
        transactionId: '',
        paymentScreenshotUrl: '',
        message: '',
      }))

      setActiveTab('payments')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function submitCertificateRequest(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await studentApi.requestCertificate(certificateForm)
      toast.success('Certificate request submitted. Please wait for admin approval.')
      setActiveTab('certificates')
      await loadData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData().catch((error) => toast.error(error.message))
  }, [])

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container-pro py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="card-pro h-fit p-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4">
              <p className="text-xs uppercase tracking-[3px] text-gold-400">
                Student Panel
              </p>
              <h1 className="mt-2 font-cinzel text-xl font-extrabold text-[#fefce8]">
                {user.name || 'Student'}
              </h1>
              <p className="mt-1 text-xs text-slate-400">{user.email}</p>
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
                user={user}
                enrollments={enrollments}
                pendingPayments={pendingPayments}
                approvedCertificates={approvedCertificates}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'enroll' && (
              <EnrollCourse
                loading={loading}
                courses={courses}
                form={enrollmentForm}
                selectedCourse={selectedCourse}
                onChange={updateEnrollment}
                onCourseChange={handleCourseChange}
                onScreenshotUpload={handleScreenshotUpload}
                onSubmit={submitEnrollment}
              />
            )}

            {activeTab === 'payments' && <Payments enrollments={enrollments} />}

            {activeTab === 'certificates' && (
              <Certificates
                loading={loading}
                approvedEnrollments={approvedEnrollments}
                requests={certificateRequests}
                form={certificateForm}
                onChange={updateCertificate}
                onSubmit={submitCertificateRequest}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function Overview({ user, enrollments, pendingPayments, approvedCertificates, onNavigate }) {
  return (
    <div className="space-y-6">
      <section className="card-pro overflow-hidden p-8">
        <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
          Welcome Back
        </p>
        <h2 className="mt-3 font-cinzel text-3xl font-extrabold text-[#fefce8] md:text-4xl">
          Continue your learning journey, {user.name || 'Student'} 👋
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Enroll in a course, submit payment proof, track payment verification, and request certificates after course completion.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('enroll')} className="btn-primary">
            Enroll in Course
          </button>
          <button onClick={() => onNavigate('certificates')} className="btn-secondary">
            View Certificates
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon="📚" label="Total Enrollments" value={enrollments.length} />
        <StatCard icon="💳" label="Pending Payments" value={pendingPayments.length} />
        <StatCard icon="🎓" label="Certificates" value={approvedCertificates.length} />
      </div>
    </div>
  )
}

function EnrollCourse({ loading, courses, form, selectedCourse, onChange, onCourseChange, onScreenshotUpload, onSubmit }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
          Course Enrollment
        </p>
        <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
          Enroll and Submit Payment Proof
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Pay using UPI, QR, or bank transfer. Enter transaction ID and screenshot/link. Admin will verify and approve your enrollment.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Student Name" value={form.studentName} onChange={(value) => onChange('studentName', value)} />
            <Input label="Student Email" type="email" value={form.studentEmail} onChange={(value) => onChange('studentEmail', value)} />
          </div>

          <Input label="Phone Number" value={form.phone} onChange={(value) => onChange('phone', value)} />

          <CourseSelect
            courses={courses}
            label="Select Course"
            value={form.courseName}
            onChange={onCourseChange}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Course Amount" type="number" value={form.amount} onChange={(value) => onChange('amount', value)} />
            <Select
              label="Payment Method"
              value={form.paymentMethod}
              onChange={(value) => onChange('paymentMethod', value)}
              options={['UPI', 'QR Payment', 'Bank Transfer']}
            />
          </div>

          <Input
            label="Transaction ID / UTR Number"
            value={form.transactionId}
            onChange={(value) => onChange('transactionId', value)}
            placeholder="Example: 412345678901"
          />

          <div>
            <label className="label-pro">Upload Payment Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onScreenshotUpload(event.target.files?.[0])}
              className="input-pro"
              required={!form.paymentScreenshotUrl}
            />
            {form.paymentScreenshotUrl && (
              <p className="mt-2 text-xs font-bold text-green-300">
                Screenshot selected successfully
              </p>
            )}
          </div>

          <div>
            <label className="label-pro">Message</label>
            <textarea
              value={form.message}
              onChange={(event) => onChange('message', event.target.value)}
              className="input-pro min-h-24"
              placeholder="Tell us your goal or preferred batch timing"
            />
          </div>

          <button disabled={loading} className="btn-primary w-full">
            Submit Enrollment for Verification
          </button>
        </form>

        <PaymentCard selectedCourse={selectedCourse} />
      </div>
    </section>
  )
}

function PaymentCard({ selectedCourse }) {
  return (
    <aside className="rounded-3xl border border-gold-500/20 bg-gold-500/[0.06] p-6">
      <p className="text-xs font-bold uppercase tracking-[3px] text-gold-400">
        Manual Payment
      </p>
      <h3 className="mt-2 font-cinzel text-2xl font-bold text-[#fefce8]">
        Pay Course Fee
      </h3>

      <div className="mt-5 rounded-2xl bg-white p-4 text-center text-slate-950">
  <img
    src="/payment/MyQR.jpeg"
    alt="UPI QR"
    className="mx-auto h-44 w-44 rounded-xl object-contain"
  />

  <p className="mt-3 text-sm font-extrabold">
    electricalstudyworld@upi
  </p>

  <p className="text-xs text-slate-500">
    Scan QR and pay course fee
  </p>
</div>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <p className="flex justify-between gap-4">
          <span>Selected Course</span>
          <span className="text-right font-bold text-white">{selectedCourse?.name || 'Not selected'}</span>
        </p>
        <p className="flex justify-between gap-4">
          <span>Amount</span>
          <span className="font-bold text-gold-400">₹{selectedCourse?.price || 0}</span>
        </p>
        <p className="flex justify-between gap-4">
          <span>Duration</span>
          <span>{selectedCourse?.duration || '-'}</span>
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-400">
        After payment, enter transaction ID and upload payment screenshot. Admin will verify your payment from the dashboard.
      </div>
    </aside>
  )
}

function Payments({ enrollments }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
        Payment Status
      </p>
      <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
        My Payments & Enrollments
      </h2>

      <div className="mt-6 grid gap-4">
        {enrollments.length === 0 && (
          <EmptyState text="No enrollment submitted yet." />
        )}

        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">{enrollment.courseName}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Transaction ID: {enrollment.transactionId || '-'}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Amount: ₹{enrollment.amount || 0} · {enrollment.paymentMethod || '-'}
                </p>
              </div>
              <PaymentBadge status={enrollment.paymentStatus} />
            </div>

            {enrollment.adminRemark && (
              <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">
                Admin remark: {enrollment.adminRemark}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function Certificates({ loading, approvedEnrollments, requests, form, onChange, onSubmit }) {
  return (
    <div className="space-y-6">
      <section className="card-pro p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
          Certificate Request
        </p>
        <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
          Request Certificate After Completion
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Request certificates only for approved/enrolled courses after completing your training.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Student Name" value={form.studentName} onChange={(value) => onChange('studentName', value)} />
          <Input label="Student Email" type="email" value={form.studentEmail} onChange={(value) => onChange('studentEmail', value)} />

          <ApprovedCourseSelect
            label="Completed Course"
            value={form.courseName}
            enrollments={approvedEnrollments}
            onChange={(value) => onChange('courseName', value)}
          />

          <Input label="Instructor Name" value={form.instructorName} onChange={(value) => onChange('instructorName', value)} />
          <Input label="Duration" value={form.duration} onChange={(value) => onChange('duration', value)} placeholder="12 Weeks / 80 Hours" />
          <Input label="Issue Date" value={form.issueDate} onChange={(value) => onChange('issueDate', value)} />

          <button disabled={loading} className="btn-primary md:col-span-2">
            Request Certificate
          </button>
        </form>
      </section>

      <section className="card-pro p-6 md:p-8">
        <h2 className="font-cinzel text-2xl font-bold text-[#fefce8]">
          My Certificate Requests
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="table-pro">
            <thead>
              <tr>
                <th>Course</th>
                <th>Status</th>
                <th>Serial No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.courseName}</td>
                  <td><StatusBadge status={request.status} /></td>
                  <td>{request.serialNo || '-'}</td>
                  <td>
                    {request.status === 'APPROVED' ? (
                      <a href={`/certificate/${request.serialNo}`} className="font-bold text-gold-400">
                        Open Certificate
                      </a>
                    ) : (
                      <span className="text-slate-500">Waiting for admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="label-pro">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-pro"
        placeholder={placeholder || label}
        required
      />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="label-pro">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-pro" required>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

function CourseSelect({ courses, label, value, onChange }) {
  return (
    <div>
      <label className="label-pro">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-pro" required>
        <option value="">Select course</option>
        {courses.map((course) => (
          <option key={course.name} value={course.name}>
            {course.name} — ₹{course.price}
          </option>
        ))}
      </select>
    </div>
  )
}

function ApprovedCourseSelect({ label, value, enrollments, onChange }) {
  return (
    <div>
      <label className="label-pro">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-pro" required>
        <option value="">Select approved course</option>
        {enrollments.map((enrollment) => (
          <option key={enrollment.id} value={enrollment.courseName}>
            {enrollment.courseName}
          </option>
        ))}
      </select>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card-pro p-5">
      <p className="text-3xl">{icon}</p>
      <p className="mt-3 text-3xl font-extrabold text-gold-400">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">{label}</p>
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
    PAYMENT_PENDING: 'Payment Pending',
    PAYMENT_APPROVED: 'Payment Approved',
    PAYMENT_REJECTED: 'Payment Rejected',
  }[status] || status

  const style = {
    PAYMENT_APPROVED: 'bg-green-500/15 text-green-300 border-green-500/30',
    PAYMENT_REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
    PAYMENT_PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  }[status] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'

  return <span className={`rounded-full border px-4 py-2 text-xs font-extrabold ${style}`}>{label}</span>
}

function EmptyState({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-slate-500">
      {text}
    </div>
  )
}
