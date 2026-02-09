import React, { useState, useEffect, useRef } from 'react';

// BRAND COLORS
const BRAND_GREEN = "#9DA352";
const BRAND_GREY = "#9A9A9A";

// --- H2 LOGO COMPONENT ---
const H2Logo = ({ className = "h-9" }: { className?: string }) => (
  <img
    src="/logo.png"
    alt="H2 AI LAB"
    className={`${className} object-contain`}
  />
);

// --- SCROLL REVEAL HOOK ---
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-7xl font-black mb-4 counter-number" style={{ color: BRAND_GREEN }}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

// --- SCROLL INDICATOR ---
const ScrollIndicator = () => (
  <div className="absolute bottom-12 left-1/2 scroll-indicator cursor-pointer" onClick={() => {
    document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
  }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={BRAND_GREEN} strokeWidth="2">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </div>
);

// --- LOADING SCREEN ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-logo">
        <img src="/logo.png" alt="H2 AI LAB" className="h-16" />
      </div>
      <div className="loading-bar">
        <div className="loading-bar-progress" />
      </div>
    </div>
  );
};

// --- PRIVACY ICONS ---
const PrivacyIcons = {
  local: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BRAND_GREEN} strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M12 11v4" /><circle cx="12" cy="16" r="1" />
    </svg>
  ),
  noCloud: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BRAND_GREEN} strokeWidth="1.5">
      <path d="M18 10a4 4 0 0 0-4-4 4 4 0 0 0-8 2 3 3 0 0 0 0 6h10a4 4 0 0 0 0-8" /><line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  ),
  consent: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BRAND_GREEN} strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  minimal: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BRAND_GREEN} strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const response = await fetch('https://forminit.com/f/gsit32ht1ex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            { type: 'email', name: 'email', value: email },
            { type: 'text', name: 'message', value: 'Pilot 2026 Interest' }
          ]
        }),
      });
      if (response.ok) { setStatus('success'); setEmail(""); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

  // Scroll reveal refs
  const heroRef = useScrollReveal();
  const problemRef = useScrollReveal();
  const systemRef = useScrollReveal();
  const privacyRef = useScrollReveal();
  const howItWorksRef = useScrollReveal();
  const contactRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-[#9DA352]/20">
      {/* LOADING SCREEN */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <H2Logo />
          </button>
          <div className="hidden lg:flex gap-12 font-bold uppercase text-[13px] tracking-[0.2em] text-slate-500">
            {['Problem', 'H2 System', 'Privacy', 'How It Works'].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/ /g, '-'))} className="hover:text-black transition-colors">{item}</button>
            ))}
          </div>
          <button onClick={() => scrollTo('contact')} className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-2xl transition-all hover:scale-105" style={{ backgroundColor: BRAND_GREEN }}>Join Pilot</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center animated-gradient">
        <div ref={heroRef.ref} className={`reveal ${heroRef.isVisible ? 'visible' : ''}`}>
          <h1 className="text-7xl md:text-[9rem] font-black tracking-[-0.06em] leading-[0.85] mb-8">
            Safety without <br /><span style={{ color: BRAND_GREEN }}>compromise.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed italic">
            "Empowering independence through proactive AI protection."
          </p>
          <button onClick={() => scrollTo('contact')} className="px-12 py-6 rounded-full font-black text-lg text-white shadow-2xl transition-all hover:brightness-110 hover:scale-105 active:scale-95" style={{ backgroundColor: BRAND_GREEN }}>
            Apply for Pilot 2026
          </button>
        </div>
        <ScrollIndicator />
      </header>

      {/* THE CHALLENGE */}
      <section id="problem" className="py-32 bg-white">
        <div ref={problemRef.ref} className={`max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center reveal ${problemRef.isVisible ? 'visible' : ''}`}>
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">The Wandering Challenge</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">60% of people with dementia will experience a wandering incident. We provide the technology to prevent it.</p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center card-hover">
                <AnimatedCounter end={982} suffix="k" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">UK Citizens Involved</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center card-hover">
                <AnimatedCounter end={60} suffix="%" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Risk Probability</p>
              </div>
            </div>
            <button onClick={() => scrollTo('h2-system')} className="text-sm font-black uppercase tracking-widest hover:text-slate-900 transition-colors" style={{ color: BRAND_GREEN }}>
              Explore Our Solution →
            </button>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl product-image-container">
            <img src="/product.png" className="w-full h-full object-cover" alt="H2 Complete System" />
          </div>
        </div>
      </section>

      {/* H2 SYSTEM SECTION */}
      <section id="h2-system" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 md:mx-8">
        <div ref={systemRef.ref} className={`max-w-7xl mx-auto px-8 reveal ${systemRef.isVisible ? 'visible' : ''}`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">The H2 System</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Three Components. Total Protection.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cam Modules */}
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/30 transition-all card-hover">
              <div className="h-48 mb-6 rounded-2xl overflow-hidden product-image-wrapper">
                <img src="/cam-modules.png" className="w-full h-full object-contain p-4" alt="Cam Modules" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Cam Modules</h3>
              <p className="text-slate-400 text-base leading-relaxed">Low-power cameras at key exits. Wake on motion, capture brief images. Escalate to video only when risk is elevated.</p>
            </div>
            {/* H2 Hub - Featured */}
            <div className="p-8 rounded-[2.5rem] bg-white/5 border-2 transition-all pulse-glow transform md:-translate-y-4" style={{ borderColor: BRAND_GREEN }}>
              <div className="h-48 mb-6 rounded-2xl overflow-hidden product-image-wrapper">
                <img src="/H2-hub.png" className="w-full h-full object-contain p-4 float-animation" alt="H2 AI Hub" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND_GREEN }}>The H2 Hub</h3>
              <p className="text-slate-400 text-base leading-relaxed">Local AI brain. Processes everything on-site. Exit detection, behavior patterns, optional identity matching. Zero cloud exposure.</p>
            </div>
            {/* Smart Tracker */}
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/30 transition-all card-hover">
              <div className="h-48 mb-6 rounded-2xl overflow-hidden product-image-wrapper">
                <img src="/tracker.png" className="w-full h-full object-contain p-4" alt="Smart Tracker" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Tracker</h3>
              <p className="text-slate-400 text-base leading-relaxed">Hidden in familiar items. BLE for proximity, GPS/cellular only on confirmed exit. Real-time location when it matters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY SECTION */}
      <section id="privacy" className="py-32 bg-white">
        <div ref={privacyRef.ref} className={`max-w-7xl mx-auto px-8 reveal ${privacyRef.isVisible ? 'visible' : ''}`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">Privacy First</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Your data stays where it belongs — in your home.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: PrivacyIcons.local, title: 'Local Processing', desc: 'All AI processing happens on-device. No external servers involved.' },
              { icon: PrivacyIcons.noCloud, title: 'Zero Cloud Exposure', desc: 'Video never leaves your home. Complete data sovereignty.' },
              { icon: PrivacyIcons.consent, title: 'Consent-Based', desc: 'Identity matching is optional and fully controlled by the carer.' },
              { icon: PrivacyIcons.minimal, title: 'Minimal Capture', desc: 'Camera only records when risk is detected. No 24/7 surveillance.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-[2rem] bg-slate-50 border border-slate-100 card-hover">
                <div className="privacy-icon mx-auto">
                  <item.icon />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 bg-slate-50">
        <div ref={howItWorksRef.ref} className={`max-w-5xl mx-auto px-8 reveal ${howItWorksRef.isVisible ? 'visible' : ''}`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">How It Works</h2>
            <p className="text-slate-500 text-xl">Three steps to complete protection</p>
          </div>
          <div className="space-y-12">
            {[
              { step: '01', title: 'Motion Detected', desc: 'Cam Module at the door detects movement and wakes from sleep mode to capture a brief image.', color: BRAND_GREY },
              { step: '02', title: 'AI Analysis', desc: 'H2 Hub processes locally — exit-event detection, behavior patterns, time-of-day risk assessment.', color: BRAND_GREEN },
              { step: '03', title: 'Smart Alert', desc: 'Carer receives clear notification: "exit risk" vs "confirmed exit". One-tap confirmation when uncertain.', color: BRAND_GREY },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="text-6xl font-black opacity-20" style={{ color: item.color }}>{item.step}</div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-8">
        <div ref={contactRef.ref} className={`max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-16 md:p-20 text-center text-white shadow-2xl relative overflow-hidden reveal ${contactRef.isVisible ? 'visible' : ''}`}>
          <div className="absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-20" style={{ backgroundColor: BRAND_GREEN }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 blur-[100px] opacity-10" style={{ backgroundColor: BRAND_GREEN }}></div>

          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white relative z-10">
            {status === 'success' ? "Welcome to the Lab." : "Ready to Start?"}
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed relative z-10">
            {status === 'success'
              ? "Your application for the 2026 Pilot has been received. We will contact you shortly."
              : status === 'error'
                ? "Something went wrong. Please check your connection and try again."
                : "Secure your place in the future of dementia care."}
          </p>

          {status !== 'success' && (
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative z-10">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-8 py-5 bg-white/5 rounded-2xl border border-white/10 text-lg focus:outline-none focus:border-white/30 transition-all text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-10 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all text-white shadow-lg disabled:opacity-50"
                style={{ backgroundColor: BRAND_GREEN }}
              >
                {status === 'submitting' ? "Sending..." : "Contact Us"}
              </button>
            </form>
          )}

          {status === 'success' && (
            <button onClick={() => setStatus('idle')} className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors underline underline-offset-8 relative z-10">
              Submit Another Application
            </button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-slate-100">
        <div className="flex justify-center mb-8">
          <H2Logo className="h-10" />
        </div>
        <p className="text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase">© 2026 H2 AI LAB.</p>
      </footer>
    </div>
  );
};

export default App;