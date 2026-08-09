import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-academy-950/95 py-12 text-sm text-slate-400">
      <div className="container-pro grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
            <img 
              src="/logo.png" 
              alt="Satya Tech Academy Logo" 
              className="h-10 w-auto object-contain md:h-12" 
            />
          </Link>
          <p className="leading-6 text-slate-400">
            Empowering students with practical coding skills, mentorship, and career-focused learning.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-gold-400 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition">Contact Us</Link></li>
            <li><Link to="/#courses" className="hover:text-gold-400 transition">Courses</Link></li>
            <li><Link to="/login" className="hover:text-gold-400 transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-gold-400 transition">Register</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy-policy" className="hover:text-gold-400 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold-400 transition">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-gold-400 transition">Refund & Cancellation Policy</Link></li>
            <li><Link to="/delivery-policy" className="hover:text-gold-400 transition">Delivery Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Contact</h3>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:support@satya-tech-academy.com" className="text-gold-400 hover:underline">support@satya-tech-academy.com</a></li>
            <li>Phone: <a href="tel:9315358737" className="text-gold-400 hover:underline">+91 9315358737</a></li>
            <li>Response Time: Within 24 hours</li>
          </ul>
        </div>
      </div>

      <div className="container-pro mt-12 border-t border-white/5 pt-8 pb-8 flex flex-col items-center gap-3 text-center text-xs text-slate-500">
        <div className="flex flex-col items-center gap-1">
          <p>Registered as a Micro Enterprise under MSME</p>
          <p>
            Udyam Registration No.: <span className="select-all font-mono text-slate-400">UDYAM-UP-29-0251909</span>
          </p>
        </div>
        <p>© 2026 Satya Tech Academy. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
