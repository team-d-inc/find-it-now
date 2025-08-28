import { LucideIcon } from 'lucide-react';
import { TextAnimate } from '../magicui/text-animate';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FeaturesProps {
  title: string;
  detail: string;
  icon: LucideIcon;
  image: string;
}
interface FeaturesSectionProps {
  features: FeaturesProps[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <div className="bg-primary/20 px-10 py-10 md:px-20 md:py-40" id="Features">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2">Why Choose FindItNow</p>
        <h2 className="mb-10 text-6xl font-semibold">
          <TextAnimate>Smarter Lost & Found</TextAnimate>
        </h2>
        <div className="mt-14">
          <ul className="grid gap-4 space-y-10">
            {features.map((feature, index) => {
              // const Icon = feature.icon;
              return (
                <li
                  className={cn(
                    'gap-8 md:flex md:justify-between',
                    index === 1 && 'flex-row-reverse',
                  )}
                  key={index}
                >
                  <div className="w-1/2">
                    <Image src={feature.image} width={600} height={450} alt="screenshot" />
                  </div>
                  <div className="w-1/2">
                    {/* <Icon className="h-12 w-12" strokeWidth={1} /> */}
                    <div className="mt-4 flex flex-col">
                      <span className="text-4xl font-semibold">{feature.title}</span>
                      <span className="mt-2 text-2xl">- {feature.detail}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
