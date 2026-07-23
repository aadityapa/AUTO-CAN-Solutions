import { Link, useNavigate } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import Page from '../components/Page'
import NotFoundArt from '../components/NotFoundArt'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Page>
      <Head>
        <title>Signal Lost — Page Not Found | AUTO-CAN Solutions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="container nf">
        <NotFoundArt />
        <h1 className="nf__title">Signal lost — this route isn’t on the network.</h1>
        <p className="nf__text">
          The page you’re looking for may have moved, changed, or no longer exists.
        </p>
        <div className="nf__actions">
          <Link to="/" className="btn btn-primary">Return home <span className="arrow">→</span></Link>
          <Link to="/services" className="btn btn-ghost">Explore services</Link>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>Go back</button>
        </div>
        <p className="nf__hint" aria-hidden="true">Tip · tap the broken node to attempt a reconnect</p>
      </div>
    </Page>
  )
}
