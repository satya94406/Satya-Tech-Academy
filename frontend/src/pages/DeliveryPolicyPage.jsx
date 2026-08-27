import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function DeliveryPolicyPage() {
  useEffect(() => {
    document.title = "Delivery Policy - Satya Tech Academy"
  }, [])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container-pro py-20 max-w-4xl mx-auto">
        <h1 className="font-cinzel text-4xl font-extrabold text-white mb-4">Delivery Policy</h1>
        <p className="text-slate-400 mb-10 text-sm">Last Updated: August 2026</p>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">1. Digital Products Only</h2>
            <p>
              Satya Tech Academy operates exclusively as an online educational platform. We provide digital courses, software training materials, and e-certificates. <strong>We do not ship any physical goods or products.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">2. Instant Course Access</h2>
            <p>
              Upon successful completion of your payment via our secure payment gateway (Razorpay), your purchased course will be instantly unlocked. You can access all your enrolled courses directly from your Student Dashboard.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">3. Confirmation of Delivery</h2>
            <p>
              "Delivery" in our context means the digital unlocking of your course. You will receive an automated email confirmation of your successful payment and enrollment. If you do not receive this email within a few minutes, please check your spam folder.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">4. Technical Issues & Support</h2>
            <p>
              In rare cases, network delays might cause a slight delay in course unlocking. If your payment was deducted but the course does not appear in your Student Dashboard after 15 minutes, please contact our technical support team. We will manually verify your payment and grant you access immediately.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">5. Contact Information</h2>
            <p>
              For any issues regarding course access or delivery of your digital content, please reach out to us at: <a href="mailto:electricalstudyworld@gmail.com" className="text-gold-400 hover:underline">electricalstudyworld@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
