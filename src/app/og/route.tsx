import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Emirhan Cebiroğlu';
  const description =
    searchParams.get('description') ?? 'Software engineer building tools people actually use.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#0A0A0B',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px',
            backgroundColor: '#D4845A',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '18px', color: '#D4845A', margin: 0 }}>emirhancebiroglu.dev</p>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#FAFAF9',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '24px', color: '#A1A1A6', margin: 0 }}>{description}</p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
