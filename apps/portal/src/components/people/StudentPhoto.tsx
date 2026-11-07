'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PHOTO_MAX_BYTES,
  StudentSchema,
  type StudentPhotoResultData,
} from '@paideon/contracts';
import {
  Alert,
  Button,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  PhotoCapture,
  PrintSheet,
} from '@paideon/ui';

import { IdCardFlat } from '@/components/id-card/IdCardFlat';
import { useApiResource } from '@/hooks/useApiResource';
import { apiFetch } from '@/lib/api';
import { studentBadgeDetails } from '@/lib/badge';
import { studentBadgeRoute, studentRoute } from '@/lib/routes';

// Take or upload a student's photo for the badge. The photo is cropped to a
// square in the browser, so the preview is exactly what gets saved.
export function StudentPhoto({ id }: { id: string }) {
  const { data, error, loading, reload } = useApiResource(
    `/people/students/${encodeURIComponent(id)}`,
    StudentSchema,
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  if (loading && !data) return <LoadingSkeleton variant="section" />;
  if (!data)
    return <ErrorState variant="section" message={error} onRetry={reload} />;

  const student = data;
  const name = `${student.firstName} ${student.lastName}`;

  async function save() {
    if (!photo || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const form = new FormData();
      form.append('file', photo);
      const result = await apiFetch<StudentPhotoResultData>(
        `/people/students/${encodeURIComponent(student.id)}/photo`,
        { method: 'POST', body: form },
      );
      setSavedUrl(result.photoUrl);
      setPhoto(null);
    } catch (cause) {
      setSaveError(
        cause instanceof Error
          ? cause.message
          : 'The photo could not be saved. Try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-space-6">
      <PageHeader
        back={{ href: studentRoute(student.id), label: 'Back to profile' }}
        title={`Photo for ${name}`}
        description="Use the camera or upload a photo. Ask the student to face the camera, with the face in the middle."
      />

      {saveError && <Alert variant="error">{saveError}</Alert>}

      {savedUrl ? (
        <div className="flex flex-col gap-space-6">
          <Alert variant="success" title="Photo saved">
            Here is how the badge looks now.
          </Alert>
          <PrintSheet columns={1}>
            <IdCardFlat
              details={studentBadgeDetails({
                id: student.id,
                paideonId: student.paideonId,
                cardNumber: student.cardNumber,
                admissionNumber: student.admissionNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                displayName: student.displayName,
                photoUrl: savedUrl,
                grade: student.grade,
                section: student.section,
                status: student.status,
              })}
              photoUrl={savedUrl}
            />
          </PrintSheet>
          <div className="flex flex-wrap gap-space-3">
            <Link
              href={studentBadgeRoute(student.id)}
              className="font-body text-label uppercase tracking-label text-gold-base underline"
            >
              Print badge
            </Link>
            <Link
              href={studentRoute(student.id)}
              className="font-body text-label uppercase tracking-label text-gold-base underline"
            >
              Back to profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          <PhotoCapture
            onChange={setPhoto}
            currentUrl={student.photoUrl}
            maxBytes={PHOTO_MAX_BYTES}
            alt={`Current photo of ${name}`}
            disabled={saving}
          />
          <div className="flex justify-center">
            <Button
              onClick={() => void save()}
              disabled={!photo}
              loading={saving}
            >
              Save photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
