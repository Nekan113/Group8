import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Leaf, Users, Package, TrendingDown } from 'lucide-react'
import { Button, Card, StatCard } from '../components/reusable'

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-aff-green-700 via-aff-green-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-aff-orange-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              Food Waste Reliever Platform
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Reduce Food Waste.<br />Feed Communities.
            </h1>
            <p className="mb-8 text-lg text-green-100">
              AFF connects food donors with individuals experiencing financial hardship.
              Discover affordable or free food, reserve online, and collect near you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register/recipient">
                <Button variant="orange" size="lg">
                  I Need Food <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/register/donor">
                <Button variant="secondary" size="lg" className="border-white !text-black hover:bg-white/10">
                  I Want to Donate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Meals Saved Daily" value="1B+" icon={Heart} color="green" />
          <StatCard label="Active Donors" value="250+" icon={Users} color="blue" />
          <StatCard label="Food Listings" value="1,200+" icon={Package} color="orange" />
          <StatCard label="Waste Reduced" value="19%" icon={TrendingDown} color="purple" trend="Global food waste statistic" />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-800">How AFF Works</h2>
            <p className="mt-2 text-slate-500">Simple steps to make a difference</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Register', desc: 'Sign up as a Recipient or Donor with your city in Vietnam.', icon: Users },
              { step: '2', title: 'Browse & List', desc: 'Recipients browse food listings. Donors create donations with quantity and price.', icon: Leaf },
              { step: '3', title: 'Reserve & Collect', desc: 'Reserve online, pay via wallet or cash, and collect food at the donor location.', icon: Package },
            ].map(({ step, title, desc, icon: Icon }) => (
              <Card key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aff-green-100 text-aff-green-600">
                  <Icon size={28} />
                </div>
                <span className="text-sm font-bold text-aff-green-600">Step {step}</span>
                <h3 className="mt-1 text-xl font-semibold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Card className="bg-gradient-to-r from-aff-green-600 to-emerald-500 text-white">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">Ready to join the federation?</h2>
              <p className="mt-2 text-green-100">Start reducing food waste in your community today.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="secondary" className="border-white bg-white text-aff-green-700 hover:bg-green-50">
                  Login
                </Button>
              </Link>
              <Link to="/register/recipient">
                <Button variant="orange">Get Started</Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
