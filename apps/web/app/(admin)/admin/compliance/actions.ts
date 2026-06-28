'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export interface PropertyComplianceDocumentReviewActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  reviewState?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export async function reviewPropertyComplianceDocumentAction(
  _previousState: PropertyComplianceDocumentReviewActionState,
  formData: FormData
): Promise<PropertyComplianceDocumentReviewActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context?.adminRoles.length) {
    return {
      status: 'error',
      message: 'Admin access is required for compliance document review.'
    };
  }

  const documentId = getText(formData, 'documentId');
  const reviewState = getText(formData, 'reviewState');
  const notes = getText(formData, 'notes');

  if (!documentId || !reviewState) {
    return {
      status: 'error',
      message: 'Document and review state are required.'
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('set_property_compliance_document_review', {
    payload: {
      documentId,
      reviewState,
      notes: notes || null
    }
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const reviewedDocument = Array.isArray(data) ? data[0] : null;

  revalidatePath('/admin/compliance');
  revalidatePath('/listings');
  revalidatePath('/dashboard');

  return {
    status: 'success',
    message: `Evidence marked as ${reviewState.replace(/_/g, ' ')}.`,
    reviewState: reviewedDocument?.review_state
  };
}

export async function reviewPropertySubmissionAction(formData: FormData) {
  const context = await getAuthenticatedUserContext();

  if (!context?.adminRoles.length) {
    throw new Error('Admin access is required for property review actions.');
  }

  const listingId = getText(formData, 'listingId');
  const decision = getText(formData, 'decision');

  if (!listingId || !decision) {
    throw new Error('Listing and review decision are required.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('review_property_submission', {
    payload: {
      listingId,
      decision
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/compliance');
  revalidatePath('/listings');
  revalidatePath('/dashboard');
  revalidatePath('/property');
}
