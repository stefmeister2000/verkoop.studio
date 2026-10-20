import ResponsiveImage from '../components/ResponsiveImage'
import { useLang } from '../i18n/LanguageContext'
import stefNooms from '../assets/stef.webp'
import studioTeam from '../assets/studio-team.webp'
export default function AboutStef({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2'
  const CardHeading = standalone ? 'h2' : 'h3'
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section id="agency" className="studio-agency">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Heading className="max-w-3xl font-display text-4xl text-paper sm:text-5xl">
          {nl
            ? 'Commercieel denken. Technisch bouwen. Samen vooruit.'
            : 'Commercial thinking. Technical craft. Moving forward together.'}
        </Heading>
        <p className="mt-6 max-w-2xl text-lg text-bone">
          {nl
            ? 'Vanuit Lochristi brengen we strategie, marketing, design en ontwikkeling samen in één studio. Van je eerste groeivraag tot de website, campagnes en systemen die het waarmaken.'
            : 'From Lochristi, we bring strategy, marketing, design and development together in one studio. From your first growth question to the website, campaigns and systems that make it happen.'}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="panel agency-card">
            <ResponsiveImage className="agency-team-photo agency-nooms-photo" src={stefNooms} alt={nl ? 'Stef Keppens bij Nooms' : 'Stef Keppens at Nooms'} loading="lazy" />
            <CardHeading className="font-display text-3xl text-paper">
              Stef Keppens
            </CardHeading>
            <p className="mt-4 text-bone">
              {nl
                ? 'Marketingstrategie, funnels, ecommerce, campagnes en AI-automatisering. Met de volledige klantreis als vertrekpunt.'
                : 'Marketing strategy, funnels, ecommerce, campaigns and AI automation. Starting with the complete customer journey.'}
            </p>
          </div>
          <div className="panel agency-card">
            <ResponsiveImage className="agency-team-photo" src={studioTeam} alt={nl ? 'Samen aan het werk in de studio' : 'Working together in the studio'} loading="lazy" />
            <CardHeading className="font-display text-3xl text-paper">
              Design & development
            </CardHeading>
            <p className="mt-4 text-bone">
              {nl
                ? 'Websites, software en mobiele apps. Productdesign en ontwikkeling vanuit onze studio in Lochristi.'
                : 'Websites, software and mobile apps. Product design and development from our studio in Lochristi.'}
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}
