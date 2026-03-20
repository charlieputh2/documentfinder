import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import VerificationModal from '../../components/auth/VerificationModal.jsx';
import Footer from '../../components/common/Footer.jsx';

const loginAnimations = `
/* Tesla car smoothly driving around the card border */
@keyframes drive-top {
  0% { left: -60px; top: -24px; }
  100% { left: calc(100% - 20px); top: -24px; }
}
@keyframes drive-right {
  0% { left: calc(100% - 20px); top: -24px; }
  100% { left: calc(100% - 20px); top: calc(100% - 16px); }
}
@keyframes drive-bottom {
  0% { left: calc(100% - 20px); top: calc(100% - 16px); }
  100% { left: -60px; top: calc(100% - 16px); }
}
@keyframes drive-left {
  0% { left: -60px; top: calc(100% - 16px); }
  100% { left: -60px; top: -24px; }
}

.tesla-car {
  position: absolute;
  width: clamp(60px, 10vw, 90px);
  height: auto;
  z-index: 50;
  pointer-events: none;
  filter: drop-shadow(0 0 12px rgba(232, 33, 39, 0.5)) drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  animation: drive-top 3s linear 0s,
             drive-right 2.5s linear 3s,
             drive-bottom 3s linear 5.5s,
             drive-left 2.5s linear 8.5s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation: drive-circuit 11s linear infinite;
}

@keyframes drive-circuit {
  0% { left: -60px; top: -24px; transform: scaleX(1); }
  27% { left: calc(100% - 20px); top: -24px; transform: scaleX(1); }
  27.5% { left: calc(100% - 20px); top: -24px; transform: scaleX(1) rotate(90deg); }
  49.5% { left: calc(100% - 20px); top: calc(100% - 16px); transform: scaleX(1) rotate(90deg); }
  50% { left: calc(100% - 20px); top: calc(100% - 16px); transform: scaleX(-1); }
  77% { left: -60px; top: calc(100% - 16px); transform: scaleX(-1); }
  77.5% { left: -60px; top: calc(100% - 16px); transform: scaleX(-1) rotate(90deg); }
  99.5% { left: -60px; top: -24px; transform: scaleX(-1) rotate(90deg); }
  100% { left: -60px; top: -24px; transform: scaleX(1); }
}

/* Red glow trail behind the car */
.tesla-car::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(232, 33, 39, 0.6));
  border-radius: 2px;
  bottom: 2px;
  left: -25px;
}

/* Optimus robot dancing animation */
@keyframes robot-dance {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  10% { transform: translateY(-6px) rotate(-3deg); }
  20% { transform: translateY(0) rotate(3deg); }
  30% { transform: translateY(-8px) rotate(0deg) scaleY(1.02); }
  40% { transform: translateY(0) rotate(-2deg) scaleY(0.98); }
  50% { transform: translateY(-5px) rotate(2deg); }
  60% { transform: translateY(0) rotate(-3deg) scaleX(1.02); }
  70% { transform: translateY(-7px) rotate(0deg); }
  80% { transform: translateY(0) rotate(3deg) scaleY(1.01); }
  90% { transform: translateY(-4px) rotate(-2deg); }
}

@keyframes robot-glow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(232, 33, 39, 0.3)); }
  50% { filter: drop-shadow(0 0 20px rgba(232, 33, 39, 0.6)) drop-shadow(0 0 40px rgba(232, 33, 39, 0.2)); }
}

@keyframes robot-hover {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.optimus-robot {
  animation: robot-dance 2.5s ease-in-out infinite, robot-glow 3s ease-in-out infinite;
  transform-origin: bottom center;
}

/* Subtle floating particles around the card */
@keyframes float-particle {
  0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
  20% { opacity: 1; transform: translateY(-10px) scale(1); }
  80% { opacity: 0.5; transform: translateY(-40px) scale(0.5); }
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #e82127;
  border-radius: 50%;
  pointer-events: none;
  animation: float-particle 3s ease-in-out infinite;
}

/* Red accent line animation on card border */
@keyframes border-glow {
  0% { opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { opacity: 0.3; }
}

.card-border-glow {
  position: relative;
}

.card-border-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(232,33,39,0.4), transparent 40%, transparent 60%, rgba(232,33,39,0.4));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-glow 4s ease-in-out infinite;
  pointer-events: none;
}

/* Headlight beams */
@keyframes headlight {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, resendOtp } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [otpState, setOtpState] = useState({ open: false, email: '', code: '', verifying: false, resending: false });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);

      if (result?.requiresVerification) {
        setOtpState((prev) => ({
          ...prev,
          open: true,
          email: result.email,
          code: ''
        }));
        return;
      }

      if (result?.success) {
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        setOtpState((prev) => ({
          ...prev,
          open: true,
          email: error.response.data.email || form.email,
          code: ''
        }));
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
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
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

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-secondary safe-area-top safe-area-bottom touch-manipulation overflow-hidden">
      <style>{loginAnimations}</style>

      {/* Main container */}
      <div className="flex flex-1 flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-8 lg:px-8">
        <div className="relative w-full max-w-md sm:max-w-lg animate-fade-in" style={{ overflow: 'visible' }}>

          {/* Tesla Car driving around the card */}
          <img src="/teslacar.png" alt="" className="tesla-car" />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2.5 + i * 0.3}s`,
              }}
            />
          ))}

          {/* Card */}
          <div className="card-border-glow rounded-2xl border border-white/10 bg-[#0e0f13]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl animate-scale-in">
            {/* Header with logo + Robot */}
            <div className="border-b border-white/5 px-4 py-4 sm:px-8 sm:py-6 lg:py-8">
              <div className="flex flex-col items-center text-center">
                {/* Tesla Logo + Optimus side by side */}
                <div className="relative mb-4 flex items-end justify-center gap-3 sm:mb-6 sm:gap-5">
                  {/* Optimus Robot - Dancing */}
                  <div className="optimus-robot flex-shrink-0">
                    <img
                      src="/optimus.png"
                      alt="Optimus"
                      className="h-14 w-auto object-contain sm:h-20 lg:h-24"
                    />
                  </div>

                  {/* Tesla Logo */}
                  <div className="flex-shrink-0">
                    <img
                      src="/main.png"
                      alt="Tesla"
                      className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                    />
                  </div>

                  {/* Mirrored Optimus Robot */}
                  <div className="optimus-robot flex-shrink-0" style={{ animationDelay: '0.3s' }}>
                    <img
                      src="/optimus.png"
                      alt="Optimus"
                      className="h-14 w-auto object-contain sm:h-20 lg:h-24"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  </div>
                </div>

                {/* Branding */}
                <p className="text-xs uppercase tracking-[0.4em] text-primary/80 sm:text-sm">Tesla Ops</p>
                <h1 className="mt-2 font-heading text-xl font-bold text-white sm:mt-3 sm:text-2xl lg:text-3xl">
                  Manufacturing & Quality Vault
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">
                  Secure access for engineers and QA
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-3 px-4 py-4 sm:space-y-5 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Email Address</span>
                  {form.email && (
                    <span className="text-xs text-primary/70">Valid</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="email"
                    inputMode="email"
                    className={`w-full rounded-lg border bg-black/30 px-4 py-2.5 text-sm sm:text-base text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 touch-manipulation tap-highlight ${
                      focusedField === 'email'
                        ? 'border-primary/60 shadow-lg shadow-primary/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="engineer@tesla.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-slate-300 sm:text-sm">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs uppercase tracking-[0.2em] text-primary transition hover:text-primary/80"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => handleChange('password', event.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="current-password"
                    className={`w-full rounded-lg border bg-black/30 px-4 py-2.5 text-sm sm:text-base text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none sm:rounded-xl sm:px-5 sm:py-3.5 touch-manipulation tap-highlight ${
                      focusedField === 'password'
                        ? 'border-primary/60 shadow-lg shadow-primary/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.email || !form.password}
                className="group relative mt-4 w-full overflow-hidden rounded-lg bg-primary py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 sm:rounded-xl sm:py-3.5 sm:text-sm touch-manipulation tap-highlight"
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
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-500">
                  <span className="bg-[#0e0f13] px-2">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Need access?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary transition-all hover:text-primary/80 hover:underline underline-offset-2"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="border-t border-white/5 px-4 py-4 sm:px-8 sm:py-5">
              <p className="text-center text-xs text-slate-500">
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
