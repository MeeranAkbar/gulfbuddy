'use server';

import { revalidatePath } from 'next/cache';
import { propertyComplianceDocumentSchema } from '@gulfbuddy/validation';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { runListingAutoChecks } from '../../../lib/risk/engine';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export interface PropertyReviewSubmissionActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  publicationState?: string;
  complianceState?: string;
  riskState?: string;
}

export interface PropertyComplianceDocumentActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  documentId?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value ? value : null;
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join('.') || 'form';
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function addPropertyComplianceDocumentAction(
  _previousState: PropertyComplianceDocumentActionState,
  formData: FormData
): Promise<PropertyComplianceDocumentActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before attaching compliance evidence.'
    };
  }

  const payload = {
    listingId: getText(formData, 'listingId'),
    documentType: getText(formData, 'documentType'),
    documentLabel: getText(formData, 'documentLabel'),
    accessUrl: getNullableText(formData, 'accessUrl'),
    storagePath: getNullableText(formData, 'storagePath'),
    fileName: getNullableText(formData, 'fileName'),
    mimeType: getNullableText(formData, 'mimeType'),
    notes: getNullableText(formData, 'notes')
  };

  const parsed = propertyComplianceDocumentSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the evidence details and try again.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('add_property_compliance_document', {
    payload: parsed.data
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const createdDocument = Array.isArray(data) ? data[0] : null;

  revalidatePath('/listings');
  revalidatePath('/admin/compliance');
  revalidatePath('/dashboard');

  return {
    status: 'success',
    message: 'Compliance evidence attached successfully. The property review lane can now inspect this record.',
    documentId: createdDocument?.document_id
  };
}

export async function submitPropertyForReviewAction(
  _previousState: PropertyReviewSubmissionActionState,
  formData: FormData
): Promise<PropertyReviewSubmissionActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before submitting a property listing for review.'
    };
  }

  const listingId = getText(formData, 'listingId');

  if (!listingId) {
    return {
      status: 'error',
      message: 'Listing reference is missing.'
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('submit_property_for_review', {
    payload: { listingId }
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const submission = Array.isArray(data) ? data[0] : null;
  const autoCheck = await runListingAutoChecks(listingId, 'property');

  revalidatePath('/listings');
  revalidatePath('/dashboard');
  revalidatePath('/admin/compliance');
  revalidatePath('/admin/risk');

  return {
    status: 'success',
    message:
      autoCheck.publicationState === 'rejected'
        ? 'Property submitted into the regulated lane, then blocked by the risk engine and routed to urgent admin review.'
        : autoCheck.publicationState === 'pending_review' || autoCheck.publicationState === 'flagged'
          ? 'Property submitted successfully and flagged for additional risk review before any publish decision.'
          : 'Property submitted successfully and passed the first automated trust checks before admin review.',
    publicationState: autoCheck.publicationState || submission?.publication_state,
    complianceState: submission?.compliance_state,
    riskState: autoCheck.riskState
  };
}
