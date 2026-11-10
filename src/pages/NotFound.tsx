import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: { title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet. Ontdek de diensten en cases van Verkoop Studio.', heading: 'Deze pagina bestaat niet.', text: 'Bekijk onze diensten of bespreek je project met ons.', back: 'Terug naar de homepage ↗' },
  en: { title: 'Page not found', description: 'This page does not exist. Explore the services and cases of Verkoop Studio.', heading: 'This page does not exist.', text: 'Explore our services or talk to us about your project.', back: 'Back to the homepage ↗' },
}

export default function NotFound() {
  const { lang } = useLang()
  const t = COPY[lang]
  return <section className="mx-auto max-w-4xl px-6 py-24"><Seo title={t.title} description={t.description} path="/404" noindex /><p>404</p><h1 className="mt-4 text-4xl">{t.heading}</h1><p className="mt-5">{t.text}</p><Link className="button-dark mt-8" to="/">{t.back}</Link></section>
}
