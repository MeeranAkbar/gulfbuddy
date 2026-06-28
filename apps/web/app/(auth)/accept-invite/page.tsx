import Link from 'next/link';
import { AuthCard } from '../../../components/auth-card';
import { AcceptCompanyInviteForm } from '../../../components/company/accept-company-invite-form';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { acceptCompanyInviteAction } from './actions';

interface AcceptInvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

interface InviteSummary {
  invite_id: string;
  company_id: string;
  company_display_name: string;
  company_type: string;
  email: string;
  role: string;
  branch_name: string | null;
  invite_status: string;
  expires_at: string;
}

export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const resolvedSearchParams = await searchParams;
  const token = (resolvedSearchParams.token || '').trim();

  if (!token) {
    return (
      <AuthCard
        title="Invite link missing"
        copy="The company invite could not be opened because the secure token is missing from the URL."
      >
        <p className="text-sm leading-7 text-slate-600">Ask the company owner or admin to generate a fresh invite link from the workspace.</p>
      </AuthCard>
    );
  }

  const supabase = await createSupabaseServerClient();
  const [{ data }, context] = await Promise.all([
    supabase.rpc('inspect_company_member_invite', {
      payload: {
        token
      }
    }),
    getAuthenticatedUserContext()
  ]);

  const invite = (Array.isArray(data) ? data[0] : null) as InviteSummary | null;

  if (!invite) {
    return (
      <AuthCard
        title="Invite unavailable"
        copy="This company invite is invalid, expired, or has already been used."
      >
        <p className="text-sm leading-7 text-slate-600">Ask the company admin for a fresh invite if you still need workspace access.</p>
      </AuthCard>
    );
  }

  const nextPath = `/accept-invite?token=${encodeURIComponent(token)}`;

  if (!context) {
    return (
      <AuthCard
        title={`Join ${invite.company_display_name}`}
        copy={`You have been invited to join ${invite.company_display_name} as ${invite.role}${invite.branch_name ? ` for ${invite.branch_name}` : ''}. Sign in or create the invited account first.`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
            <p>
              Invited email: <span className="font-medium text-slate-950">{invite.email}</span>
            </p>
            <p>
              Invite expires: <span className="font-medium text-slate-950">{new Date(invite.expires_at).toLocaleString()}</span>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              href={`/login?next=${encodeURIComponent(nextPath)}`}
            >
              Sign in to accept
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              href={`/register?next=${encodeURIComponent(nextPath)}`}
            >
              Create the invited account
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  const signedInEmail = (context.email || '').toLowerCase();
  const invitedEmail = invite.email.toLowerCase();
  const emailMismatch = Boolean(signedInEmail && invitedEmail && signedInEmail !== invitedEmail);

  return (
    <AuthCard
      title={`Accept your ${invite.company_display_name} invite`}
      copy={`This invite grants the ${invite.role} role${invite.branch_name ? ` for ${invite.branch_name}` : ''}. Accept it only if you should join this company workspace.`}
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
          <p>
            Company: <span className="font-medium text-slate-950">{invite.company_display_name}</span>
          </p>
          <p>
            Invited email: <span className="font-medium text-slate-950">{invite.email}</span>
          </p>
          <p>
            Signed in as: <span className="font-medium text-slate-950">{context.email || 'unknown email'}</span>
          </p>
          <p>
            Invite expires: <span className="font-medium text-slate-950">{new Date(invite.expires_at).toLocaleString()}</span>
          </p>
        </div>

        {emailMismatch ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
            Sign in with the invited email address before accepting this seat. The current account does not match the invite email.
          </div>
        ) : (
          <AcceptCompanyInviteForm token={token} action={acceptCompanyInviteAction} />
        )}
      </div>
    </AuthCard>
  );
}
