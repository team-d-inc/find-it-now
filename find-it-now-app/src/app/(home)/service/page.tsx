import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LayoutDashboard, Users, Zap } from 'lucide-react';
import { ProcessSection } from '@/components/main/process-section';
import { ServiceHeroSection } from '@/components/main/service-hero-section';
import { ServiceFeaturesSection } from '@/components/main/service-features-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

const serviceProcess = {
  processContents: [
    {
      title: 'Register your organization',
      detail: 'Sign up and verify your institution.',
      image: '/features/process_image_4.png',
    },
    {
      title: 'Invite your staff',
      detail: 'Staff members can access the dashboard to manage found items.',
      image: '/features/process_image_5.png',
    },
    {
      title: 'Log found items easily',
      detail: "Add items to the system — we'll handle the rest with smart matching.",
      image: '/features/process_image_6.png',
    },
  ],
};

const serviceFeatures = {
  features: [
    {
      title: 'Multi-Staff Management',
      detail: 'Role-based access control and team coordination',
      icon: Zap,
    },
    {
      title: 'Smart AI Matching',
      detail: 'Automated lost item matching powered by intelligent analysis',
      icon: LayoutDashboard,
    },
    {
      title: 'Unified Dashboard',
      detail: 'Real-time oversight of all lost item processes and staff activities.',
      icon: Users,
    },
  ],
};

export default async function Service() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ServiceHeroSection />
      <ServiceFeaturesSection serviceFeatures={serviceFeatures.features} />
      <ProcessSection processContents={serviceProcess.processContents} />
      <Footer />
    </div>
  );
}
