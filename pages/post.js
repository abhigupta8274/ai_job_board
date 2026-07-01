import { useState } from 'react'
import Link from 'next/link'

export default function Post() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('Remote')
  const [type, setType] = useState('Full-time')
  const [applyUrl, setApplyUrl] = useState('')
  const [status, setStatus] = useState(null)

  async function submit(e){
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/create-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, location, type, applyUrl })
    })
    const data = await res.json()
    if(res.ok) setStatus('posted')
    else setStatus(data?.message || 'error')
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Post a Job</h1>
        <nav><Link href="/">Back</Link></nav>
      </header>

      <form onSubmit={submit} className="form">
        <label>Job title<input value={title} onChange={e=>setTitle(e.target.value)} required/></label>
        <label>Company<input value={company} onChange={e=>setCompany(e.target.value)} required/></label>
        <label>Location<input value={location} onChange={e=>setLocation(e.target.value)} required/></label>
        <label>Type<select value={type} onChange={e=>setType(e.target.value)}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
        </select></label>
        <label>Apply URL<input value={applyUrl} onChange={e=>setApplyUrl(e.target.value)} placeholder="https://..." required/></label>
        <button type="submit">Post Job</button>
      </form>

      {status && <p className="status">Status: {status}</p>}

      <style jsx>{`
        .container{max-width:700px;margin:40px auto;padding:0 16px;font-family:Inter,system-ui,Arial}
        .form{display:grid;gap:12px}
        label{display:block}
        input,select{width:100%;padding:8px;border:1px solid #ddd;border-radius:6px}
        button{padding:10px 14px;border-radius:6px;background:#0070f3;color:white;border:none}
        .status{margin-top:12px}
      `}</style>
    </div>
  )
}
