import Image from 'next/image';
import { TextAnimate } from '../magicui/text-animate';
import { FilePlus2, Bell, Sparkles, ShieldCheck } from 'lucide-react';

export const IntroSection = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center gap-10 bg-gradient-to-b from-white to-gray-50 px-20"
      id="Features"
    >
      <div className="flex-1 space-y-4">
        <h2 className="mb-6 text-3xl font-semibold md:text-6xl">
          <TextAnimate animation="fadeIn" by="line">
            Simple. Fast. Reliable.
          </TextAnimate>
        </h2>
        <p className="text-lg">
          From real-time updates to effortless matching, everything is designed to help you get your
          belongings back with ease.
        </p>
        <div className="mt-8 ml-5 space-y-4 md:space-y-8">
          <div className="flex items-center gap-3">
            <FilePlus2 className="h-5 w-5 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Item Reporting</h3>
              <p className="text-sm text-gray-600">
                Quickly report what you&apos;ve lost in just a few taps with our intuitive
                interface.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Real-Time Updates</h3>
              <p className="text-sm text-gray-600">
                Stay informed with instant notifications about matches and status changes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Matching</h3>
              <p className="text-sm text-gray-600">
                Our AI system connects your report with found items effortlessly and accurately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Secure Reconnection</h3>
              <p className="text-sm text-gray-600">
                Safely get your belongings back through a simple and trusted verification process.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <Image src="/features/mockup_image.svg" alt="Mockup" width={1000} height={1000} />
      </div>
    </div>
  );
};
