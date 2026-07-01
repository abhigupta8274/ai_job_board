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
    <div className="page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>ðŸš€ AI Job Board</h1>
            <p className="subtitle">Discover AI-powered opportunities</p>
          </div>
          <Link href="/post" className="btn-post">Post a Job</Link>
        </div>
      </header>

      <div className="container">
        <section className="controls">
          <div className="search-group">
            <input 
              className="search-input" 
              placeholder="ðŸ” Search by title, company, or location..." 
              value={query} 
              onChange={(e)=>setQuery(e.target.value)} 
            />
          </div>
          <select className="filter-select" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="all">ðŸ“‹ All types</option>
            <option value="Full-time">â° Full-time</option>
            <option value="Part-time">ðŸ• Part-time</option>
            <option value="Contract">ðŸ“ Contract</option>
          </select>
        </section>

        <main className="main-content">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No jobs found</p>
              <p className="empty-text">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <p className="results-count">Found {filtered.length} job{filtered.length !== 1 ? 's' : ''}</p>
              <ul className="jobs">
                {filtered.map(job => (
                  <li key={job.id} className="job-card">
                    <div className="job-header">
                      <h2>{job.title}</h2>
                      <span className="job-type-badge" data-type={job.type.toLowerCase().replace('-', '')}>{job.type}</span>
                    </div>
                    <p className="meta">
                      <span className="company-name">ðŸ¢ {job.company}</span>
                      <span className="separator">â€¢</span>
                      <span className="location">ðŸ“ {job.location}</span>
                    </p>
                    <p className="excerpt">{job.excerpt}</p>
                    <div className="job-footer">
                      <a href={job.applyUrl} target="_blank" rel="noreferrer" className="btn-apply">Apply Now â†’</a>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>âœ¨ Built with AI â€¢ Real-time job posting â€¢ Powered by GitHub</p>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 30px; }
        .header h1 { margin: 0; font-size: 3em; font-weight: 700; letter-spacing: -0.5px; }
        .subtitle { margin: 8px 0 0 0; font-size: 1.1em; opacity: 0.95; font-weight: 400; }
        .btn-post { display: inline-block; background: #ff6b6b; color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; white-space: nowrap; }
        .btn-post:hover { background: #ee5a52; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3); }
        .container { max-width: 1200px; margin: -40px auto 0; padding: 0 20px; flex: 1; }
        .controls { display: flex; gap: 12px; margin-bottom: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .search-group { flex: 1; }
        .search-input { width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1em; transition: all 0.3s ease; }
        .search-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .filter-select { padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1em; cursor: pointer; transition: all 0.3s ease; min-width: 140px; }
        .filter-select:hover { border-color: #667eea; }
        .filter-select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .main-content { margin-bottom: 40px; }
        .results-count { color: #666; margin: 0 0 16px 0; font-size: 0.95em; font-weight: 500; }
        .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .empty-title { font-size: 1.5em; font-weight: 600; color: #333; margin: 0 0 10px 0; }
        .empty-text { color: #999; margin: 0; }
        .jobs { list-style: none; padding: 0; margin: 0; display: grid; gap: 16px; }
        .job-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.3s ease; border-left: 4px solid #667eea; }
        .job-card:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.12); transform: translateY(-4px); }
        .job-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
        .job-header h2 { margin: 0; font-size: 1.3em; color: #222; font-weight: 600; }
        .job-type-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75em; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
        .job-type-badge[data-type="fulltime"] { background: #d4edff; color: #0066cc; }
        .job-type-badge[data-type="parttime"] { background: #ffeaa7; color: #d68910; }
        .job-type-badge[data-type="contract"] { background: #dfe6e9; color: #2d3436; }
        .meta { display: flex; gap: 12px; align-items: center; margin: 0 0 12px 0; color: #666; font-size: 0.95em; }
        .company-name { font-weight: 500; color: #333; }
        .separator { opacity: 0.5; }
        .location { color: #667eea; font-weight: 500; }
        .excerpt { color: #555; margin: 12px 0; line-height: 1.6; }
        .job-footer { margin-top: 16px; }
        .btn-apply { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
        .btn-apply:hover { background: #5568d3; transform: translateX(4px); }
        .footer { background: #2d3436; color: white; text-align: center; padding: 30px 20px; margin-top: auto; font-size: 0.9em; }
        .footer p { margin: 0; opacity: 0.9; }
        @media (max-width: 768px) {
          .header-content { flex-direction: column; text-align: center; }
          .header h1 { font-size: 2em; }
          .controls { flex-direction: column; }
          .filter-select { width: 100%; }
          .job-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps(){
  let jobs = []
  try{
    // Fetch jobs from GitHub issues on each request (ensures new posts show immediately)
    const repo = process.env.GITHUB_REPO || ''
    const token = process.env.GITHUB_TOKEN || ''
    if(repo && token){
      const res = await fetch(`https://api.github.com/repos/${repo}/issues?labels=job&state=open&per_page=50`, { headers: { Authorization: `token ${token}` }})
      const issues = await res.json()
      jobs = (Array.isArray(issues) ? issues : []).map(i => ({
        id: i.id,
        title: i.title,
        company: (i.body.match(/Company:\s*(.*)/i) || [])[1] || 'Company',
        location: (i.body.match(/Location:\s*(.*)/i) || [])[1] || 'Remote',
        type: (i.body.match(/Type:\s*(.*)/i) || [])[1] || 'Full-time',
        excerpt: i.body.split('\n').slice(0,2).join(' ').substring(0, 150),
        applyUrl: (i.body.match(/Apply:\s*(https?:\/\/[^\s]+)/i) || [])[1] || '#'
      }))
    }
  }catch(e){
    // fallback to sample jobs on error
  }

  if(jobs.length === 0){
    try {
      const sample = require('../lib/sampleJobs.json')
      jobs = sample
    } catch (e) {
      jobs = []
    }
  }

  return { props: { jobs }, revalidate: 10 }
}
