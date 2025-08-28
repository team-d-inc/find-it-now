import Image from 'next/image';

export const LogoHeader = () => {
  return (
    <div className="top-0 left-0 z-50 block flex w-full items-center bg-white/10 px-4 py-3 backdrop-blur-sm sm:fixed sm:px-8 sm:py-4 lg:px-15">
      <Image src="/logo.svg" alt="Logo" width={40} height={40} />
      <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">FindItNow</h1>
    </div>
  );
};
