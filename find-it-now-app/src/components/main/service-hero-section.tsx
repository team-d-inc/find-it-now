import { TextAnimate } from '../magicui/text-animate';
import { OrganizationEmailForm } from './organization-email-form';

export const ServiceHeroSection = () => {
  return (
    <div
      className="relative grid min-h-svh items-center bg-[url(/image-service.jpg)] bg-cover px-10 py-10 before:absolute before:-inset-0 before:block before:bg-black/60 lg:px-20"
      id="Home"
    >
      <div className="relative z-20 mx-auto w-full px-0 md:px-10">
        <div className="py-5 text-center md:py-30">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-6xl">
            <TextAnimate>Connecting people to return</TextAnimate>
            <TextAnimate>lost items easily & securely</TextAnimate>
          </h2>
        </div>
        <div className="grid place-items-center">
          <OrganizationEmailForm />
        </div>
      </div>
    </div>
  );
};
