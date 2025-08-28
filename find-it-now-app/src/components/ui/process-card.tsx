import { ReactNode } from 'react';

interface ProcessCardProps {
  number: number;
  title: string;
  description: string;
  icon?: ReactNode;
}

export const ProcessCard = ({
  number,
  title,
  description,
  icon,
}: ProcessCardProps) => {
  return (
    <div className="bg-white rounded shadow-lg p-10">
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      <div className="relative z-10">
        <div className="from-primary to-primary/80 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
          {icon || number}
        </div>
        <h4 className="mb-4 text-xl font-bold text-gray-800">{title}</h4>
        <p className="leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
};
