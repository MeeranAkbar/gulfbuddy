import { AuthCard } from '../../../components/auth-card';
import { LoginForm } from '../../../components/auth/login-form';

export const metadata = {
  title: 'Sign In - GulfBuddy Pro',
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath =
    resolvedSearchParams.next && resolvedSearchParams.next.startsWith('/') ? resolvedSearchParams.next : '/dashboard';

  return (
    <AuthCard
      eyebrow="Welcome Back"
      title="Sign in to your account"
      copy="Enter your email and password to access the Seller Dashboard and manage your premium listings."
    >
      <LoginForm initialError={resolvedSearchParams.error ?? null} nextPath={nextPath} />
    </AuthCard>
  );
}
