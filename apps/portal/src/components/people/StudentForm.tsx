'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreateStudentSchema,
  MAX_GRADE,
  MIN_GRADE,
  UpdateStudentSchema,
  type StudentData,
} from '@paideon/contracts';
import {
  Alert,
  Button,
  FormFieldGroup,
  FormSectionWrapper,
  FormStickyFooter,
  FormValidationSummary,
  Input,
  PageHeader,
  Radio,
  Select,
} from '@paideon/ui';

import { ClassPicker } from '@/components/common/ClassPicker';
import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrorsByPath } from '@/lib/form-errors';
import { ROUTES, studentPhotoRoute, studentRoute } from '@/lib/routes';
import {
  bodyFromForm,
  emptyGuardian,
  emptyStudentForm,
  formFromStudent,
  type StudentFormState,
} from '@/lib/student-form';

import { GuardianFields } from './GuardianFields';
import { OptionalChoiceField } from './OptionalChoiceField';

const RELIGIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity'] as const;
const ETHNICITIES = [
  'Sinhalese',
  'Sri Lankan Tamil',
  'Indian Tamil',
  'Sri Lankan Moor',
  'Burgher',
  'Malay',
] as const;

const grades = Array.from(
  { length: MAX_GRADE - MIN_GRADE + 1 },
  (_, i) => MIN_GRADE + i,
);
const gradeOptions = [
  { value: '', label: 'Choose…' },
  ...grades.map((grade) => ({ value: String(grade), label: `Grade ${grade}` })),
];

type Props =
  | { mode: 'create'; student?: undefined }
  | { mode: 'edit'; student: StudentData };

const fieldRow = 'grid gap-space-4 sm:grid-cols-2';

// One form for adding and editing a student. The same shared schemas check it
// here and again on the server.
export function StudentForm(props: Props) {
  const router = useRouter();
  const { mode, student } = props;
  const [state, setState] = useState<StudentFormState>(
    student ? formFromStudent(student) : emptyStudentForm(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<{
    id: string;
    name: string;
    paideonId: string;
  } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // In edit mode some parts may be hidden from this viewer; leave those alone.
  const showSensitive = mode === 'create' || student.sensitiveVisible;
  const showGuardians =
    mode === 'create' ||
    student.guardians.every((guardian) => guardian.phone !== null);

  const set = (changes: Partial<StudentFormState>) =>
    setState((current) => ({ ...current, ...changes }));
  const text =
    (key: keyof StudentFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      set({ [key]: event.target.value } as Partial<StudentFormState>);

  const currentGrade =
    state.currentGrade === '' ? undefined : Number(state.currentGrade);
  const allErrors = Object.values(errors);

  async function submit(addAnother: boolean) {
    if (busy) return;
    setServerError('');
    setAdded(null);
    const body = bodyFromForm(state, {
      includeSensitive: showSensitive,
      includeGuardians: showGuardians,
      includeEmail: mode === 'create',
    });
    const parsed = (
      mode === 'create' ? CreateStudentSchema : UpdateStudentSchema
    ).safeParse(body);
    if (!parsed.success) {
      setErrors(fieldErrorsByPath(parsed.error.issues));
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      if (mode === 'create') {
        const created = await apiFetch<{ id: string; paideonId: string }>(
          '/people/students',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
          },
        );
        if (addAnother) {
          setAdded({
            id: created.id,
            paideonId: created.paideonId,
            name: `${state.firstName} ${state.lastName}`,
          });
          setState(emptyStudentForm());
          setBusy(false);
          topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          return;
        }
        router.push(`${studentRoute(created.id)}?created=1`);
      } else {
        await apiFetch(`/people/students/${encodeURIComponent(student.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });
        router.push(studentRoute(student.id));
      }
    } catch (cause) {
      setBusy(false);
      if (cause instanceof ApiError && cause.fieldErrors) {
        setErrors(cause.fieldErrors);
      } else {
        setServerError(
          cause instanceof Error
            ? cause.message
            : 'Something went wrong. Try again.',
        );
      }
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const cancelHref =
    mode === 'create' ? ROUTES.students : studentRoute(student.id);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit(false);
      }}
      className="flex flex-col gap-space-8"
    >
      <div ref={topRef} />
      <PageHeader
        title={
          mode === 'create'
            ? 'Add a student'
            : `Edit ${student.firstName} ${student.lastName}`
        }
        description={
          mode === 'create'
            ? 'The Paideon ID is assigned when you save.'
            : `${student.paideonId} · Admission ${student.admissionNumber}`
        }
        back={{
          href: cancelHref,
          label: mode === 'create' ? 'Back to Students' : 'Back to profile',
        }}
      />

      {added && (
        <Alert variant="success" title="Student added">
          {added.name} ({added.paideonId}) was saved.{' '}
          <Link className="underline" href={studentPhotoRoute(added.id)}>
            Take photo
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={studentRoute(added.id)}>
            View profile
          </Link>
        </Alert>
      )}
      {serverError && <Alert variant="error">{serverError}</Alert>}
      <FormValidationSummary errors={allErrors} />

      <FormSectionWrapper
        title="Identity"
        description="Names as they appear on school records."
      >
        <FormFieldGroup>
          <div className={fieldRow}>
            <Input
              label="First name"
              required
              value={state.firstName}
              error={errors.firstName}
              onChange={text('firstName')}
              autoComplete="off"
            />
            <Input
              label="Last name"
              required
              value={state.lastName}
              error={errors.lastName}
              onChange={text('lastName')}
              autoComplete="off"
            />
          </div>
          <Input
            label="Name with initials"
            value={state.nameWithInitials}
            error={errors.nameWithInitials}
            helperText="For printed lists, for example K. A. S. Perera."
            onChange={text('nameWithInitials')}
            autoComplete="off"
          />
          <div className={fieldRow}>
            <Input
              label="Name in Sinhala or Tamil"
              value={state.nameLocal}
              error={errors.nameLocal}
              onChange={text('nameLocal')}
              autoComplete="off"
            />
            <fieldset className="m-space-0 flex min-w-0 flex-col gap-space-2 border-0 p-space-0">
              <legend className="mb-space-2 font-body text-label uppercase tracking-label text-text-primary">
                Language of that name
              </legend>
              <div className="flex flex-wrap gap-space-4">
                <Radio
                  label="Sinhala"
                  name="nameLocalLanguage"
                  value="SINHALA"
                  checked={state.nameLocalLanguage === 'SINHALA'}
                  onChange={() => set({ nameLocalLanguage: 'SINHALA' })}
                />
                <Radio
                  label="Tamil"
                  name="nameLocalLanguage"
                  value="TAMIL"
                  checked={state.nameLocalLanguage === 'TAMIL'}
                  onChange={() => set({ nameLocalLanguage: 'TAMIL' })}
                />
                <Radio
                  label="None"
                  name="nameLocalLanguage"
                  value=""
                  checked={state.nameLocalLanguage === ''}
                  onChange={() => set({ nameLocalLanguage: '' })}
                />
              </div>
              {errors.nameLocalLanguage && (
                <p
                  role="alert"
                  className="font-body text-caption text-semantic-error-base"
                >
                  {errors.nameLocalLanguage}
                </p>
              )}
            </fieldset>
          </div>
          <div className={fieldRow}>
            <Input
              label="Date of birth"
              type="date"
              required
              value={state.dateOfBirth}
              error={errors.dateOfBirth}
              onChange={text('dateOfBirth')}
            />
            <fieldset className="m-space-0 flex min-w-0 flex-col gap-space-2 border-0 p-space-0">
              <legend className="mb-space-2 font-body text-label uppercase tracking-label text-text-primary">
                Gender
                <span
                  className="ml-space-1 text-semantic-error-base"
                  aria-hidden="true"
                >
                  *
                </span>
              </legend>
              <div className="flex flex-wrap gap-space-4">
                <Radio
                  label="Male"
                  name="gender"
                  value="MALE"
                  checked={state.gender === 'MALE'}
                  onChange={() => set({ gender: 'MALE' })}
                />
                <Radio
                  label="Female"
                  name="gender"
                  value="FEMALE"
                  checked={state.gender === 'FEMALE'}
                  onChange={() => set({ gender: 'FEMALE' })}
                />
              </div>
              {errors.gender && (
                <p
                  role="alert"
                  className="font-body text-caption text-semantic-error-base"
                >
                  {errors.gender}
                </p>
              )}
            </fieldset>
          </div>
        </FormFieldGroup>
      </FormSectionWrapper>

      {showSensitive && (
        <FormSectionWrapper
          title="Background"
          description="Optional. The family may choose not to say."
        >
          <div className={fieldRow}>
            <OptionalChoiceField
              label="Religion"
              value={state.religion}
              presets={RELIGIONS}
              error={errors.religion}
              onChange={(religion) => set({ religion })}
            />
            <OptionalChoiceField
              label="Ethnicity"
              value={state.ethnicity}
              presets={ETHNICITIES}
              error={errors.ethnicity}
              onChange={(ethnicity) => set({ ethnicity })}
            />
          </div>
        </FormSectionWrapper>
      )}

      <FormSectionWrapper title="Home address">
        <FormFieldGroup>
          <Input
            label="Address line 1"
            required
            value={state.line1}
            error={errors['address.line1']}
            onChange={text('line1')}
            autoComplete="off"
          />
          <Input
            label="Address line 2"
            value={state.line2}
            error={errors['address.line2']}
            onChange={text('line2')}
            autoComplete="off"
          />
          <div className={fieldRow}>
            <Input
              label="Town"
              value={state.city}
              error={errors['address.city']}
              onChange={text('city')}
              autoComplete="off"
            />
            <Input
              label="District"
              value={state.district}
              error={errors['address.district']}
              onChange={text('district')}
              autoComplete="off"
            />
          </div>
        </FormFieldGroup>
      </FormSectionWrapper>

      <FormSectionWrapper title="School">
        <FormFieldGroup>
          <div className={fieldRow}>
            <Input
              label="Admission number"
              required
              value={state.admissionNumber}
              error={errors.admissionNumber}
              onChange={text('admissionNumber')}
              autoComplete="off"
            />
            <Input
              label="Admission date"
              type="date"
              required
              value={state.admissionDate}
              error={errors.admissionDate}
              onChange={text('admissionDate')}
            />
          </div>
          <div className={fieldRow}>
            <Select
              label="Grade at admission"
              required
              value={state.gradeAtAdmission}
              error={errors.gradeAtAdmission}
              onChange={text('gradeAtAdmission')}
              options={gradeOptions}
            />
            <Select
              label="Current grade"
              required
              value={state.currentGrade}
              error={errors.currentGrade}
              onChange={(event) =>
                // A class of another grade no longer fits, so the choice starts again.
                set({
                  currentGrade: event.target.value,
                  classId:
                    event.target.value === state.currentGrade
                      ? state.classId
                      : null,
                })
              }
              options={gradeOptions}
            />
          </div>
          <div className={fieldRow}>
            <ClassPicker
              value={state.classId}
              grade={currentGrade}
              error={errors.classId}
              helperText={
                currentGrade === undefined
                  ? 'Choose the current grade first.'
                  : undefined
              }
              onChange={(classId) => set({ classId })}
            />
            <Select
              label="Medium"
              required
              value={state.medium}
              error={errors.medium}
              onChange={text('medium')}
              options={[
                { value: '', label: 'Choose…' },
                { value: 'SINHALA', label: 'Sinhala' },
                { value: 'TAMIL', label: 'Tamil' },
                { value: 'ENGLISH', label: 'English' },
              ]}
            />
          </div>
        </FormFieldGroup>
      </FormSectionWrapper>

      {showGuardians ? (
        <FormSectionWrapper
          title="Guardians"
          description="At least one guardian, with a phone number."
        >
          <FormFieldGroup>
            {state.guardians.map((guardian, index) => (
              <GuardianFields
                key={index}
                index={index}
                required={index === 0}
                value={guardian}
                errors={errors}
                onChange={(next) =>
                  set({
                    guardians: state.guardians.map((g, i) =>
                      i === index ? next : g,
                    ),
                  })
                }
              />
            ))}
            {errors.guardians && (
              <p
                role="alert"
                className="font-body text-caption text-semantic-error-base"
              >
                {errors.guardians}
              </p>
            )}
            {state.guardians.length < 2 ? (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    set({ guardians: [...state.guardians, emptyGuardian()] })
                  }
                >
                  Add a second guardian
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    set({ guardians: state.guardians.slice(0, 1) })
                  }
                >
                  Remove second guardian
                </Button>
              </div>
            )}
          </FormFieldGroup>
        </FormSectionWrapper>
      ) : (
        <FormSectionWrapper title="Guardians">
          <p className="font-body text-body-sm text-text-muted">
            Guardian phone numbers are not visible to you, so they cannot be
            edited here.
          </p>
        </FormSectionWrapper>
      )}

      <FormSectionWrapper title="Account">
        <div className={fieldRow}>
          <Input
            label="School email"
            type="email"
            required={mode === 'create'}
            disabled={mode === 'edit'}
            value={state.email}
            error={errors.email}
            helperText={
              mode === 'edit'
                ? 'The email is changed from Accounts.'
                : 'Used to sign in once the account is activated.'
            }
            onChange={text('email')}
            autoComplete="off"
          />
          <Input
            label="Paideon ID"
            disabled
            value={mode === 'create' ? 'Assigned on save' : student.paideonId}
            onChange={() => undefined}
          />
        </div>
      </FormSectionWrapper>

      <FormStickyFooter note={busy ? 'Saving…' : undefined}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(cancelHref)}
          disabled={busy}
        >
          Cancel
        </Button>
        {mode === 'create' && (
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void submit(true)}
          >
            Save and add another
          </Button>
        )}
        <Button type="submit" loading={busy}>
          Save
        </Button>
      </FormStickyFooter>
    </form>
  );
}
