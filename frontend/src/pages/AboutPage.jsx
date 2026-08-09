import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us - Satya Tech Academy"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', "Learn about Satya Tech Academy's mission to provide high-quality, practical coding education with real-world projects and mentorship.")
  }, [])

  return (
    <div className="page-shell">

      <Navbar />

      <main className="container-pro py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">About Us</p>
          <h1 className="mt-4 font-cinzel text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Empowering the Next Generation of Developers
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Satya Tech Academy was founded with a single mission: to bridge the gap between theoretical computer science and practical software engineering.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 mb-20">
          <div className="card-pro p-8 lg:p-10">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-400 leading-7">
              We strive to provide affordable, high-quality coding education that focuses on building real-world projects. We believe that hands-on experience is the best way to master software development, which is why all our courses are project-centric.
            </p>
          </div>
          <div className="card-pro p-8 lg:p-10">
            <div className="text-4xl mb-4">👁️</div>
            <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-slate-400 leading-7">
              To be the leading platform where aspiring engineers transition from beginners to job-ready professionals, equipped with the technical skills and confidence needed to succeed in the modern tech industry.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-cinzel text-3xl font-bold text-center text-white mb-12">Our Learning Approach</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 text-2xl text-gold-400 mb-6 border border-gold-500/20">1</div>
              <h3 className="font-bold text-white mb-3">Learn the Basics</h3>
              <p className="text-sm text-slate-400">Master syntax, architecture, and core concepts with beginner-friendly explanations.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl text-indigo-400 mb-6 border border-indigo-500/20">2</div>
              <h3 className="font-bold text-white mb-3">Build Projects</h3>
              <p className="text-sm text-slate-400">Apply what you've learned by building full-stack applications and deploying them.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-2xl text-emerald-400 mb-6 border border-emerald-500/20">3</div>
              <h3 className="font-bold text-white mb-3">Get Certified</h3>
              <p className="text-sm text-slate-400">Receive a verifiable certificate to showcase your skills to potential employers.</p>
            </div>
          </div>
        </div>

        {/* Official MSME/Udyam Registration Section */}
        <div className="mb-20 card-pro p-8 lg:p-10 border-gold-500/20 bg-gold-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-white">Business Information</h2>
              <p className="text-sm text-slate-400 mt-1">Official Registration Details</p>
            </div>
            <div className="sm:ml-auto">
              <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-400 uppercase tracking-widest">
                MSME Registered
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-300">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">Enterprise Name</span> 
                <strong className="text-slate-100">SATYA TECH ACADEMY</strong>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">Udyam Reg. No.</span> 
                <strong className="text-gold-400 select-all font-mono">UDYAM-UP-29-0251909</strong>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">Enterprise Type</span> 
                <span className="text-slate-200">Micro</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3 md:pb-0 md:border-0">
                <span className="text-slate-500">Major Activity</span> 
                <span className="text-slate-200">Services</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">NIC Activity</span> 
                <span className="text-slate-200 text-right">Academic tutoring services (85491)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">Date of Registration</span> 
                <span className="text-slate-200">08/08/2026</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                <span className="text-slate-500">State / District</span> 
                <span className="text-slate-200 text-right">Uttar Pradesh / Ghaziabad</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pt-1">
                <span className="text-slate-500">Verification</span> 
                <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline inline-flex items-center gap-1 group">
                  udyamregistration.gov.in
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="card-pro bg-gradient-to-br from-gold-500/10 to-indigo-500/10 p-10 text-center">
          <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Ready to start your journey?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of students learning Java, React, Python, and Full Stack Development with us.
          </p>
          <Link to="/#courses" className="btn-primary inline-block">
            Explore Courses
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
