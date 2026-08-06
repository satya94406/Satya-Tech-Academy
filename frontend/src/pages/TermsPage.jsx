import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions - Satya Tech Academy"
  }, [])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container-pro py-20 max-w-4xl mx-auto">
        <h1 className="font-cinzel text-4xl font-extrabold text-white mb-4">Terms & Conditions</h1>
        <p className="text-slate-400 mb-10 text-sm">Last Updated: August 2026</p>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Satya Tech Academy, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">2. User Accounts</h2>
            <p>
              You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials (password and JWT token) and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">3. Course Access & Intellectual Property</h2>
            <p>
              Upon successful payment, you are granted a limited, non-exclusive, non-transferable license to access the course content for personal, educational purposes. All content, including videos, source code, projects, and text, is the intellectual property of Satya Tech Academy and may not be copied, redistributed, or sold.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">4. Payments</h2>
            <p>
              All payments are securely processed via Razorpay. Prices are listed in INR (Indian Rupees) unless stated otherwise. By completing a transaction, you authorize us and our payment processor to charge the specified amount.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">5. Prohibited Activities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sharing your account credentials with others.</li>
              <li>Attempting to hack, disrupt, or manipulate the platform or payment systems.</li>
              <li>Downloading or distributing course content without explicit permission.</li>
              <li>Posting harmful, offensive, or spam content in community areas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              Satya Tech Academy provides educational content on an "as is" basis. We do not guarantee specific job placements, salaries, or outcomes as a direct result of taking our courses. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">7. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">8. Contact Us</h2>
            <p>
              For any questions regarding these terms, contact us at: <a href="mailto:electricalstudyworld@gmail.com" className="text-gold-400 hover:underline">electricalstudyworld@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
