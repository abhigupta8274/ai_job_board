import { useState } from 'react'
import Link from 'next/link'

export default function Post() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('Remote')
  const [type, setType] = useState('Full-time')
  const [applyUrl, setApplyUrl] = useState('')
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function saveLocalJob(job) {
    if (typeof window === 'undefined') return
    try {
      const existing = JSON.parse(window.localStorage.getItem('postedJobs') || '[]')
      const updated = [job, ...existing.filter(item => item.applyUrl !== job.applyUrl)]
      window.localStorage.setItem('postedJobs', JSON.stringify(updated.slice(0, 20)))
    } catch (err) {
      console.error('Unable to save local job', err)
    }
  }

  async function submit(e){
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, location, type, applyUrl })
      })
      const data = await res.json()
      const savedJob = {
        id: `local-${Date.now()}`,
        title,
        company,
        location,
        type,
        excerpt: `Apply at ${applyUrl}`,
        applyUrl
      }
      saveLocalJob(savedJob)
      if(res.ok) {
        setStatus({ type: 'success', message: data?.message === 'demo-mode' ? 'Job saved locally in demo mode.' : 'Job posted successfully! ðŸŽ‰' })
        setTitle(''); setCompany(''); setLocation('Remote'); setType('Full-time'); setApplyUrl('')
        setTimeout(() => setStatus(null), 3000)
      } else {
        setStatus({ type: 'error', message: data?.message || 'Failed to post job' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Error posting job' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>ðŸš€ Post a Job</h1>
            <p className="subtitle">Share your opportunity with AI professionals</p>
          </div>
          <Link href="/" className="btn-back">View All Jobs</Link>
        </div>
      </header>

      <div className="container">
        <div className="form-card">
          <form onSubmit={submit} className="form">
            <div className="form-group">
              <label htmlFor="title" className="label">Job Title *</label>
              <input 
                id="title"
                className="input" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                placeholder="e.g. Senior React Developer"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company" className="label">Company Name *</label>
              <input 
                id="company"
                className="input" 
                value={company} 
                onChange={e=>setCompany(e.target.value)} 
                placeholder="e.g. Tech Corp Inc."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="label">Location *</label>
                <input 
                  id="location"
                  className="input" 
                  value={location} 
                  onChange={e=>setLocation(e.target.value)} 
                  placeholder="e.g. San Francisco, CA or Remote"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type" className="label">Employment Type *</label>
                <select 
                  id="type"
                  className="input" 
                  value={type} 
                  onChange={e=>setType(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="applyUrl" className="label">Application URL *</label>
              <input 
                id="applyUrl"
                className="input" 
                value={applyUrl} 
                onChange={e=>setApplyUrl(e.target.value)} 
                placeholder="https://yourcompany.com/careers/apply"
                type="url"
                required
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'âœ¨ Post Job'}
            </button>
          </form>

          {status && (
            <div className={`alert alert-${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="info-box">
            <p className="info-title">ðŸ’¡ Demo Mode</p>
            <p className="info-text">To enable GitHub integration and make posts appear on the job board, configure <code>GITHUB_REPO</code> and <code>GITHUB_TOKEN</code> environment variables in your hosting platform.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>âœ¨ Built with AI â€¢ Real-time job posting â€¢ Powered by GitHub</p>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
        .header { background: linear-gradient(135deg, #1f4b72 0%, #0f3052 100%); color: white; padding: 60px 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.14); }
        .header-content { max-width: 700px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 30px; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 700; }
        .subtitle { margin: 8px 0 0 0; font-size: 1.1em; opacity: 0.95; }
        .btn-back { display: inline-block; background: #2e5f88; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.25s ease; white-space: nowrap; }
        .btn-back:hover { background: #1f4b72; transform: translateX(-4px); }
        .container { max-width: 700px; margin: 0 auto; padding: 0 20px; flex: 1; }
        .form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 6px 18px rgba(15, 41, 62, 0.12); margin: 40px 0; }
        .btn-submit { width: 100%; padding: 14px 20px; background: #0f3c60; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: all 0.25s ease; margin-top: 8px; }
        .btn-submit:hover:not(:disabled) { background: #0b2f4d; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(15, 41, 62, 0.18); }
        .btn-submit:disabled { opacity: 0.75; cursor: not-allowed; }
        .alert-success { background: #d9efdc; color: #1d512f; border: 1px solid #a7d2a5; }
        .info-box { background: #f5f8fb; padding: 20px; border-radius: 8px; margin-top: 24px; border-left: 4px solid #1f4b72; }
        .form { }
        .form-group { margin-bottom: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 0.95em; }
        .input { width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1em; transition: all 0.3s ease; font-family: inherit; }
        .input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .input:disabled { background: #f5f5f5; color: #999; cursor: not-allowed; }
        .btn-submit { width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 8px; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .alert { padding: 16px; border-radius: 8px; margin-top: 20px; font-weight: 500; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info-box { background: #f0f4ff; padding: 20px; border-radius: 8px; margin-top: 24px; border-left: 4px solid #667eea; }
        .info-title { margin: 0 0 8px 0; font-weight: 600; color: #333; }
        .info-text { margin: 0; color: #666; font-size: 0.95em; line-height: 1.6; }
        code { background: white; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; color: #667eea; }
        .footer { background: #2d3436; color: white; text-align: center; padding: 30px 20px; margin-top: auto; font-size: 0.9em; }
        .footer p { margin: 0; opacity: 0.9; }
        @media (max-width: 600px) {
          .header-content { flex-direction: column; text-align: center; }
          .form-row { grid-template-columns: 1fr; }
          .form-card { padding: 24px; }
        }
      `}</style>
    </div>
  )
}
