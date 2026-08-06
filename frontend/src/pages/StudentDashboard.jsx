import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRazorpay } from 'react-razorpay'

import Navbar from '../components/Navbar'
import { getUser, studentApi, paymentApi, courseApi } from '../utils/api'

const sidebarItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'enroll', label: 'Enroll Course', icon: '📚' },
  { key: 'payments', label: 'My Payments', icon: '💳' },
  { key: 'certificates', label: 'My Certificates', icon: '🎓' },
]

export default function StudentDashboard() {
  const user = getUser() || {}
  const { Razorpay } = useRazorpay()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  
  const [courses, setCourses] = useState([])
  const [certificateRequests, setCertificateRequests] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentName: user.name || '',
    studentEmail: user.email || '',
    phone: '',
    courseId: '',
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
    () => courses.find((course) => String(course.id) === String(enrollmentForm.courseId)),
    [courses, enrollmentForm.courseId],
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

  async function loadData() {
    const [myCertificates, myEnrollments, allCourses] = await Promise.all([
      studentApi.myCertificates(),
      studentApi.myEnrollments(),
      courseApi.getAll(),
    ])

    setCertificateRequests(myCertificates)
    setEnrollments(myEnrollments)
    setCourses(allCourses)
  }

  async function submitEnrollment(event) {
    event.preventDefault()
    
    if (!enrollmentForm.courseId) {
      toast.error('Please select a course')
      return
    }

    setLoading(true)
    try {
      // 1. Create order
      const orderData = await paymentApi.createOrder({
        courseId: enrollmentForm.courseId,
        studentName: enrollmentForm.studentName,
        studentEmail: enrollmentForm.studentEmail,
        phone: enrollmentForm.phone,
        message: enrollmentForm.message,
      })

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: 'Satya Tech Academy',
        description: orderData.courseName,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment
            await paymentApi.verify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              courseId: enrollmentForm.courseId,
              studentName: enrollmentForm.studentName,
              studentEmail: enrollmentForm.studentEmail,
              phone: enrollmentForm.phone,
              message: enrollmentForm.message,
            })
            
            toast.success('Payment successful and enrollment approved!')
            setEnrollmentForm((current) => ({
              ...current,
              phone: '',
              courseId: '',
              message: '',
            }))
            setActiveTab('payments')
            await loadData()
          } catch (err) {
            toast.error('Payment verification failed. Please contact admin.')
          }
        },
        prefill: {
          name: enrollmentForm.studentName,
          email: enrollmentForm.studentEmail,
          contact: enrollmentForm.phone,
        },
        theme: {
          color: '#d4af37', // Gold 400
        },
      }

      const rzp = new Razorpay(options)
      
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`)
      })
      
      rzp.open()
      
    } catch (error) {
      toast.error(error.message || 'Failed to initialize payment')
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

            <nav className="mt-4 flex overflow-x-auto gap-2 pb-2 lg:flex-col lg:overflow-visible lg:pb-0 hide-scrollbar">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-bold transition lg:w-full ${activeTab === item.key
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
          Enroll in a course securely via Razorpay, track your payments, and request certificates after course completion.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
          <button onClick={() => onNavigate('enroll')} className="btn-primary w-full sm:w-auto">
            Enroll in Course
          </button>
          <button onClick={() => onNavigate('certificates')} className="btn-secondary w-full sm:w-auto text-center">
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

function EnrollCourse({ loading, courses, form, selectedCourse, onChange, onSubmit }) {
  return (
    <section className="card-pro p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
          Course Enrollment
        </p>
        <h2 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
          Enroll Securely
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Select a course and checkout securely via Razorpay. Your enrollment will be approved automatically upon successful payment.
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
            value={form.courseId}
            onChange={(value) => onChange('courseId', value)}
          />

          <div>
            <label className="label-pro">Message (Optional)</label>
            <textarea
              value={form.message}
              onChange={(event) => onChange('message', event.target.value)}
              className="input-pro min-h-24"
              placeholder="Tell us your goal or preferred batch timing"
            />
          </div>

          <button disabled={loading || courses.length === 0} className="btn-primary w-full">
            Proceed to Payment
          </button>
        </form>

        <CourseSummaryCard selectedCourse={selectedCourse} />
      </div>
    </section>
  )
}

function CourseSummaryCard({ selectedCourse }) {
  return (
    <aside className="rounded-3xl border border-gold-500/20 bg-gold-500/[0.06] p-6 h-fit sticky top-24">
      <p className="text-xs font-bold uppercase tracking-[3px] text-gold-400">
        Order Summary
      </p>
      <h3 className="mt-2 font-cinzel text-2xl font-bold text-[#fefce8]">
        {selectedCourse ? selectedCourse.name : 'Select a course'}
      </h3>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
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
        Payments are processed securely via Razorpay. Your enrollment is automatically approved upon successful transaction.
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

function CourseSelect({ courses, label, value, onChange }) {
  return (
    <div>
      <label className="label-pro">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-pro" required>
        <option value="">Select course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
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
