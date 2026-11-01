'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  MyProfileSchema,
  UpdateMyContactSchema,
  type MyProfileData,
} from '@paideon/contracts';
import {
  Alert,
  Avatar,
  Button,
  ErrorState,
  FormErrorMessage,
  FormSectionWrapper,
  Input,
  KeyValueList,
  LoadingSkeleton,
  PageHeader,
  Text,
} from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { ApiError, apiFetch } from '@/lib/api';
import { badgeDetails } from '@/lib/badge';
import { fieldErrors } from '@/lib/form-errors';

export function MyProfile() {
  const { data, error, loading, reload } = useApiResource(
    '/me/profile',
    MyProfileSchema,
  );
  const [saved, setSaved] = useState<MyProfileData | null>(null);
  const profile = saved ?? data;

  if (loading && !profile) return <LoadingSkeleton />;
  if (!profile) {
    return (
      <ErrorState
        variant="section"
        message={error || 'Could not load your profile.'}
        onRetry={reload}
      />
    );
  }

  const details = badgeDetails(profile);
  const name = profile.displayName || details.fullName;

  return (
    <div className="flex flex-col gap-space-8">
      <div className="flex items-start gap-space-4">
        <Avatar name={details.fullName} src={profile.photoUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <PageHeader
            title={name}
            description={`${details.roleLabel} · ${profile.paideonId}`}
          />
        </div>
      </div>

      <section aria-labelledby="core-data">
        <FormSectionWrapper
          title="Your school record"
          description="To change anything here, ask the school office."
        >
          <div id="core-data">
            <KeyValueList
              items={[
                { label: 'Name', value: details.fullName },
                { label: 'Paideon ID', value: profile.paideonId },
                {
                  label: details.detailLabel === 'GRADE' ? 'Class' : 'Post',
                  value: details.detailValue,
                },
                {
                  label:
                    details.numberLabel === 'ADMISSION NO.'
                      ? 'Admission number'
                      : 'Staff number',
                  value: profile.admissionNumber ?? profile.employeeId,
                },
                { label: 'School email', value: profile.email },
                { label: 'Library card', value: profile.cardNumber },
              ]}
            />
          </div>
        </FormSectionWrapper>
      </section>

      <ContactForm profile={profile} onSaved={setSaved} />
    </div>
  );
}

function ContactForm({
  profile,
  onSaved,
}: {
  profile: MyProfileData;
  onSaved: (profile: MyProfileData) => void;
}) {
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [address, setAddress] = useState(profile.address ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Follow the saved values (the server may tidy them, e.g. trim spaces).
  useEffect(() => {
    setPhone(profile.phone ?? '');
    setAddress(profile.address ?? '');
  }, [profile.phone, profile.address]);

  const unchanged =
    phone.trim() === (profile.phone ?? '') &&
    (!profile.addressEditable || address.trim() === (profile.address ?? ''));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setJustSaved(false);

    const parsed = UpdateMyContactSchema.safeParse({
      phone,
      // Never send an address the server would refuse.
      address: profile.addressEditable ? address : (profile.address ?? ''),
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const body = await apiFetch<unknown>('/me/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const updated = MyProfileSchema.safeParse(body);
      if (updated.success) onSaved(updated.data);
      setJustSaved(true);
    } catch (cause) {
      setFormError(
        cause instanceof ApiError
          ? cause.message
          : 'Could not save. Check your connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FormSectionWrapper
        title="Contact details"
        description="The school uses these to reach you. You can change them any time."
      >
        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
        {profile.addressEditable ? (
          <Input
            label="Home address"
            name="address"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
          />
        ) : (
          <Text variant="body-sm" color="muted">
            Your account has no home address on file. Ask the school office if
            it should have one.
          </Text>
        )}
        {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
        {justSaved && (
          <Alert variant="success">Your contact details were saved.</Alert>
        )}
        <div>
          <Button
            type="submit"
            loading={saving}
            loadingText="Saving"
            disabled={unchanged}
          >
            Save changes
          </Button>
        </div>
      </FormSectionWrapper>
    </form>
  );
}
