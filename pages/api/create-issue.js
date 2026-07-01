import fetch from 'node-fetch'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { title, company, location, type, applyUrl } = req.body || {}
  const repo = process.env.GITHUB_REPO || ''
  const token = process.env.GITHUB_TOKEN || ''

  if(!repo || !token) {
    // In local/demo mode we don't create a GitHub issue. Return simulated response.
    return res.status(200).json({ message: 'demo-mode', preview: { title, company, location, type, applyUrl } })
  }

  const body = `Company: ${company}\nLocation: ${location}\nType: ${type}\nApply: ${applyUrl}\n\n---\nPosted via AI Job Board`;

  try{
    const r = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, labels: ['job'] })
    })
    const data = await r.json()
    if(r.status >= 400) return res.status(500).json({ message: 'GitHub error', detail: data })
    return res.status(200).json({ message: 'created', issue: data.html_url })
  }catch(err){
    return res.status(500).json({ message: 'error', error: String(err) })
  }
}
