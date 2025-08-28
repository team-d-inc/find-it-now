import { HeroSection } from '@/components/main/hero-section';
import { IntroSection } from '@/components/main/intro-section';
import { ProcessSection } from '@/components/main/process-section';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TransitionButtonSection } from '@/components/main/transition-button-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

const seekerProcess = {
  processContents: [
    {
      title: 'Submit a lost item',
      detail:
        'Describe your lost item with a few details like color, brand, or location — no account required.',
      image: '/features/process_image_1.svg',
    },
    {
      title: 'We analyze your report',
      detail:
        'Our system automatically compares your report with every new found item added by organizations and individuals.',
      image: '/features/process_image_2.svg',
    },
    {
      title: 'Get notified instantly',
      detail:
        "If there's a potential match, you'll receive an email right away with details on how to claim your item safely.",
      image: '/features/process_image_3.svg',
    },
  ],
};

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <HeroSection />
      <IntroSection />
      <ProcessSection processContents={seekerProcess.processContents} />
      <TransitionButtonSection />
      <Footer />
    </div>
  );
}
