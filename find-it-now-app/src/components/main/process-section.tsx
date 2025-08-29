import { TextAnimate } from '../magicui/text-animate';
import Image from 'next/image';

interface ProcessContentsProps {
  title: string;
  detail: string;
  image?: string;
}
interface ProcessSectionProps {
  processContents: ProcessContentsProps[];
}

export const ProcessSection = ({ processContents }: ProcessSectionProps) => {
  return (
    <div className="scroll-mt-16 px-6 py-10 md:px-10 md:py-20 lg:px-20" id="HowItWorks">
      <div className="mx-auto max-w-7xl">
        <div className="text-center md:text-right">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-6xl">
            <TextAnimate animate="blurIn" startOnView={true}>
              How FindItNow Works
            </TextAnimate>
          </h2>
        </div>
        <div className="pt-10 md:pt-20">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 transform bg-black lg:block"></div>
            <div className="space-y-12 md:space-y-20">
              {processContents.map((content, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-0">
                    <div className="w-full px-4 lg:flex lg:w-1/2 lg:justify-end lg:px-0 lg:pr-12">
                      <div className="relative mx-auto max-w-sm lg:mx-0">
                        <div className="h-48 w-full overflow-hidden rounded bg-gray-100 md:h-60 lg:w-80">
                          {content.image ? (
                            <Image
                              src={content.image}
                              alt={content.title}
                              width={300}
                              height={200}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl font-semibold text-gray-400">
                              📝
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full px-4 lg:flex lg:w-1/2 lg:justify-start lg:px-0 lg:pl-12">
                      <div className="relative z-10 space-y-3 bg-white md:space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900 md:text-lg">Step {index + 1}</h3>
                        </div>
                        <div className="text-xl leading-tight font-semibold text-gray-900 md:text-2xl">
                          {content.title}
                        </div>
                        <div className="text-base leading-relaxed text-gray-600 md:text-lg">
                          {content.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>{' '}
      </div>
    </div>
  );
};
