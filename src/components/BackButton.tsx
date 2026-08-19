import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSite, AppRoute } from '../context/SiteContext';

interface BackButtonProps {
  label?: string;
  fallbackRoute?: AppRoute;
  className?: string;
  onClick?: () => void;
  variant?: 'subtle' | 'pill' | 'dark';
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Voltar',
  fallbackRoute = 'home',
  className = '',
  onClick,
  variant = 'pill',
}) => {
  const { goBack } = useSite();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      goBack(fallbackRoute);
    }
  };

  const variantStyles = {
    pill: 'bg-[#FFFDF8] hover:bg-[#FFF8EA] text-[#33251A] hover:text-[#C88A12] border border-[#E8DACB] shadow-2xs hover:shadow-xs active:scale-95',
    subtle: 'text-[#5A4535] hover:text-[#33251A] hover:bg-[#F8E7C5]/30 active:scale-95',
    dark: 'bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-xs active:scale-95',
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      id={`back-btn-${fallbackRoute}`}
      className={`inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C88A12]/30 select-none ${variantStyles[variant]} ${className}`}
      aria-label={label}
      title={label}
    >
      <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  );
};
