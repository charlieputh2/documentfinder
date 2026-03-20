import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import VerificationModal from '../../components/auth/VerificationModal.jsx';
import Footer from '../../components/common/Footer.jsx';

const BG_IMAGES = ['/cybertruck.png', '/model3.png'];

const loginStyles = `
/* ===== BACKGROUND SLIDESHOW ===== */
.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 2s ease-in-out;
}

.bg-slide.active {
  animation: bg-zoom 6s ease-in-out forwards;
}

@keyframes bg-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

/* ===== TESLA CAR — HORIZONTAL DRIVE ONLY (NO ROTATION) ===== */
/* Car drives left-to-right along the top, then right-to-left along the bottom */
/* It stays flat — only flips horizontally when reversing direction */

@keyframes car-drive {
  /* Start off-screen left, drive right across the top */
  0%   { left: -80px; top: -18px; transform: scaleX(1); }
  45%  { left: calc(100% + 10px); top: -18px; transform: scaleX(1); }
  /* Teleport to bottom-right, face left */
  45.1% { left: calc(100% + 10px); top: calc(100% - 12px); transform: scaleX(-1); }
  /* Drive left across the bottom */
  90%  { left: -80px; top: calc(100% - 12px); transform: scaleX(-1); }
  /* Teleport back to top-left, face right */
  90.1% { left: -80px; top: -18px; transform: scaleX(1); }
  100% { left: -80px; top: -18px; transform: scaleX(1); }
}

.tesla-car {
  position: absolute;
  width: clamp(55px, 9vw, 85px);
  height: auto;
  z-index: 50;
  pointer-events: none;
  filter: drop-shadow(0 0 12px rgba(232, 33, 39, 0.5))
          drop-shadow(0 3px 6px rgba(0,0,0,0.4));
  animation: car-drive 8s ease-in-out infinite;
}

/* Red tail light trail */
.car-trail {
  position: absolute;
  width: clamp(30px, 5vw, 50px);
  height: 2px;
  z-index: 49;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(232, 33, 39, 0.5));
  border-radius: 1px;
  animation: car-drive 8s ease-in-out infinite;
  filter: blur(1px);
}

/* ===== OPTIMUS ROBOT DANCE ===== */
@keyframes robot-dance {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  10%  { transform: translateY(-6px) rotate(-3deg); }
  20%  { transform: translateY(0) rotate(2deg); }
  30%  { transform: translateY(-10px) rotate(0deg); }
  40%  { transform: translateY(0) rotate(-2deg); }
  50%  { transform: translateY(-4px) rotate(3deg); }
  60%  { transform: translateY(0) rotate(0deg); }
  70%  { transform: translateY(-8px) rotate(-2deg); }
  80%  { transform: translateY(0) rotate(2deg); }
  90%  { transform: translateY(-5px) rotate(0deg); }
}

@keyframes robot-shadow-pulse {
  0%, 100% { transform: scaleX(1); opacity: 0.25; }
  30% { transform: scaleX(0.65); opacity: 0.12; }
  70% { transform: scaleX(0.7); opacity: 0.15; }
}

.optimus-robot {
  animation: robot-dance 2.2s ease-in-out infinite;
  transform-origin: bottom center;
  filter: drop-shadow(0 0 8px rgba(232, 33, 39, 0.3));
  transition: filter 0.3s;
}

.optimus-robot:hover {
  filter: drop-shadow(0 0 20px rgba(232, 33, 39, 0.6));
}

.robot-shadow {
  width: 36px;
  height: 5px;
  background: radial-gradient(ellipse, rgba(232, 33, 39, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  margin: 2px auto 0;
  animation: robot-shadow-pulse 2.2s ease-in-out infinite;
}

/* ===== CARD GLOW BORDER ===== */
@keyframes border-sweep {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-glow {
  position: relative;
}

.card-glow::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(
    270deg,
    rgba(232, 33, 39, 0.5),
    rgba(232, 33, 39, 0.05),
    transparent,
    rgba(232, 33, 39, 0.05),
    rgba(232, 33, 39, 0.5)
  );
  background-size: 400% 100%;
  animation: border-sweep 6s ease-in-out infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* ===== FLOATING PARTICLES ===== */
@keyframes particle-rise {
  0%   { opacity: 0; transform: translateY(0) scale(0); }
  15%  { opacity: 0.8; transform: translateY(-8px) scale(1); }
  85%  { opacity: 0.3; transform: translateY(-50px) scale(0.3); }
  100% { opacity: 0; transform: translateY(-60px) scale(0); }
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #e82127;
  border-radius: 50%;
  pointer-events: none;
  animation: particle-rise 3.5s ease-out infinite;
}

/* ===== LOGO PULSE ===== */
@keyframes pulse-ring {
  0%   { transform: scale(0.85); opacity: 0.5; }
  50%  { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(0.85); opacity: 0; }
}

.logo-pulse {
  position: absolute;
  inset: -8px;
  border: 1.5px solid rgba(232, 33, 39, 0.35);
  border-radius: 50%;
  animation: pulse-ring 3s ease-out infinite;
  pointer-events: none;
}

/* ===== BG SLIDE INDICATOR ===== */
.slide-dot {
  transition: all 0.5s ease;
}
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

  // Background slideshow — 5 second interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      if (result?.requiresVerification) {
        setOtpState((prev) => ({ ...prev, open: true, email: result.email, code: '' }));
        return;
      }
      if (result?.success) {
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        setOtpState((prev) => ({ ...prev, open: true, email: error.response.data.email || form.email, code: '' }));
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpState.email || otpState.code.length !== 6) return;
    setOtpState((prev) => ({ ...prev, verifying: true }));
    try {
      await verifyOtp({ email: otpState.email, code: otpState.code });
      setOtpState({ open: false, email: '', code: '', verifying: false, resending: false });
      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        icon: 'success',
        title: 'Verification Successful!',
        html: `
          <div style="text-align: center; color: #cbd5f5;">
            <p style="margin: 12px 0; font-size: 15px;">Your account has been verified.</p>
            <div style="background: #0f1118; border-left: 3px solid #e82127; padding: 12px; border-radius: 6px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #e82127;">You can now access the dashboard</p>
            </div>
            <p style="margin: 12px 0; font-size: 12px; color: #546389;">Redirecting to dashboard...</p>
          </div>
        `,
        timer: 2000, timerProgressBar: true, showConfirmButton: false,
        allowOutsideClick: false, allowEscapeKey: false
      });
      navigate('/');
    } catch (error) {
      // toast shows error
    } finally {
      setOtpState((prev) => ({ ...prev, verifying: false }));
    }
  };

  const handleResendOtp = async () => {
    if (!otpState.email) return;
    setOtpState((prev) => ({ ...prev, resending: true }));
    try {
      await resendOtp(otpState.email);
    } catch (error) {
      // toast already displayed
    } finally {
      setOtpState((prev) => ({ ...prev, resending: false }));
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col safe-area-top safe-area-bottom touch-manipulation overflow-hidden">
      <style>{loginStyles}</style>

      {/* ===== BACKGROUND SLIDESHOW ===== */}
      {BG_IMAGES.map((img, i) => (
        <div
          key={img}
          className={`bg-slide ${i === bgIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${img})`,
            opacity: i === bgIndex ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}
      {/* Gradient overlay — darker at center for card readability, lighter at edges to show car */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[1]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
      />

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            className={`slide-dot rounded-full ${
              i === bgIndex
                ? 'h-2 w-7 bg-primary shadow-md shadow-primary/40'
                : 'h-2 w-2 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Car name label */}
      <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 z-[60]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition-opacity duration-500">
          {bgIndex === 0 ? 'Cybertruck' : 'Model 3'}
        </p>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-8 lg:px-8">
        <div className="relative w-full max-w-md sm:max-w-lg animate-fade-in" style={{ overflow: 'visible' }}>

          {/* Tesla Car — drives across top then bottom, no flipping/rotation */}
          <img src="/teslacar.png" alt="" className="tesla-car" />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${8 + i * 12}%`,
                top: `${5 + (i % 4) * 25}%`,
                animationDelay: `${i * 0.45}s`,
                animationDuration: `${3 + (i % 3) * 0.5}s`,
              }}
            />
          ))}

          {/* ===== CARD ===== */}
          <div className="card-glow rounded-2xl border border-white/[0.08] bg-[#0a0b0f]/90 shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:rounded-3xl animate-scale-in">

            {/* Header */}
            <div className="border-b border-white/5 px-4 py-5 sm:px-8 sm:py-7">
              <div className="flex flex-col items-center text-center">

                {/* Robot + Logo + Robot */}
                <div className="relative mb-4 flex items-end justify-center gap-4 sm:mb-5 sm:gap-6">
                  {/* Left Optimus */}
                  <div className="flex flex-col items-center">
                    <div className="optimus-robot">
                      <img src="/optimus.png" alt="Optimus" className="h-12 w-auto object-contain sm:h-[68px] lg:h-20" />
                    </div>
                    <div className="robot-shadow" />
                  </div>

                  {/* Tesla Logo with pulse rings */}
                  <div className="relative flex-shrink-0">
                    <div className="logo-pulse" />
                    <div className="logo-pulse" style={{ animationDelay: '1s' }} />
                    <img src="/main.png" alt="Tesla" className="relative h-16 w-16 object-contain sm:h-20 sm:w-20" />
                  </div>

                  {/* Right Optimus (mirrored, offset) */}
                  <div className="flex flex-col items-center">
                    <div className="optimus-robot" style={{ animationDelay: '0.3s' }}>
                      <img src="/optimus.png" alt="Optimus" className="h-12 w-auto object-contain sm:h-[68px] lg:h-20" style={{ transform: 'scaleX(-1)' }} />
                    </div>
                    <div className="robot-shadow" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>

                {/* Branding */}
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary/70 sm:text-xs">Tesla Ops</p>
                <h1 className="mt-1.5 font-heading text-lg font-bold text-white sm:mt-2 sm:text-2xl lg:text-[28px]">
                  Manufacturing & Quality Vault
                </h1>
                <p className="mt-1 text-[11px] text-slate-400/80 sm:mt-1.5 sm:text-sm">
                  Secure access for engineers and QA
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-8 sm:py-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Email Address</span>
                  {form.email && <span className="text-[10px] text-primary/60 sm:text-xs">Valid</span>}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="email"
                  inputMode="email"
                  className={`w-full rounded-lg border bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all duration-300 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-base ${
                    focusedField === 'email'
                      ? 'border-primary/50 bg-white/[0.06] shadow-lg shadow-primary/10'
                      : 'border-white/[0.06] hover:border-white/15'
                  }`}
                  placeholder="engineer@tesla.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] uppercase tracking-[0.2em] text-primary/80 transition hover:text-primary sm:text-xs"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="current-password"
                  className={`w-full rounded-lg border bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all duration-300 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-base ${
                    focusedField === 'password'
                      ? 'border-primary/50 bg-white/[0.06] shadow-lg shadow-primary/10'
                      : 'border-white/[0.06] hover:border-white/15'
                  }`}
                  placeholder="••••••••"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !form.email || !form.password}
                className="group relative mt-3 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-red-700 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] sm:rounded-xl sm:py-3.5 sm:text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Authenticating…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative my-3 sm:my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-[10px] text-slate-600 sm:text-xs">
                  <span className="bg-[#0a0b0f] px-3">or</span>
                </div>
              </div>

              {/* Sign Up */}
              <div className="text-center">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Need access?{' '}
                  <Link to="/register" className="font-semibold text-primary transition-all hover:text-red-400 hover:underline underline-offset-2">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

            {/* Card Footer */}
            <div className="border-t border-white/5 px-4 py-3 sm:px-8 sm:py-4">
              <p className="text-center text-[10px] text-slate-500/70 sm:text-xs">
                Secure JWT authentication | Role-based access
              </p>
            </div>
          </div>
        </div>
      </div>

      <VerificationModal
        open={otpState.open}
        email={otpState.email}
        code={otpState.code}
        onCodeChange={(value) => setOtpState((prev) => ({ ...prev, code: value }))}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        verifying={otpState.verifying}
        resending={otpState.resending}
        onClose={() => setOtpState({ open: false, email: '', code: '', verifying: false, resending: false })}
      />

      <Footer />
    </div>
  );
};

export default Login;
