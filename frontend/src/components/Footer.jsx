import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-aff-green-600 p-1.5 text-white">
                <Leaf size={18} />
              </div>
              <span className="font-bold text-aff-green-800">AFF Platform</span>
            </div>
            <p className="text-sm text-slate-500">
              Connecting food donors with individuals in need. Reduce waste, improve accessibility, build a sustainable community.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-slate-700">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/register/recipient" className="hover:text-aff-green-600">Register as Recipient</Link></li>
              <li><Link to="/register/donor" className="hover:text-aff-green-600">Register as Donor</Link></li>
              <li><Link to="/login" className="hover:text-aff-green-600">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-slate-700">COSC2769 Project</h4>
            <p className="text-sm text-slate-500">
              RMIT University · Full Stack Development<br />
              Affordable Food Federation (AFF)
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © 2026 Affordable Food Federation. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
