import { LanguageProvider } from "./i18n/LanguageContext";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import {
  LogoBar,
  Problem,
  HowItWorks,
  Features,
  Results,
  Testimonials,
  Pricing,
  FAQ,
  FinalCta,
} from "./components/Sections";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <LogoBar />
        <Problem />
        <HowItWorks />
        <Features />
        <Results />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
