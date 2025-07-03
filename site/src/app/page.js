// app/page.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiCheck, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import EventsDisplay from './components/EventsDisplay';

export default function Home() {
  const headerRef = useRef();
  const heroRef = useRef();
  const featuresRef = useRef([]);
  const ctaRef = useRef();
  const [particles, setParticles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Prevent scroll when menu open
useEffect(() => {
  document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [isMenuOpen]);

useEffect(() => {
  const generatedParticles = [...Array(20)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5
  }));
  setParticles(generatedParticles);
}, []);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Header animation
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    });

    // Hero animation
    gsap.from(heroRef.current.querySelectorAll('*'), {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1.5,
      delay: 0.3,
      ease: "back.out(1.7)"
    });

    // Features animation
    featuresRef.current.forEach((feature, i) => {
      gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top 80%"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: i * 0.1,
        ease: "power3.out"
      });
    });

    // CTA animation
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 80%"
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const toggleMenu = () => {
  setIsMenuOpen(prev => !prev);
};


  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden  z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles (hydration-safe) */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        {particles.map((particle, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: particle.top,
              left: particle.left,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>


      {/* Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold tracking-tighter">
            <span className="text-yellow-400">TAMBOO</span> BABA
          </div>
          
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#events" className="hover:text-yellow-400 transition-colors">Events</a>
            {/* <a href="#testimonials" className="hover:text-yellow-400 transition-colors">Clients</a> */}
            <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
            <a 
              href="/brandalliances" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-400 transition-colors"
              >
              Brand Alliances
              </a>

            {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-medium transition-colors flex items-center">
              Get Started <FiArrowRight className="ml-2" />
            </button> */}
          </nav>

          <button className="md:hidden text-2xl z-50" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/90 z-40 flex items-center justify-center transition-all duration-500
  ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* <div className="fixed inset-0 bg-black/90 z-40 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-500 menu-open:opacity-100 menu-open:pointer-events-auto"> */}
        <nav className="flex flex-col items-center space-y-8 text-2xl">
          <a href="#services" className="hover:text-yellow-400 transition-colors" onClick={toggleMenu}>Services</a>
          <a href="#features" className="hover:text-yellow-400 transition-colors" onClick={toggleMenu}>Features</a>
          <a href="#events" className="hover:text-yellow-400 transition-colors" onClick={toggleMenu}>Events</a>
          {/* <a href="#testimonials" className="hover:text-yellow-400 transition-colors" onClick={toggleMenu}>Clients</a> */}
          <a 
              href="/brandalliances" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-400 transition-colors"
              >
              Brand Alliances
              </a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors" onClick={toggleMenu}>Contact</a>
          
          {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-medium transition-colors text-xl mt-8 flex items-center">
            Get Started <FiArrowRight className="ml-2" />
          </button> */}
        </nav>
      </div>


{/* Hero Section */}
<section className="min-h-screen flex items-center relative pt-24 overflow-hidden">
  <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
    {/* Text Content - Ensure proper z-index and spacing */}
    <div ref={heroRef} className="lg:w-1/2 relative z-20"> {/* Added z-20 */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
        <span className="text-yellow-400">Redefining</span> Event Experiences
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl blur-[0.5px]">
        Premium event management solutions that transform ordinary gatherings into unforgettable experiences.
      </p>

      
      {/* Button Container - Added margin and z-index */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-20"> {/* Added z-20 */}
<button
  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-yellow-400/50 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-medium transition-colors duration-200 text-lg flex items-center justify-center relative z-20 shadow-md hover:shadow-lg"
>
  Explore Services <FiArrowRight className="ml-2" />
</button>


        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-transparent hover:bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-full font-medium transition-colors text-lg relative z-20 shadow-lg"
        >
           {/* Added shadow-lg */}
          Contact Us
        </button>
      </div>
    </div>

    {/* Image Content - Adjusted z-index */}
    <div className="lg:w-1/2 mt-12 lg:mt-0">
      <div className="relative aspect-square lg:aspect-video w-full max-w-2xl mx-auto">
        {/* Replace with your actual image */}

<Image
  src="/hero-image.png"
  alt="Tamboo Baba Event Management"
  width={800}
  height={500}
  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-white/10"
/>

        {/* Decorative elements */}
        <div className="absolute -inset-4 bg-yellow-400/10 rounded-2xl -z-10"></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  </div>
  
  {/* Hero Decoration - Ensure it stays behind content */}
  <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-950 to-transparent z-0"></div>
</section>




      {/* Logo Cloud */}
      {/* <section className="py-16 bg-black/50 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400 mb-10">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 items-center opacity-70 hover:opacity-100 transition-opacity">
            {['Google', 'Netflix', 'Spotify', 'Nike', 'Tesla'].map((brand) => (
              <div key={brand} className="text-3xl font-bold tracking-tighter">{brand}</div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Services Section */}
      <section id="services" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Premium Services</h2>
            <p className="text-xl text-gray-300">
              Comprehensive solutions tailored to elevate every aspect of your event
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Event Design",
                description: "Bespoke visual concepts that capture your brand essence",
                icon: "🎨"
              },
              {
                title: "Technical Production",
                description: "State-of-the-art AV solutions for immersive experiences",
                icon: "🔊"
              },
              {
                title: "Talent Management",
                description: "Curated performers and speakers for your audience",
                icon: "🌟"
              },
              {
                title: "Digital Integration",
                description: "Hybrid event technology for global reach",
                icon: "💻"
              },
              {
                title: "VIP Hospitality",
                description: "Exclusive services for your most important guests",
                icon: "🥂"
              },
              {
                title: "Strategic Planning",
                description: "End-to-end coordination for flawless execution",
                icon: "📊"
              }
            ].map((service, i) => (
              <div 
                key={i}
                ref={el => featuresRef.current[i] = el}
                className="bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
                <button className="mt-6 text-yellow-400 flex items-center group">
                  Learn more
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why <span className="text-yellow-400">Tamboo Baba</span> Stands Out
              </h2>
              
              <div className="space-y-6">
                {[
                  "Cutting-edge event technology integration",
                  "Global network of premium vendors",
                  "Bespoke creative concepts",
                  "Data-driven audience engagement",
                  "24/7 dedicated support team",
                  "Sustainable event practices"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-full p-2 mr-4">
                      <FiCheck className="text-yellow-400" />
                    </div>
                    <p className="text-xl">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
                {/* Placeholder for video or image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-400/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


        {/* Upcoming Events Section */}
        <section id="events" className="py-28 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h2>
              <p className="text-xl text-gray-300">
                Experience our premium event management services in action
              </p>
            </div>
            
            <EventsDisplay />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
        </section>


      {/* CTA Section */}
      <section 
        ref={ctaRef}
        id="contact" 
        className="py-28 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Elevate Your Event?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Let&apos;s create something extraordinary together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:tamboobaba@gmail.com">
              <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full font-medium transition-colors text-lg">
                Get a Proposal
              </button>
            </a>

            <a href="tel:+917355260895">
              <button className="bg-white/90 hover:bg-white text-black px-8 py-4 rounded-full font-medium transition-colors text-lg">
                Schedule a Call
              </button>
            </a>

          </div>
        </div>
      </section>

{/* Footer */}
<footer className="py-12 bg-black text-white">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="text-2xl font-bold mb-6 md:mb-0">
        <span className="text-yellow-400">TAMBOO</span> BABA
      </div>
      <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 space-y-4 md:space-y-0 md:space-x-6">
        <div>
          📍 Ludhiana, Punjab, India
        </div>
        <div>
          📞 <a href="tel:+917355260895" className="hover:text-yellow-400 transition-colors">+91 73552 60895</a>
        </div>
        <div>
          ✉️ <a href="mailto:tamboobaba@gmail.com" className="hover:text-yellow-400 transition-colors">tamboobaba@gmail.com</a>
        </div>
      </div>
    </div>

    <div className="flex justify-center space-x-6 mt-8 text-sm text-gray-400">
      <a href="https://www.instagram.com/tamboobaba/" className="hover:text-yellow-400 transition-colors">Instagram</a>
      {/* <a href="#" className="hover:text-yellow-400 transition-colors">LinkedIn</a>
      <a href="#" className="hover:text-yellow-400 transition-colors">Twitter</a>
      <a href="#" className="hover:text-yellow-400 transition-colors">Facebook</a> */}
    </div>

    <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
      © {new Date().getFullYear()} Tamboo Baba. All rights reserved.
    </div>
  </div>
</footer>


      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        body.menu-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}