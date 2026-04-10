import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  PawPrint,
  Menu, 
  X, 
  MessageSquare, 
  Activity, 
  Search, 
  ChevronDown, 
  Mail,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const waitlistRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const scrollToWaitlist = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => firstNameRef.current?.focus(), 600);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Cerramos el menú primero para liberar la pantalla
      setIsMenuOpen(false);
      
      // Añadimos un pequeño delay para que la animación de cierre no interfiera
      setTimeout(() => {
        const offset = 80; // Altura de tu header sticky
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxzzVrTEqvIAFiuomDVGKgED9hIrru9M4hprA0I8Vw50szZQMtyQLzTfeBGd4cQlOGUNw/exec";
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName, 
          email, 
          date: new Date().toISOString() 
        }),
      });
      setIsRegistered(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-orange-100 antialiased">
      
      {/* 1. Top Header / Navbar con Menú Móvil */}
      <nav className="sticky top-0 z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-orange-500 p-1.5 rounded-lg"><PawPrint className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black tracking-tighter">AskMyPup</span>
          </div>

          {/* Escritorio */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('why-join')} className="text-sm font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Why Join Early</button>
            <button onClick={() => scrollToSection('faq')} className="text-sm font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">FAQ</button>
            <button onClick={() => scrollToWaitlist()} className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all">
              Join the Waitlist
            </button>
          </div>

          {/* Botón Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-black/5 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 font-bold uppercase tracking-widest text-sm text-gray-500">
                <button onClick={() => scrollToSection('how-it-works')} className="text-left py-4 border-b border-gray-50">How It Works</button>
                <button onClick={() => scrollToSection('why-join')} className="text-left py-4 border-b border-gray-50">Why Join Early</button>
                <button onClick={() => scrollToSection('faq')} className="text-left py-4 border-b border-gray-50">FAQ</button>
                <button onClick={() => scrollToWaitlist()} className="bg-[#1a1a1a] text-white p-5 rounded-2xl text-center mt-4">Join the Waitlist</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-16 pb-20 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="max-w-[620px]">
            <span className="text-sm font-black text-orange-600 uppercase tracking-[0.2em] mb-4 block">Itching. Licking. Scratching.</span>
            <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] mb-8 tracking-tighter">Your dog can’t tell you why they itch.</h1>
            <p className="text-xl lg:text-2xl text-gray-500 mb-10 leading-relaxed font-medium">
              AskMyPup is building a simpler way to spot hidden ingredient triggers in dog food labels — so dog owners can stop guessing and start understanding what may be causing the irritation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button onClick={() => scrollToWaitlist()} className="bg-[#1a1a1a] text-white px-8 py-5 rounded-2xl text-lg font-black hover:bg-orange-600 transition-all shadow-xl shadow-black/10">Join the Waitlist</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-500 px-8 py-5 rounded-2xl text-lg font-bold hover:bg-black/5 transition-all">See How It Will Work</button>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Be among the first to check your dog’s ingredients when AskMyPup launches.</p>
          </div>
          <div className="mt-16 lg:mt-0 relative">
            <img src="/itchy-dog.png" className="rounded-[3rem] shadow-2xl grayscale-[20%]" alt="Dog scratching" />
            <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-3xl shadow-2xl border border-white/40 max-w-xs animate-float">
              <div className="flex gap-4 items-center mb-2">
                <Search className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-sm">Ingredient Scan Concept</span>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-[10px] font-black text-red-700 uppercase">Possible Trigger</p>
                <p className="text-sm font-bold">Chicken protein</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust Strip */}
      <div className="py-8 border-y border-black/5 bg-white text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] px-4">
          Built for dog owners looking for clearer answers before the next vet visit.
        </p>
      </div>

      {/* 4. Problem Bridge */}
      <section className="py-24 lg:py-32 bg-white text-center">
        <div className="max-w-[760px] mx-auto px-5">
          <h2 className="text-3xl lg:text-5xl font-black mb-8 italic text-gray-900">It may not be random.</h2>
          <div className="space-y-6 text-xl lg:text-2xl text-gray-500 font-medium leading-relaxed">
            <p>When dogs keep itching, licking their paws, or scratching their ears, many owners assume it is just allergies.</p>
            <p className="text-gray-900 font-black italic underline decoration-orange-500 decoration-4 underline-offset-8">But sometimes the food bowl is part of the story.</p>
            <p>Some ingredient triggers are obvious. Others are buried in labels most owners were never taught how to read.</p>
          </div>
          <p className="mt-12 text-2xl font-black text-gray-900">AskMyPup is being built to make those hidden clues easier to spot.</p>
        </div>
      </section>

      {/* 5. Trigger Cards */}
      <section className="py-24 lg:py-32 bg-[#faf9f6]">
        <div className="max-w-[1200px] mx-auto px-5 text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tight">You might be feeding the cause without realizing it.</h2>
          <p className="text-xl text-gray-500 font-medium">Many dog owners do not notice possible food triggers until symptoms keep coming back.</p>
        </div>
        <div className="max-w-[1200px] mx-auto px-5 grid md:grid-cols-3 gap-8">
          {[
            { label: "Common trigger", title: "Chicken-based proteins", body: "Some dogs may react to proteins that appear in foods they eat every day." },
            { label: "Often missed", title: "Artificial preservatives", body: "Additives and preservatives can be easy to overlook on a crowded label." },
            { label: "Hidden in plain sight", title: "Fillers and additives", body: "Certain ingredients may contribute to irritation or digestive discomfort in sensitive dogs." }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-premium">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 block">{card.label}</span>
              <h3 className="text-2xl font-black mb-4">{card.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Why Join Early Section (ID: why-join) */}
      <section id="why-join" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">Why join early</h2>
          <p className="text-xl text-gray-500 font-medium">Early access members will be the first to try AskMyPup and help shape how it works for real dog owners.</p>
        </div>
        <div className="max-w-[1200px] mx-auto px-5 grid md:grid-cols-3 gap-8">
          {[
            { title: "Get first access", body: "Be among the first dog owners to try ingredient checking when AskMyPup launches." },
            { title: "Help shape the product", body: "Your feedback can influence which features matter most." },
            { title: "Stay informed", body: "Get launch updates, early invites, and product news." }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] border border-black/5 hover:bg-white transition-all">
              <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-lg">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. How It Will Work */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto px-5 text-center mb-24">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight">How it will work</h2>
        </div>
        <div className="max-w-[1200px] mx-auto px-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { step: "1", title: "Take a picture", body: "Snap your dog food label or upload an image." },
            { step: "2", title: "We scan the ingredients", body: "AskMyPup will read the label and look for possible triggers." },
            { step: "3", title: "See flagged ingredients", body: "Get a simple breakdown of what may be worth attention." },
            { step: "4", title: "Make a better next move", body: "Use that insight when choosing food or talking with your vet." }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8 group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <h3 className="text-xl font-black mb-4">{item.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center">
          <button onClick={() => scrollToWaitlist()} className="text-xl font-black text-orange-500 uppercase tracking-widest hover:tracking-[0.2em] transition-all flex items-center justify-center mx-auto gap-4">
            Join the Waitlist <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* 10. Main Waitlist Section (Simplified Form) */}
      <section ref={waitlistRef} id="waitlist" className="py-24 lg:py-40 bg-[#faf9f6]">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="bg-white rounded-[4rem] p-12 lg:p-24 shadow-2xl border border-black/5 text-center">
            {!isRegistered ? (
              <>
                <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-gray-900">Be first to check your dog’s ingredients.</h2>
                <p className="text-xl text-gray-500 mb-12 font-medium">Join the AskMyPup waitlist for early access and launch updates.</p>
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">First name</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input ref={firstNameRef} required type="text" placeholder="Your first name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-black/5 focus:border-orange-500 outline-none font-bold text-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input required type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-black/5 focus:border-orange-500 outline-none font-bold text-lg" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-[#1a1a1a] text-white py-6 rounded-2xl text-xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-4 active:scale-[0.98]">
                    {isLoading ? "Joining..." : "Join the Waitlist"} <ArrowRight className="w-6 h-6" />
                  </button>
                </form>
                <p className="mt-8 text-sm font-medium text-gray-400">We’ll only use your information for AskMyPup updates and early access.</p>
              </>
            ) : (
              <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="py-20">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600"><CheckCircle2 className="w-12 h-12" /></div>
                <h3 className="text-4xl font-black mb-4">Welcome to the pack!</h3>
                <p className="text-xl text-gray-500 font-medium">You're officially on the waitlist. We'll send launch updates to {email}.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 11. Contact Section */}
      <section className="py-24 bg-white text-center border-t border-black/5">
        <h3 className="text-2xl font-black mb-4 tracking-tighter">Want to talk with us?</h3>
        <p className="text-lg text-gray-500 font-medium mb-6 px-4">Have feedback, questions, or want to share your dog’s food sensitivity story? We’d love to hear from you.</p>
        <a href="mailto:administration@askmypup.com" className="text-2xl font-black text-orange-600 hover:text-orange-700 decoration-2 underline">administration@askmypup.com</a>
      </section>

      {/* 12. Disclaimer */}
      <section className="py-20 bg-gray-50 px-5 text-center border-t border-black/5">
        <div className="max-w-[760px] mx-auto">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Important note</h4>
          <p className="text-gray-500 font-medium leading-relaxed">AskMyPup is being developed as an informational tool for dog owners. It is not intended to diagnose, treat, or replace professional veterinary care. If your dog has severe symptoms or worsening discomfort, contact your veterinarian.</p>
        </div>
      </section>

      {/* 13. FAQ */}
      <section id="faq" className="py-24 lg:py-32 bg-white px-5">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-3xl font-black mb-16 text-center tracking-tighter">Questions & Answers</h2>
          <div className="space-y-4">
            {[
              { q: "Is AskMyPup available now?", a: "Not yet. AskMyPup is currently in development, and the waitlist gives you a chance to get early access when it launches." },
              { q: "What will AskMyPup do?", a: "It is being built to help dog owners scan food labels and spot ingredients that may be linked to common irritation or sensitivity concerns." },
              { q: "Why join the waitlist?", a: "You will be among the first to try AskMyPup, receive launch updates, and help shape the product with early feedback." },
              { q: "Is this a replacement for a vet?", a: "No. AskMyPup is not a replacement for veterinary care. It is meant to provide informational guidance only." },
              { q: "What kinds of issues is AskMyPup focused on?", a: "The first version is focused on food-related ingredient concerns connected to itching, licking, scratching, and some digestive sensitivities." }
            ].map((faq, i) => (
              <div key={i} className="border border-black/5 rounded-3xl overflow-hidden bg-gray-50/50">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex justify-between items-center p-8 text-left font-bold text-xl hover:bg-gray-100 transition-all">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="px-8 pb-8 text-gray-500 font-medium overflow-hidden leading-relaxed">{faq.a}</motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Footer */}
       <footer className="bg-[#1a1a1a] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 text-center">
          <div className="flex items-center gap-3 font-black text-2xl"><PawPrint className="text-orange-500" /> AskMyPup</div>
          <nav className="flex flex-wrap justify-center gap-8">
            <button onClick={() => setActiveModal('privacy')} className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest">Terms of Service</button>
            <button onClick={() => setActiveModal('contact')} className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest">Contact Us</button>
          </nav>
          <p className="text-gray-500 font-medium">© 2024 AskMyPup. Helping dogs feel better, one question at a time.</p>
        </div>
      </footer>

      {/* MODALS SISTEMA (IGUAL AL ANTERIOR) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 sm:py-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'contact' && 'Contact Us'}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-6 text-slate-600 sm:px-8 sm:py-8">
                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-400">Last Updated: March 2026</p>
                    <ol className="list-decimal space-y-4 pl-5">
                      <li><strong>Acceptance:</strong> By signing up for our waitlist, you agree to these terms.</li>
                      <li><strong>Age Requirement:</strong> You must be at least <strong>16 years old</strong> to use AskMyPup.</li>
                      <li><strong>VETERINARY DISCLAIMER:</strong> AskMyPup is an AI-powered informational tool. It does <strong>NOT</strong> provide professional veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified veterinarian regarding your pet's health.</li>
                      <li><strong>Limitation of Liability:</strong> AskMyPup and its creators are not liable for any decisions made based on AI-generated content. Use at your own risk.</li>
                      <li><strong>Jurisdiction:</strong> These terms are governed by the laws of <strong>Canada and the United States</strong>.</li>
                    </ol>
                  </div>
                )}
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    <ol className="list-decimal space-y-4 pl-5">
                      <li><strong>Data Collection:</strong> We only collect your email address for our waitlist.</li>
                      <li><strong>Use of Data:</strong> Your information is used strictly for <strong>internal communications</strong> regarding AskMyPup updates.</li>
                      <li><strong>Data Sharing:</strong> We do <strong>not</strong> sell or share your data with third parties.</li>
                      <li><strong>Your Rights:</strong> You may request to be removed from our list at any time by contacting us.</li>
                      <li><strong>Security:</strong> We implement standard security measures to protect your email address.</li>
                    </ol>
                  </div>
                )}
                {activeModal === 'contact' && (
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-slate-900">Questions or Feedback?</p>
                    <p>We’d love to hear from you. Reach out to us at:</p>
                    <a href="mailto:Askmypup@gmail.com" className="inline-flex items-center gap-2 text-lg font-bold text-blue-600 hover:text-blue-700">
                      administration@askmypup.com
                    </a>
                  </div>
                )}
              </div>
              <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition-colors hover:bg-slate-800 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;