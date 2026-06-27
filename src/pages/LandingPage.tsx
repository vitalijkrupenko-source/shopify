import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import Footer from "../components/landing/Footer";
import {
  Stats,
  Problem,
  HowItWorks,
  Designs,
  Formats,
  Pricing,
  Testimonials,
  FAQ,
  FinalCTA,
} from "../components/landing/Sections";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Problem />
      <HowItWorks />
      <Designs />
      <Formats />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
