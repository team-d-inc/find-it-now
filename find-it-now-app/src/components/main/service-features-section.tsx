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
    <div className="scroll-mt-30 bg-black/5 px-4 py-8 sm:px-8 md:px-20 md:py-35" id="Features">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {serviceFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="space-y-3 sm:space-y-4">
              <Icon className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" strokeWidth={1} />
              <div className="space-y-2">
                <div className="text-lg font-semibold sm:text-xl md:text-xl">{feature.title}</div>
                <div className="text-sm sm:text-base">{feature.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
