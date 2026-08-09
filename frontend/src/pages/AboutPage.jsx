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
