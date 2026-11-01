import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
export default function NotFound() {
  return <section className="mx-auto max-w-4xl px-6 py-24"><Seo title="Pagina niet gevonden" description="Deze pagina bestaat niet. Ontdek de diensten en cases van Verkoop Studio." path="/404" noindex /><p>404</p><h1 className="mt-4 text-4xl">Deze pagina bestaat niet.</h1><p className="mt-5">Bekijk onze diensten of bespreek je project met ons.</p><Link className="button-dark mt-8" to="/">Terug naar de homepage ↗</Link></section>
}
