import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  pine:      '#2D5016',
  sage:      '#4A7C3F',
  lightSage: '#E8F0E3',
  bark:      '#6B4423',
  cream:     '#F7F4EE',
  gold:      '#C8A84B',
  red:       '#c0392b',
  bg:        'linear-gradient(160deg, #F7F4EE 0%, #eef3e8 100%)',
}

const inputStyle = {
  fontFamily: "'Lato', sans-serif",
  fontSize: '13px',
  color: '#333',
  background: C.cream,
  border: `1px solid ${C.lightSage}`,
  borderRadius: '6px',
  padding: '6px 10px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const iconBtn = (extra = {}) => ({
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#bbb', padding: '4px', borderRadius: '6px',
  display: 'flex', alignItems: 'center', transition: 'color 0.15s',
  ...extra,
})

// ── Icons ─────────────────────────────────────────────────────────────────────
const TreeIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="16,2 26,18 6,18" fill={C.sage} />
    <polygon points="16,8 28,26 4,26" fill={C.pine} />
    <rect x="13" y="25" width="6" height="5" fill={C.bark} rx="1" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
    <path d="M3 6l5 5 5-5" stroke={C.pine} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke={C.sage} strokeWidth="1.5" />
    <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={C.sage} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [shaking, setShaking] = useState(false)

  const attempt = () => {
   const editPassword = import.meta.env.VITE_EDIT_PASSWORD || 'WoodlandEchoFarms'
      '
    if (pw === editPassword) {
      sessionStorage.setItem('wef-auth', '1')
      onUnlock()
    } else {
      setErr(true)
      setShaking(true)
      setPw('')
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: C.bg,
    }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{
        background: '#fff', borderRadius: '18px', padding: '44px 40px',
        boxShadow: '0 8px 40px rgba(45,80,22,0.13)', textAlign: 'center',
        maxWidth: '380px', width: '90%',
        animation: shaking ? 'shake 0.45s ease' : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '8px', marginBottom: '18px' }}>
          <TreeIcon size={32} /><TreeIcon size={44} /><TreeIcon size={32} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.pine, fontSize: '22px', marginBottom: '6px' }}>
          Woodlands at Echo Farms
        </h2>
        <p style={{ color: C.sage, fontSize: '13px', marginBottom: '28px', lineHeight: 1.5 }}>
          Enter the neighborhood password to view and edit the directory.
        </p>
        <input
          type="password"
          placeholder="Neighborhood password"
          value={pw}
          autoFocus
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{ ...inputStyle, fontSize: '15px', padding: '11px 14px', marginBottom: '10px' }}
        />
        {err && (
          <p style={{ color: C.red, fontSize: '12px', marginBottom: '10px' }}>
            Incorrect password — please try again.
          </p>
        )}
        <button onClick={attempt} style={{
          width: '100%', background: C.pine, color: '#fff', border: 'none',
          borderRadius: '10px', padding: '13px', fontSize: '14px',
          fontFamily: "'Lato', sans-serif", fontWeight: '700',
          cursor: 'pointer', letterSpacing: '0.04em',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.sage}
          onMouseLeave={e => e.currentTarget.style.background = C.pine}
        >
          Enter Directory
        </button>
        <p style={{ marginTop: '18px', fontSize: '11px', color: '#bbb', fontStyle: 'italic' }}>
          Contact your neighborhood coordinator for the password.
        </p>
      </div>
    </div>
  )
}

// ── Resident row ──────────────────────────────────────────────────────────────
function ResidentRow({ resident, onChange, onRemove }) {
  const save = (field) => async (e) => {
    const val = e.target.value
    onChange({ ...resident, [field]: val })
    await supabase.from('residents').update({ [field]: val }).eq('id', resident.id)
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: '8px', alignItems: 'center', padding: '7px 0',
      borderBottom: `1px dashed ${C.lightSage}`,
    }}>
      <input placeholder="Name"  defaultValue={resident.name}  onBlur={save('name')}  style={inputStyle} />
      <input placeholder="Phone" defaultValue={resident.phone} onBlur={save('phone')} style={inputStyle} />
      <input placeholder="Email" defaultValue={resident.email} onBlur={save('email')} style={inputStyle} />
      <button onClick={onRemove} style={iconBtn({ color: C.red })} title="Remove resident">
        <TrashIcon />
      </button>
    </div>
  )
}

// ── Address card ──────────────────────────────────────────────────────────────
function AddressCard({ address, onRemove, onResidentsChange }) {
  const [open, setOpen] = useState(true)
  const [residents, setResidents] = useState(address.residents || [])
  const debounceRef = useRef(null)

  const saveStreet = (val) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      supabase.from('addresses').update({ street: val }).eq('id', address.id)
    }, 600)
  }

  const addResident = async () => {
    const { data, error } = await supabase
      .from('residents')
      .insert({ address_id: address.id, name: '', phone: '', email: '' })
      .select()
      .single()
    if (!error && data) {
      const updated = [...residents, data]
      setResidents(updated)
      onResidentsChange(address.id, updated)
    }
  }

  const updateResident = (id, val) => {
    const updated = residents.map(r => r.id === id ? val : r)
    setResidents(updated)
    onResidentsChange(address.id, updated)
  }

  const removeResident = async (id) => {
    await supabase.from('residents').delete().eq('id', id)
    const updated = residents.filter(r => r.id !== id)
    setResidents(updated)
    onResidentsChange(address.id, updated)
  }

  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${C.lightSage}`,
      borderRadius: '12px', marginBottom: '14px', overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(45,80,22,0.07)',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', background: C.lightSage,
        cursor: 'pointer', userSelect: 'none',
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>🏡</span>
        <input
          placeholder="Street Address (e.g. 123 Maple Lane)"
          defaultValue={address.street}
          onChange={e => saveStreet(e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{
            ...inputStyle, flex: 1,
            fontFamily: "'Playfair Display', serif",
            fontSize: '15px', fontWeight: '600', color: C.pine,
            background: 'transparent', border: 'none',
            borderBottom: `1.5px solid ${C.sage}`, borderRadius: 0, padding: '2px 6px',
          }}
        />
        <ChevronIcon open={open} />
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={iconBtn({ color: C.red })}
          title="Remove address"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Residents */}
      {open && (
        <div style={{ padding: '12px 16px' }}>
          {residents.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '8px', paddingBottom: '6px', marginBottom: '2px',
              borderBottom: `2px solid ${C.lightSage}`,
            }}>
              {['Name', 'Phone', 'Email', ''].map((h, i) => (
                <span key={i} style={{
                  fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: C.sage,
                }}>{h}</span>
              ))}
            </div>
          )}

          {residents.map(r => (
            <ResidentRow
              key={r.id}
              resident={r}
              onChange={val => updateResident(r.id, val)}
              onRemove={() => removeResident(r.id)}
            />
          ))}

          <button onClick={addResident} style={{
            marginTop: '10px', display: 'flex', alignItems: 'center', gap: '7px',
            background: 'none', border: `1.5px dashed ${C.sage}`, borderRadius: '8px',
            color: C.sage, cursor: 'pointer', padding: '7px 14px',
            fontSize: '13px', fontFamily: "'Lato', sans-serif", fontWeight: '600',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.lightSage}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <PersonIcon /> + Add Resident
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem('wef-auth'))
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!unlocked) return
    fetchAll()
  }, [unlocked])

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: addrs, error: e1 } = await supabase
        .from('addresses')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (e1) throw e1

      const { data: res, error: e2 } = await supabase
        .from('residents')
        .select('*')
        .order('created_at', { ascending: true })

      if (e2) throw e2

      const merged = (addrs || []).map(a => ({
        ...a,
        residents: (res || []).filter(r => r.address_id === a.id),
      }))
      setAddresses(merged)
    } catch (err) {
      setError('Could not load directory. Check your Supabase connection.')
      console.error(err)
    }
    setLoading(false)
  }

  const addAddress = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .insert({ street: '', sort_order: addresses.length })
      .select()
      .single()
    if (!error && data) {
      setAddresses(prev => [...prev, { ...data, residents: [] }])
    }
  }

  const removeAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const updateResidents = (addressId, residents) => {
    setAddresses(prev => prev.map(a => a.id === addressId ? { ...a, residents } : a))
  }

  const logout = () => {
    sessionStorage.removeItem('wef-auth')
    setUnlocked(false)
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* ── Header ── */}
      <header style={{
        background: C.pine, padding: '32px 24px 26px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, left: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '10px', marginBottom: '12px' }}>
          <TreeIcon size={36} /><TreeIcon size={50} /><TreeIcon size={36} />
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(22px, 5vw, 36px)',
          color: '#fff', margin: '0 0 6px',
          letterSpacing: '0.02em', lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}>
          Woodlands at Echo Farms
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '10px' }}>
          <div style={{ height: '1px', width: '44px', background: C.gold, opacity: 0.6 }} />
          <p style={{ color: C.gold, margin: 0, fontSize: '11px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Voluntary Neighborhood Directory
          </p>
          <div style={{ height: '1px', width: '44px', background: C.gold, opacity: 0.6 }} />
        </div>

        <button onClick={logout} style={{
          position: 'absolute', top: '14px', right: '16px',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)', borderRadius: '8px',
          padding: '5px 12px', fontSize: '11px', cursor: 'pointer',
          fontFamily: "'Lato', sans-serif", letterSpacing: '0.05em',
        }}>
          Lock
        </button>
      </header>

      {/* ── Body ── */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 16px 80px' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <p style={{ color: C.sage, fontSize: '13px', margin: 0, fontStyle: 'italic' }}>
            {loading ? 'Loading…' : `${addresses.length} address${addresses.length !== 1 ? 'es' : ''} listed`}
          </p>
          <button onClick={addAddress} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: C.pine, color: '#fff', border: 'none',
            borderRadius: '10px', padding: '10px 22px',
            fontSize: '14px', fontFamily: "'Lato', sans-serif", fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 3px 12px rgba(45,80,22,0.25)',
            letterSpacing: '0.03em', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.pine; e.currentTarget.style.transform = 'none' }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span> Add Address
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fdf2f2', border: `1.5px solid ${C.red}`, borderRadius: '10px',
            padding: '14px 18px', marginBottom: '20px', color: C.red, fontSize: '13px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {error}
            <button onClick={fetchAll} style={{
              background: C.red, color: '#fff', border: 'none',
              borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px',
            }}>Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.sage, opacity: 0.5 }}>
            <TreeIcon size={44} />
            <p style={{ fontFamily: "'Playfair Display', serif", marginTop: '14px', fontSize: '17px' }}>
              Loading directory…
            </p>
          </div>
        )}

        {/* Address cards */}
        {!loading && addresses.map(addr => (
          <AddressCard
            key={addr.id}
            address={addr}
            onRemove={() => removeAddress(addr.id)}
            onResidentsChange={updateResidents}
          />
        ))}

        {/* Empty state */}
        {!loading && addresses.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.sage, opacity: 0.55 }}>
            <TreeIcon size={48} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginTop: '16px' }}>
              No addresses yet — add the first one above!
            </p>
          </div>
        )}

        <p style={{
          textAlign: 'center', marginTop: '48px', fontSize: '11px',
          color: '#bbb', letterSpacing: '0.08em', fontStyle: 'italic',
        }}>
          This directory is voluntary. Information is shared at residents' discretion.
        </p>
      </main>
    </div>
  )
}
