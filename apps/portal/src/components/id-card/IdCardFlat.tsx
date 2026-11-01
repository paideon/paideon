import { SchoolLogo } from '@paideon/ui';

import type { BadgeDetails } from '@/lib/badge';

import { Barcode } from './Barcode';

type Props = {
  details: BadgeDetails;
  photoUrl?: string | null;
  /**
   * CSS width of the card. The default is the real size of a CR80 card
   * (85.6 mm), which is what prints. Everything inside scales with it.
   */
  width?: string;
};

// The card is a physical object, so it keeps the same colours in light and
// dark themes. These are the brand colours of the 3D card.
const NAVY = '#001F3F';
const GOLD = '#C9A84C';
const CREAM = '#F5F0E6';

// CR80 (85.6 x 54 mm). Sizes are in cqw (percent of the card's own width),
// so the card looks the same at any size.
export function IdCardFlat({ details, photoUrl, width = '85.6mm' }: Props) {
  return (
    <div
      role="group"
      aria-label={`ID card of ${details.fullName}`}
      style={{
        width,
        aspectRatio: '85.6 / 54',
        containerType: 'inline-size',
        background: NAVY,
        color: CREAM,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '3.5cqw',
        fontFamily: 'system-ui, sans-serif',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
        breakInside: 'avoid',
      }}
    >
      {/* Gold edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '1.6cqw',
          background: GOLD,
        }}
      />

      {/* Header: crest and school */}
      <div
        style={{
          position: 'absolute',
          left: '4cqw',
          top: '4.5cqw',
          right: '4cqw',
          display: 'flex',
          alignItems: 'center',
          gap: '2.5cqw',
        }}
      >
        <div style={{ width: '9cqw', flexShrink: 0 }}>
          <SchoolLogo variant="crest-only" />
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div
            style={{
              fontSize: '3.4cqw',
              fontWeight: 600,
              fontFamily: 'Georgia, serif',
              color: GOLD,
            }}
          >
            Paideon
          </div>
          <div style={{ fontSize: '2.6cqw', opacity: 0.8 }}>
            C.W.W. Kannangara Central College
          </div>
        </div>
      </div>

      {/* Photo or initials */}
      <div
        style={{
          position: 'absolute',
          left: '4cqw',
          top: '19cqw',
          width: '21cqw',
          height: '26cqw',
          background: '#002A56',
          border: `0.4cqw solid ${GOLD}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- a card photo, fixed box
          <img
            src={photoUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              fontSize: '9cqw',
              fontFamily: 'Georgia, serif',
              color: GOLD,
            }}
          >
            {details.initials}
          </span>
        )}
      </div>

      {/* Name and details */}
      <div
        style={{
          position: 'absolute',
          left: '28cqw',
          top: '19cqw',
          right: '4cqw',
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            fontSize: '4.6cqw',
            fontWeight: 600,
            fontFamily: 'Georgia, serif',
          }}
        >
          {details.fullName}
        </div>
        <div
          style={{
            fontSize: '2.6cqw',
            letterSpacing: '0.12em',
            color: GOLD,
            margin: '0.8cqw 0 2.2cqw',
          }}
        >
          {details.roleLabel.toUpperCase()}
        </div>
        <Field label={details.detailLabel} value={details.detailValue} />
        <Field label={details.numberLabel} value={details.numberValue} mono />
        <Field label="PAIDEON ID" value={details.paideonId} mono />
      </div>

      {/* Barcode of the library card number (white box: scanners need contrast) */}
      <div
        style={{
          position: 'absolute',
          left: '4cqw',
          right: '4cqw',
          bottom: '3cqw',
          height: '11cqw',
          background: '#fff',
          color: '#000',
          padding: '0.8cqw 2cqw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Barcode
          value={details.cardNumber}
          showText={false}
          className="min-h-0 flex-1"
        />
        <div
          style={{
            fontSize: '2cqw',
            textAlign: 'center',
            fontFamily: '"Courier New", monospace',
            lineHeight: 1.3,
          }}
        >
          {details.cardNumber}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div style={{ marginBottom: '1.2cqw' }}>
      <div style={{ fontSize: '2cqw', letterSpacing: '0.1em', opacity: 0.55 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '3cqw',
          fontFamily: mono ? '"Courier New", monospace' : undefined,
          fontWeight: 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}
