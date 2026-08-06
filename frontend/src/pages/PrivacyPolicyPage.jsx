import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy - Satya Tech Academy"
  }, [])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container-pro py-20 max-w-4xl mx-auto">
        <h1 className="font-cinzel text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-10 text-sm">Last Updated: August 2026</p>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you register on Satya Tech Academy, we collect basic information necessary to provide our services. This includes your name, email address, and authentication details. If you use OAuth (Google/GitHub), we receive your public profile information (name and email) from these providers.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">2. Student Account Information</h2>
            <p>
              We store your course enrollment data, progress, certificate records, and communication preferences. This data is kept strictly confidential and is used solely to enhance your learning experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">3. Payment Information</h2>
            <p>
              We use <strong>Razorpay</strong> as our secure payment gateway. We do not store your credit card details, UPI PIN, or bank account information on our servers. All payment transactions are processed securely through Razorpay's compliant infrastructure.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
            <p>
              We use minimal cookies necessary for the functioning of the website, such as managing your session securely via JSON Web Tokens (JWT). We do not use intrusive third-party tracking cookies for targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS, secure password hashing, and encrypted database connections to protect your personal information from unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">6. User Rights</h2>
            <p>
              You have the right to access, modify, or request the deletion of your personal data. If you wish to permanently delete your account and associated data, please contact our support team.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact us at: <br />
              <a href="mailto:electricalstudyworld@gmail.com" className="text-gold-400 hover:underline">electricalstudyworld@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
