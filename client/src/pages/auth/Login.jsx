import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import VerificationModal from '../../components/auth/VerificationModal.jsx';
import Footer from '../../components/common/Footer.jsx';

const BG_IMAGES = ['/cybertruck.png', '/model3.png'];
const BG_LABELS = ['Cybertruck', 'Model 3'];

/* ─── Car that drives around the card border using JS (no CSS rotation bugs) ─── */
const BorderCar = ({ containerRef }) => {
  const carRef = useRef(null);
  const raf = useRef(null);
  const t = useRef(0);

  const animate = useCallback(() => {
    const car = carRef.current;
    const box = containerRef.current;
    if (!car || !box) { raf.current = requestAnimationFrame(animate); return; }

    const w = box.offsetWidth;
    const h = box.offsetHeight;
    const carW = car.offsetWidth;
    const carH = car.offsetHeight;
    const perim = 2 * w + 2 * h;
    const speed = 120; // px per second
    const dt = speed / 60;
    t.current = (t.current + dt) % perim;
    const d = t.current;

    let x, y, flipX;

    if (d < w) {
      // Top edge → driving right
      x = d - carW / 2;
      y = -carH / 2 - 4;
      flipX = 1;
    } else if (d < w + h) {
      // Right edge → driving down (car faces right, slides down)
      const seg = d - w;
      x = w - carW / 2 + 4;
      y = seg - carH / 2;
      flipX = 1;
    } else if (d < 2 * w + h) {
      // Bottom edge → driving left
      const seg = d - w - h;
      x = w - seg - carW / 2;
      y = h - carH / 2 + 4;
      flipX = -1;
    } else {
      // Left edge → driving up (car faces left, slides up)
      const seg = d - 2 * w - h;
      x = -carW / 2 - 4;
      y = h - seg - carH / 2;
      flipX = -1;
    }

    car.style.transform = `translate(${x}px, ${y}px) scaleX(${flipX})`;
    raf.current = requestAnimationFrame(animate);
  }, [containerRef]);

  useEffect(() => {
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [animate]);

  return (
    <img
      ref={carRef}
      src="/teslacar.png"
      alt=""
      className="pointer-events-none absolute z-50 will-change-transform"
      style={{
        width: 'clamp(50px, 9vw, 82px)',
        height: 'auto',
        filter: 'drop-shadow(0 0 10px rgba(232,33,39,0.55)) drop-shadow(0 2px 5px rgba(0,0,0,0.4))',
        top: 0,
        left: 0,
      }}
    />
  );
};

const loginStyles = `
/* ===== BACKGROUND ===== */
.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 2s ease-in-out, transform 6s ease-in-out;
  will-change: opacity, transform;
}
.bg-slide.active { transform: scale(1.06); }
.bg-slide.inactive { transform: scale(1); }

/* ===== ROBOT ===== */
@keyframes robot-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  12% { transform: translateY(-7px) rotate(-3deg); }
  24% { transform: translateY(1px) rotate(2deg); }
  36% { transform: translateY(-11px) rotate(0deg); }
  48% { transform: translateY(0) rotate(-2deg); }
  60% { transform: translateY(-5px) rotate(3deg); }
  72% { transform: translateY(1px) rotate(0deg); }
  84% { transform: translateY(-8px) rotate(-2deg); }
}
@keyframes shadow-scale {
  0%, 100% { transform: scaleX(1); opacity: 0.22; }
  36% { transform: scaleX(0.6); opacity: 0.1; }
}
.optimus {
  animation: robot-bounce 2.4s ease-in-out infinite;
  transform-origin: bottom center;
  filter: drop-shadow(0 0 8px rgba(232,33,39,0.3));
  transition: filter 0.3s;
}
.optimus:hover { filter: drop-shadow(0 0 22px rgba(232,33,39,0.65)); }
.optimus-shadow {
  width: 34px; height: 5px;
  background: radial-gradient(ellipse, rgba(232,33,39,0.22) 0%, transparent 70%);
  border-radius: 50%; margin: 2px auto 0;
  animation: shadow-scale 2.4s ease-in-out infinite;
}

/* ===== CARD GLOW ===== */
@keyframes sweep { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
.card-glow { position: relative; }
.card-glow::before {
  content:''; position:absolute; inset:-1.5px; border-radius:inherit; padding:1.5px;
  background: linear-gradient(270deg,rgba(232,33,39,.45),rgba(232,33,39,.05),transparent,rgba(232,33,39,.05),rgba(232,33,39,.45));
  background-size:400% 100%; animation:sweep 6s ease-in-out infinite;
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none;
}

/* ===== PARTICLES ===== */
@keyframes rise {
  0%{opacity:0;transform:translateY(0) scale(0)}
  15%{opacity:.7;transform:translateY(-8px) scale(1)}
  85%{opacity:.2;transform:translateY(-50px) scale(.3)}
  100%{opacity:0;transform:translateY(-60px) scale(0)}
}
.spark { position:absolute; width:3px; height:3px; background:#e82127; border-radius:50%; pointer-events:none; animation:rise 3.5s ease-out infinite; }

/* ===== LOGO PULSE ===== */
@keyframes pulse { 0%{transform:scale(.85);opacity:.45} 50%{transform:scale(1.12);opacity:0} 100%{transform:scale(.85);opacity:0} }
.logo-ring { position:absolute; inset:-8px; border:1.5px solid rgba(232,33,39,.3); border-radius:50%; animation:pulse 3s ease-out infinite; pointer-events:none; }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, resendOtp } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [otpState, setOtpState] = useState({ open: false, email: '', code: '', verifying: false, resending: false });
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setBgIndex((p) => (p + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      if (result?.requiresVerification) { setOtpState((p) => ({ ...p, open: true, email: result.email, code: '' })); return; }
      if (result?.success) navigate('/');
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        setOtpState((p) => ({ ...p, open: true, email: error.response.data.email || form.email, code: '' }));
      }
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otpState.email || otpState.code.length !== 6) return;
    setOtpState((p) => ({ ...p, verifying: true }));
    try {
      await verifyOtp({ email: otpState.email, code: otpState.code });
      setOtpState({ open: false, email: '', code: '', verifying: false, resending: false });
      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({ icon:'success', title:'Verification Successful!',
        html:`<div style="text-align:center;color:#cbd5f5"><p style="margin:12px 0;font-size:15px">Your account has been verified.</p><div style="background:#0f1118;border-left:3px solid #e82127;padding:12px;border-radius:6px;margin:16px 0"><p style="margin:0;font-size:14px;color:#e82127">You can now access the dashboard</p></div><p style="margin:12px 0;font-size:12px;color:#546389">Redirecting to dashboard...</p></div>`,
        timer:2000, timerProgressBar:true, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false });
      navigate('/');
    } catch (_) {} finally { setOtpState((p) => ({ ...p, verifying: false })); }
  };

  const handleResendOtp = async () => {
    if (!otpState.email) return;
    setOtpState((p) => ({ ...p, resending: true }));
    try { await resendOtp(otpState.email); } catch (_) {} finally { setOtpState((p) => ({ ...p, resending: false })); }
  };

  return (
    <div className="relative flex min-h-screen flex-col safe-area-top safe-area-bottom touch-manipulation overflow-hidden">
      <style>{loginStyles}</style>

      {/* BG Slideshow */}
      {BG_IMAGES.map((img, i) => (
        <div key={img} className={`bg-slide ${i === bgIndex ? 'active' : 'inactive'}`}
          style={{ backgroundImage: `url(${img})`, opacity: i === bgIndex ? 1 : 0, zIndex: 0 }} />
      ))}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,.8) 0%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.7) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-28 z-[1]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.85), transparent)' }} />

      {/* Slide indicators + label */}
      <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-1.5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">{BG_LABELS[bgIndex]}</p>
        <div className="flex items-center gap-2">
          {BG_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setBgIndex(i)}
              className={`rounded-full transition-all duration-500 ${i === bgIndex ? 'h-2 w-7 bg-primary shadow shadow-primary/40' : 'h-2 w-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-8 lg:px-8">
        <div className="relative w-full max-w-md sm:max-w-lg animate-fade-in" style={{ overflow: 'visible' }}>

          {/* Car driving around the card border */}
          <BorderCar containerRef={cardRef} />

          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <span key={i} className="spark" style={{ left:`${8+i*12}%`, top:`${5+(i%4)*25}%`, animationDelay:`${i*.45}s`, animationDuration:`${3+(i%3)*.5}s` }} />
          ))}

          {/* Card */}
          <div ref={cardRef} className="card-glow rounded-2xl border border-white/[.08] bg-[#0a0b0f]/90 shadow-[0_25px_80px_rgba(0,0,0,.6)] backdrop-blur-2xl sm:rounded-3xl animate-scale-in">

            {/* Header */}
            <div className="border-b border-white/5 px-4 py-5 sm:px-8 sm:py-7">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 flex items-end justify-center gap-4 sm:mb-5 sm:gap-6">
                  {/* Left robot */}
                  <div className="flex flex-col items-center">
                    <div className="optimus"><img src="/optimus.png" alt="" className="h-12 w-auto object-contain sm:h-[68px] lg:h-20" /></div>
                    <div className="optimus-shadow" />
                  </div>
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    <div className="logo-ring" />
                    <div className="logo-ring" style={{ animationDelay: '1s' }} />
                    <img src="/main.png" alt="Tesla" className="relative h-16 w-16 object-contain sm:h-20 sm:w-20" />
                  </div>
                  {/* Right robot */}
                  <div className="flex flex-col items-center">
                    <div className="optimus" style={{ animationDelay: '.3s' }}><img src="/optimus.png" alt="" className="h-12 w-auto object-contain sm:h-[68px] lg:h-20" style={{ transform: 'scaleX(-1)' }} /></div>
                    <div className="optimus-shadow" style={{ animationDelay: '.3s' }} />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[.5em] text-primary/70 sm:text-xs">Tesla Ops</p>
                <h1 className="mt-1.5 font-heading text-lg font-bold text-white sm:mt-2 sm:text-2xl lg:text-[28px]">Manufacturing & Quality Vault</h1>
                <p className="mt-1 text-[11px] text-slate-400/80 sm:mt-1.5 sm:text-sm">Secure access for engineers and QA</p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-8 sm:py-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Email Address</span>
                  {form.email && <span className="text-[10px] text-primary/60 sm:text-xs">Valid</span>}
                </label>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  required autoComplete="email" inputMode="email" placeholder="engineer@tesla.com"
                  className={`w-full rounded-lg border bg-white/[.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all duration-300 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-base ${focusedField==='email'?'border-primary/50 bg-white/[.06] shadow-lg shadow-primary/10':'border-white/[.06] hover:border-white/15'}`} />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Password</span>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] uppercase tracking-[.2em] text-primary/80 transition hover:text-primary sm:text-xs">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  required autoComplete="current-password" placeholder="••••••••"
                  className={`w-full rounded-lg border bg-white/[.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all duration-300 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-base ${focusedField==='password'?'border-primary/50 bg-white/[.06] shadow-lg shadow-primary/10':'border-white/[.06] hover:border-white/15'}`} />
              </div>

              <button type="submit" disabled={loading || !form.email || !form.password}
                className="group relative mt-3 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-red-700 py-2.5 text-xs font-semibold uppercase tracking-[.3em] text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[.97] sm:rounded-xl sm:py-3.5 sm:text-sm">
                <span className="flex items-center justify-center gap-2">
                  {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Authenticating…</>) : 'Sign In'}
                </span>
              </button>

              <div className="relative my-3 sm:my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[.06]" /></div>
                <div className="relative flex justify-center text-[10px] text-slate-600 sm:text-xs"><span className="bg-[#0a0b0f] px-3">or</span></div>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Need access?{' '}
                  <Link to="/register" className="font-semibold text-primary transition-all hover:text-red-400 hover:underline underline-offset-2">Create an account</Link>
                </p>
              </div>
            </form>

            <div className="border-t border-white/5 px-4 py-3 sm:px-8 sm:py-4">
              <p className="text-center text-[10px] text-slate-500/70 sm:text-xs">Secure JWT authentication | Role-based access</p>
            </div>
          </div>
        </div>
      </div>

      <VerificationModal open={otpState.open} email={otpState.email} code={otpState.code}
        onCodeChange={(v) => setOtpState((p) => ({ ...p, code: v }))} onVerify={handleVerifyOtp} onResend={handleResendOtp}
        verifying={otpState.verifying} resending={otpState.resending}
        onClose={() => setOtpState({ open:false, email:'', code:'', verifying:false, resending:false })} />
      <Footer />
    </div>
  );
};

export default Login;
