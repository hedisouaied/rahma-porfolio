import { identity } from '../data/profile'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-identity">
          <b>{identity.fullName}</b>
          <span>
            {identity.title} · {identity.discipline}
          </span>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <a href={identity.linkedinHref} target="_blank" rel="noreferrer noopener">
            LinkedIn ↗
          </a>
          <a href={identity.emailHref} data-cursor="mail">
            {identity.email}
          </a>
          <a href={identity.cv.href} download={identity.cv.fileName} data-cursor="cv">
            CV ↓
          </a>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>

      <p className="footer-legal wrap">
        <span>
          © {year} {identity.fullName}
        </span>
        <span>{identity.location}</span>
        <span>Data · Analysis · Decision making</span>
      </p>
    </footer>
  )
}
