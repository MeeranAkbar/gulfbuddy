import { AuthCard } from '../../../components/auth-card';
import { RegisterForm } from '../../../components/auth/register-form';

export const metadata = {
  title: 'Register - GulfBuddy Pro',
};

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath =
    resolvedSearchParams.next && resolvedSearchParams.next.startsWith('/') ? resolvedSearchParams.next : '/dashboard';

  return (
    <AuthCard
      eyebrow="Create Account"
      title="Join the Premium Network"
      copy="Register below to get instant access to the Seller Dashboard where you can manage listings, chat with buyers, and grow your presence."
    >
      <RegisterForm nextPath={nextPath} />
    </AuthCard>
  );
}
