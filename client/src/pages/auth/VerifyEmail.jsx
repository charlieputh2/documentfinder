import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { setAuthToken } from '../../lib/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
          setError('Invalid verification link. Please check your email and try again.');
          setLoading(false);
          return;
        }

        const response = await api.get('/auth/verify-email', {
          params: { token, email }
        });

        if (response.data.token) {
          localStorage.setItem('df_token', response.data.token);
          setAuthToken(response.data.token);
        }

        setVerified(true);
        setLoading(false);
        toast.success('Account verified successfully!');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        const message = err.response?.data?.message || 'Unable to verify email. The link may have expired.';
        setError(message);
        toast.error(message);
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 py-10 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#0e0f13]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <img src="/logo.png" alt="Tesla" className="h-12 w-12 object-contain sm:h-14 sm:w-14 drop-shadow-lg" />
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-primary/80 sm:mt-3">Tesla Ops</p>
          <h1 className="font-heading text-xl text-white sm:text-2xl">Email Verification</h1>
        </div>

        {loading ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
            </div>
            <p className="text-center text-sm text-slate-400">Verifying your account...</p>
            <p className="text-center text-xs text-slate-500">This will only take a moment</p>
          </div>
        ) : verified ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/50">
                <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">Account Verified!</p>
              <p className="mt-2 text-sm text-slate-400">Your email has been verified successfully.</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Redirecting to dashboard...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-500/50">
                <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">Verification Failed</p>
              <p className="mt-2 text-sm text-slate-400">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 active:scale-95 touch-manipulation"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
