import { useReveal } from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  useReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
