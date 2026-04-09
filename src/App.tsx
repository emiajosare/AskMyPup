import React, { useState, useRef } from 'react'; // Añadimos useRef
import { 
  ArrowRight, 
  CheckCircle2, 
  PawPrint,
  Menu,
  X,
  MessageSquare,
  Activity,
  Search,
  Stethoscope,
  ChevronDown,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // REFERENCIA PARA EL INPUT
  const emailInputRef = useRef<HTMLInputElement>(null);

  // FUNCIÓN PARA LLEVAR AL USUARIO AL EMAIL
  const scrollToEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    // 1. Bajamos a la sección del waitlist
    const element = document.getElementById('waitlist');
    element?.scrollIntoView({ behavior: 'smooth' });
    
    // 2. Ponemos el foco en el input después de un breve delay (para que termine el scroll)
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // REEMPLAZA ESTA URL por la que copiaste en el Paso 2
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxzzVrTEqvIAFiuomDVGKgED9hIrru9M4hprA0I8Vw50szZQMtyQLzTfeBGd4cQlOGUNw/exec";

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Importante para Google Scripts
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      // Con no-cors no podemos leer la respuesta exacta, 
      // así que asumimos éxito si no hay error de red.
      setIsRegistered(true);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al registrarte. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      question: "When will AskMyPup launch?",
      answer: "We are currently in private beta and plan to launch to the public in Summer 2026. Join our waitlist to get early access and exclusive updates!"
    },
    {
      question: "Can AskMyPup identify why my dog is itching?",
      answer: "Yes. Our AI analyzes symptoms like paw licking and scratching against thousands of known allergens and dietary triggers to give you immediate clarity."
    },
    {
      question: "Is this a substitute for a vet?",
      answer: "No. AskMyPup is a clarity tool to help you understand potential causes. We always recommend consulting a professional for a formal diagnosis."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-orange-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter">AskMyPup</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <a href="#how-it-works" className="text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-widest">How it Works</a>
              <a href="#demo" className="text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-widest">Analyzer</a>
              
              {/* BOTÓN DE MENÚ MODIFICADO */}
              <button 
                onClick={scrollToEmail}
                className="bg-[#1a1a1a] text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/10"
              >
                Join Waitlist
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="waitlist" className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100/50 px-5 py-2 rounded-full mb-10 shadow-sm">
                <span className="text-xs font-black text-orange-700 uppercase tracking-[0.2em]">The Symptom Clarity Tool</span>
              </div>
              
              <h1 className="text-6xl lg:text-[5.5rem] font-black leading-[0.95] mb-10 tracking-tighter">
                Your dog can't tell you <span className="text-orange-500 italic">why</span> they itch.
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
                Stop the cycle of guessing. Get immediate clarity on paw licking, scratching, and skin irritation.
              </p>
              
              {/* FORMULARIO ELEGANTE Y LARGO (TAREA 4 REFINADA) */}
              <div className="mb-16">
                {!isRegistered ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                    <div className="relative flex-1 group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        ref={emailInputRef} // ASIGNAMOS LA REFERENCIA
                        type="email" 
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-6 py-5 rounded-[1.5rem] border-2 border-black/5 bg-white focus:border-orange-500 focus:outline-none text-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-[#1a1a1a] text-white px-8 py-5 rounded-[1.5rem] text-lg font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group whitespace-nowrap shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Joining..." 
                      ) : (
                        <>
                          Get Free Early Access 
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex bg-green-50 border border-green-100 p-6 rounded-[2rem] text-green-800 font-bold items-center gap-3 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" /> Welcome to the pack! We'll notify you soon.
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-10">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-12 h-12 rounded-full border-4 border-[#faf9f6]" alt="User" />
                  ))}
                </div>
                <div className="text-xl font-black">2,400+ Joined</div>
              </div>
            </div>
            
            <div className="mt-20 lg:mt-0 relative">
              <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl group">
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/034/922/491/original/an-adorable-beagle-dog-scratching-body-outdoor-on-the-grass-field-free-video.jpg" 
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Concerned Dog"
                />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-2xl">
                    <div className="flex gap-5 items-center font-black text-gray-900 text-lg">
                      <MessageSquare className="text-orange-500" /> "Why is he licking his paws?"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIONES RESTANTES IGUALES PERO CON EL BOTÓN FUNCIONAL */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-6xl font-black mb-24 tracking-tight">Simple. Fast. Veterinary-Trained.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Activity className="w-10 h-10 text-orange-600" />, title: "Describe Symptoms", desc: "Tell us exactly what's happening. Paw licking? Redness?" },
              { icon: <Search className="w-10 h-10 text-orange-600" />, title: "Analyze Triggers", desc: "Our AI evaluates symptoms against seasonal and dietary irritants." },
              { icon: <Stethoscope className="w-10 h-10 text-orange-600" />, title: "Get Guidance", desc: "Receive immediate next steps and know when to book a vet visit." }
            ].map((step, idx) => (
              <div key={idx} className="p-10 rounded-[3rem] bg-[#faf9f6]/50 border border-gray-100 hover:shadow-xl transition-all">
                <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-sm">{step.icon}</div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="text-gray-500 font-medium text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-32 bg-[#faf9f6]">
        <DemoSection />
      </section>

      {/* FOOD SECTION - BOTÓN 'START MY CHECK' AHORA FUNCIONA */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-2 lg:gap-32 items-center">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black mb-10 tracking-tighter">Is the answer <span className="text-orange-500">in their bowl?</span></h2>
            <div className="space-y-6">
              {["Scan labels in one click.", "Spot allergens like Corn or Soy.", "Identify synthetic preservatives.", "Find the right diet."].map((item, i) => (
                <div key={i} className="flex gap-4 font-bold text-xl text-gray-600"><CheckCircle2 className="text-orange-500" /> {item}</div>
              ))}
              
              {/* BOTÓN CON FUNCIÓN SCROLL + FOCUS */}
              <button 
                onClick={scrollToEmail}
                className="inline-flex items-center gap-2 mt-8 text-orange-600 font-black text-xl hover:gap-4 transition-all uppercase tracking-wider"
              >
                Start My Check <ArrowRight />
              </button>
            </div>
          </div>
          <div className="mt-20 lg:mt-0 relative">
            <img src="https://img.freepik.com/fotos-premium/perro-caniche-cuenco-comida-fondo-blanco-aislado_1105541-13616.jpg?semt=ais_hybrid&w=740&q=80" className="rounded-[5rem] shadow-2xl" alt="Natural Dog Food" />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-8 text-left font-bold text-xl hover:bg-gray-50 transition-all"
                >
                  {faq.question} <ChevronDown className={`transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gray-50 px-8 pb-8 text-gray-600 font-medium leading-relaxed overflow-hidden">
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
                      Askmypup@gmail.com
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