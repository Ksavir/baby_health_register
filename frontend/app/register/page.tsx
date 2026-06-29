'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldPlus } from 'lucide-react';
import { registerUser } from '@/graphql/auth';
import { saveUser } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser(email, password);
      saveUser(user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-[#d9e4de] bg-white/95 p-6 shadow-paper">
        <div className="mb-6 flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-[#0f3d3e] text-white">
            <ShieldPlus size={22} />
          </span>
          <div>
            <h1 className="font-display text-3xl font-black text-[#102f2f]">Create account</h1>
            <p className="mt-1 text-sm text-[#637a75]">Start tracking a real health record.</p>
          </div>
        </div>

        {error && <p className="mb-4 rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

        <div className="grid gap-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="mt-5 w-full">
          {loading ? 'Creating account...' : 'Create account'}
          <ArrowRight size={17} />
        </Button>

        <p className="mt-5 text-center text-sm text-[#637a75]">
          Already have an account?{' '}
          <Link href="/login" className="font-black text-[#0f3d3e] underline decoration-[#f0b35b] decoration-2 underline-offset-4">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
