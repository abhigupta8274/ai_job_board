import { useState } from 'react'
import Link from 'next/link'

export default function Home({ jobs }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = jobs.filter(j => {
    const matchesQuery = [j.title, j.company, j.location, j.type].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'all' ? true : j.type === filter
    return matchesQuery && matchesFilter
  })

  return (
    <div className="container">
      <header className="header">
        <h1>AI Job Board</h1>
        <nav><Link href="/post">Post a Job</Link></nav>
      </header>

      <section className="controls">
        <input placeholder="Search jobs, company, location..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </section>

      <main>
        {filtered.length === 0 && <p>No jobs found.</p>}
        <ul className="jobs">
          {filtered.map(job => (
            <li key={job.id} className="job">
              <h2>{job.title}</h2>
              <p className="meta">{job.company} • {job.location} • {job.type}</p>
              <p>{job.excerpt}</p>
              <div className="job-actions">
                <a href={job.applyUrl} target="_blank" rel="noreferrer">Apply</a>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">Built for assessment — configure GitHub & Vercel to enable posting.</footer>

      <style jsx>{`
        .container{max-width:900px;margin:40px auto;padding:0 16px;font-family:Inter,system-ui,Arial}
        .header{display:flex;justify-content:space-between;align-items:center}
        .controls{display:flex;gap:8px;margin:20px 0}
        input{flex:1;padding:8px;border:1px solid #ddd;border-radius:6px}
        select{padding:8px}
        .jobs{list-style:none;padding:0;margin:0;display:grid;gap:12px}
        .job{padding:16px;border:1px solid #eee;border-radius:8px}
        .meta{color:#666;margin:6px 0}
        .job-actions a{color:#0070f3}
        .footer{margin-top:40px;color:#999;font-size:14px}
      `}</style>
    </div>
  )
}

export async function getStaticProps(){
  let jobs = []
  try{
    // Try to fetch jobs from GitHub issues at build time (requires GITHUB_REPO + GITHUB_TOKEN env)
    const repo = process.env.GITHUB_REPO || ''
    const token = process.env.GITHUB_TOKEN || ''
    if(repo && token){
      const res = await fetch(`https://api.github.com/repos/${repo}/issues?labels=job&state=open` , { headers: { Authorization: `token ${token}` }})
      const issues = await res.json()
      jobs = issues.map(i => ({
        id: i.id,
        title: i.title,
        company: (i.body.match(/Company:\s*(.*)/i) || [])[1] || 'Company',
        location: (i.body.match(/Location:\s*(.*)/i) || [])[1] || 'Remote',
        type: (i.body.match(/Type:\s*(.*)/i) || [])[1] || 'Full-time',
        excerpt: i.body.split('\n').slice(0,4).join(' '),
        applyUrl: (i.body.match(/Apply:\s*(https?:\/\/[^\s]+)/i) || [])[1] || '#'
      }))
    }
  }catch(e){
    // ignore
  }

  if(jobs.length === 0){
    const sample = require('../lib/sampleJobs.json')
    jobs = sample
  }

  return { props: { jobs } }
}
