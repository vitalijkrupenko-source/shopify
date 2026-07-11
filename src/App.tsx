import { LanguageProvider } from "./i18n/LanguageContext";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import {
  TrustBar,
  Problem,
  Change,
  CaseStudy,
  HowItWorks,
  FirstWeek,
  Cards,
  ForWho,
  Pricing,
  FAQ,
  FinalCta,
  Booking,
} from "./components/Sections";
import { Shop } from "./components/Shop";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Change />
        <CaseStudy />
        <HowItWorks />
        <FirstWeek />
        <Cards />
        <ForWho />
        <Pricing />
        <Shop />
        <FAQ />
        <FinalCta />
        <Booking />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
