import { MotionConfig } from 'motion/react';
import { HubProvider } from './state/HubContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Shift from './components/Shift';
import AthleteIdentity from './components/AthleteIdentity';
import HowItWorks from './components/HowItWorks';
import InnovationStudio from './components/InnovationStudio';
import CommunityBoard from './components/CommunityBoard';
import DesignEvolution from './components/DesignEvolution';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import IdeaModal from './components/IdeaModal';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HubProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ember focus:px-4 focus:py-2 focus:font-bold focus:text-black"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <Shift />
          <AthleteIdentity />
          <HowItWorks />
          <InnovationStudio />
          <CommunityBoard />
          <DesignEvolution />
          <FinalCTA />
        </main>
        <Footer />
        <IdeaModal />
      </HubProvider>
    </MotionConfig>
  );
}

