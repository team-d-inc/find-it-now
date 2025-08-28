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
    <div className="scroll-mt-16 px-10 py-10 md:py-25 lg:px-20" id="HowItWorks">
      <div className="mx-auto max-w-7xl">
        <div className="text-right">
          <h2 className="text-3xl font-bold md:text-6xl">
            <TextAnimate animate="blurIn" startOnView={true}>
              How FindItNow Works
            </TextAnimate>
          </h2>
        </div>
        <div className="pt-20">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 transform bg-black md:block"></div>
            <div className="space-y-20">
              {processContents.map((content, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-center">
                    <div className="flex w-120 justify-end pr-15">
                      <div className="relative">
                        <div className="h-60 w-80 overflow-hidden rounded bg-gray-100">
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

                    <div className="flex w-120 justify-start pl-15">
                      <div className="relative z-10 space-y-4 bg-white">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">Step {index + 1}</h3>
                        </div>
                        <div className="text-2xl leading-tight font-semibold text-gray-900">
                          {content.title}
                        </div>
                        <div className="text-lg leading-relaxed text-gray-600">
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
