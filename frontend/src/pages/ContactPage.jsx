import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Contact Us - Satya Tech Academy"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', "Contact Satya Tech Academy for support, inquiries, or feedback.")
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you within 24 hours.')
      e.target.reset()
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="page-shell">

      <Navbar />

      <main className="container-pro py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">Contact Us</p>
          <h1 className="mt-4 font-cinzel text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            We'd love to hear from you
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Have a question about our courses? Need technical support? Send us a message.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="card-pro p-8">
              <h3 className="font-cinzel text-xl font-bold text-white mb-6">Business Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Business Name</p>
                  <p className="text-white font-medium">Satya Tech Academy</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Email Address</p>
                  <a href="mailto:support@satya-tech-academy.com" className="text-gold-400 hover:underline">
                    support@satya-tech-academy.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</p>
                  <a href="tel:9315358737" className="text-slate-300 hover:text-gold-400 transition">
                    +91 9315358737
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Response Time</p>
                  <p className="text-slate-300">Within 24 Hours</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Location</p>
                  <p className="text-slate-300">Available Online Worldwide (Operating from India)</p>
                </div>
              </div>

              {/* Social Icons Placeholder */}
              <div className="mt-8 flex gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-gold-500 hover:text-black">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-gold-500 hover:text-black">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-gold-500 hover:text-black">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card-pro h-48 overflow-hidden relative flex items-center justify-center bg-white/5">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <p className="text-slate-400 text-sm font-medium z-10 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Online Presence (India)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-pro p-8 lg:p-10">
            <h3 className="font-cinzel text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-pro">Full Name</label>
                <input required type="text" className="input-pro" placeholder="John Doe" />
              </div>
              <div>
                <label className="label-pro">Email Address</label>
                <input required type="email" className="input-pro" placeholder="john@example.com" />
              </div>
              <div>
                <label className="label-pro">Subject</label>
                <select required className="input-pro">
                  <option value="" disabled selected>Select a subject</option>
                  <option value="course">Course Inquiry</option>
                  <option value="payment">Payment Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label-pro">Message</label>
                <textarea required className="input-pro min-h-[120px] resize-y" placeholder="How can we help you?"></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="btn-primary w-full mt-4">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
