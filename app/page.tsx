import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ForSchool from './components/ForSchool'
import ForStudent from './components/ForStudent'
import Features from './components/Features'
import Testimonial from './components/Testimonial'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ForSchool />
      <ForStudent />
      <Features />
      <Testimonial />
      <CTA />
      <Footer />
    </main>
  )
}