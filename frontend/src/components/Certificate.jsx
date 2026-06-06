import React from 'react'

const Certificate = React.forwardRef(({ data = {} }, ref) => {
  const {
    studentName = 'Student Full Name',
    courseName = 'Course Name',
    serialNo = 'STA-2026-000001',
    issueDate = '9 May 2026',
    instructorName = 'Satya Prakash',
    duration = '',
  } = data

  const s = (style) => style // passthrough for readability

  return (
    <div
      ref={ref}
      style={{
        width: '960px', height: '660px',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        flexShrink: 0, display: 'block', lineHeight: 1,
      }}
    >
      {/* Gold outer border */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#c8960c,#f5c842,#a87200,#f0b429,#c8960c)', zIndex: 0 }} />
      {/* Inner bg */}
      <div style={{ position: 'absolute', inset: '14px', background: 'linear-gradient(160deg,#fdfaf2 0%,#fef9ed 35%,#fffdf7 60%,#fdf8ec 100%)', zIndex: 1 }} />
      {/* Inner borders */}
      <div style={{ position: 'absolute', inset: '22px', border: '1.5px solid rgba(180,130,0,0.35)', zIndex: 2 }} />
      <div style={{ position: 'absolute', inset: '27px', border: '0.5px solid rgba(180,130,0,0.18)', zIndex: 2 }} />
      {/* Corner SVGs */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16, transform: 'scaleX(-1)' },
        { bottom: 16, left: 16, transform: 'scaleY(-1)' },
        { bottom: 16, right: 16, transform: 'scale(-1,-1)' },
      ].map((pos, i) => (
        <svg key={i} width="52" height="52" viewBox="0 0 52 52" style={{ position: 'absolute', zIndex: 3, ...pos }}>
          <path d="M2 2 L20 2 L2 20 Z" fill="none" stroke="#c8960c" strokeWidth="1.5" />
          <path d="M2 2 L12 2 L2 12 Z" fill="rgba(200,150,12,0.15)" />
          <circle cx="6" cy="6" r="2" fill="#c8960c" />
          <path d="M22 2 L26 2" stroke="#c8960c" strokeWidth="1" />
          <path d="M2 22 L2 26" stroke="#c8960c" strokeWidth="1" />
        </svg>
      ))}
      {/* Watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '180px', fontWeight: '800', color: 'rgba(200,150,12,0.04)', fontFamily: "'Cinzel',serif", letterSpacing: '10px', userSelect: 'none', zIndex: 2, whiteSpace: 'nowrap' }}>SDA</div>

      {/* Content */}
      <div style={{ position: 'absolute', inset: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', zIndex: 4, padding: '18px 50px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(145deg,#0f172a,#1e3a5f)', border: '3px solid #c8960c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(200,150,12,0.3)' }}>
            <span style={{ color: '#f5c842', fontFamily: "'Cinzel',serif", fontWeight: '800', fontSize: '20px', letterSpacing: '1px' }}>STA</span>
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '13px', fontWeight: '600', color: '#7a5800', letterSpacing: '5px', textTransform: 'uppercase' }}>Satya Tech Academy</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '9px', color: '#a07830', letterSpacing: '4px', textTransform: 'uppercase' }}>Learn · Build · Grow · Succeed</div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,#c8960c)' }} />
          <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="#c8960c" /></svg>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#c8960c,transparent)' }} />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '42px', fontWeight: '700', color: '#1a1200', letterSpacing: '8px', textTransform: 'uppercase' }}>CERTIFICATE</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '11px', letterSpacing: '10px', color: '#7a5800', textTransform: 'uppercase', marginTop: '6px' }}>of  Completion</div>
        </div>

        {/* Student Name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '11px', color: '#8a7050', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>This Certificate is Proudly Presented to</div>
          <div style={{ fontFamily: "'Great Vibes',cursive", fontSize: '52px', color: '#1a1200', lineHeight: 1.1, marginBottom: '2px' }}>{studentName}</div>
          <div style={{ width: '320px', height: '1.5px', margin: '0 auto', background: 'linear-gradient(90deg,transparent,#c8960c 30%,#c8960c 70%,transparent)' }} />
        </div>

        {/* Course */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '11px', color: '#8a7050', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>for successfully completing the course</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '22px', fontWeight: '600', color: '#1a2a4a', letterSpacing: '1px', padding: '6px 28px', borderTop: '1px solid rgba(200,150,12,0.4)', borderBottom: '1px solid rgba(200,150,12,0.4)' }}>{courseName}</div>
          {duration && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '10px', color: '#9a8060', marginTop: '5px', letterSpacing: '1px' }}>Duration: {duration}</div>}
        </div>

        {/* Thin divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(200,150,12,0.5))' }} />
          <div style={{ width: '6px', height: '6px', background: '#c8960c', transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(200,150,12,0.5),transparent)' }} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '15px', fontWeight: '600', color: '#1a1200', marginBottom: '5px' }}>{issueDate}</div>
            <div style={{ width: '140px', height: '1px', background: 'linear-gradient(90deg,transparent,#c8960c,transparent)' }} />
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '9px', color: '#9a8060', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '5px' }}>Date of Issue</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', border: '1.5px solid #c8960c', borderRadius: '6px', padding: '8px 16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '8px', color: '#c8960c', letterSpacing: '3px', textTransform: 'uppercase' }}>Certificate No.</div>
            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#f5c842', fontWeight: '700', marginTop: '3px', letterSpacing: '1px' }}>{serialNo}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div style={{ fontFamily: "'Great Vibes',cursive", fontSize: '26px', color: '#1a1200', marginBottom: '5px', lineHeight: 1.2 }}>{instructorName}</div>
            <div style={{ width: '140px', height: '1px', background: 'linear-gradient(90deg,transparent,#c8960c,transparent)' }} />
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '9px', color: '#1a2a4a', fontWeight: '600', letterSpacing: '1px', marginTop: '5px' }}>{instructorName}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '8px', color: '#9a8060', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>Director, SDA</div>
          </div>
        </div>
      </div>
    </div>
  )
})

Certificate.displayName = 'Certificate'
export default Certificate
