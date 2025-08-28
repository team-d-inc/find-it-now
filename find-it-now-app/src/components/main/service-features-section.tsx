import { LucideIcon } from 'lucide-react';

interface ServiceFeatureProps {
  title: string;
  detail: string;
  icon: LucideIcon;
}

interface ServiceFeaturesSectionProps {
  serviceFeatures: ServiceFeatureProps[];
}
export const ServiceFeaturesSection = ({ serviceFeatures }: ServiceFeaturesSectionProps) => {
  return (
    <div className="scroll-mt-30 bg-black/5 px-20 py-10 md:px-20 md:py-35" id="Features">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-12 text-center">
        {serviceFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="space-y-4">
              <Icon className="mx-auto h-12 w-12" strokeWidth={1} />
              <div className="space-y-2">
                <div className="text-xl font-semibold">{feature.title}</div>
                <div>{feature.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
