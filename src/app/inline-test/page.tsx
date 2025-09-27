export default function InlineTestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6' }}>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
        }}
      >
        Inline Styles Test
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        If you can see this styled text, the page is loading correctly.
      </p>
      <div
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>
          Inline Styled Card
        </h2>
        <p style={{ color: '#6b7280' }}>
          This card uses inline styles to verify the page is working.
        </p>
      </div>
      <button
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Inline Styled Button
      </button>
    </div>
  )
}
