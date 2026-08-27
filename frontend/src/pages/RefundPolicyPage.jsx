import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RefundPolicyPage() {
  useEffect(() => {
    document.title = "Refund & Cancellation Policy - Satya Tech Academy"
  }, [])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container-pro py-20 max-w-4xl mx-auto">
        <h1 className="font-cinzel text-4xl font-extrabold text-white mb-4">Refund & Cancellation Policy</h1>
        <p className="text-slate-400 mb-10 text-sm">Last Updated: August 2026</p>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">1. Nature of Services</h2>
            <p>
              Satya Tech Academy provides digital educational courses and software training. Due to the digital nature of our products and the immediate access granted upon successful payment, we have specific guidelines regarding refunds and cancellations.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">2. Refund Eligibility</h2>
            <p>
              Generally, <strong>all sales are final</strong>. Because you get instant access to our course material and source code, we do not offer refunds once a purchase is completed. Please review the course curriculum, prerequisites, and syllabus carefully before enrolling.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">3. Exceptions & Duplicate Payments</h2>
            <p>
              Refunds will ONLY be considered under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Duplicate Payments:</strong> If you were accidentally charged twice for the same course due to a technical glitch, we will refund the duplicate amount.</li>
              <li><strong>Course Unavailability:</strong> If a course you purchased becomes permanently unavailable or is cancelled by us before you could access it.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">4. Cancellation Policy</h2>
            <p>
              You may cancel your account at any time by contacting support. However, cancellation of your account does not entitle you to a refund for past purchases. Once a course is purchased, your enrollment cannot be cancelled or transferred to another student.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">5. Processing Timeline</h2>
            <p>
              If a refund for a duplicate payment is approved, it will be processed and credited back to your original method of payment within <strong>5-7 business days</strong>, depending on your bank or payment provider (Razorpay).
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">6. Contact for Issues</h2>
            <p>
              If you experience a payment failure where the amount was deducted but the course was not assigned, or if you wish to report a duplicate payment, please email us immediately at: <a href="mailto:electricalstudyworld@gmail.com" className="text-gold-400 hover:underline">electricalstudyworld@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
