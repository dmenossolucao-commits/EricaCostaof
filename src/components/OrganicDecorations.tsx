import React from 'react';

interface DecorationProps {
  className?: string;
  variant?: 'gold' | 'sage' | 'brown';
  opacity?: number;
}

export const BotanicalBranch: React.FC<DecorationProps> = ({
  className = '',
  variant = 'gold',
  opacity = 0.4,
}) => {
  const strokeColor =
    variant === 'gold' ? '#C88A12' : variant === 'sage' ? '#858B72' : '#453426';

  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M60 175C60 120 58 60 70 5"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Leaf 1 Right */}
      <path
        d="M61 140C72 135 88 138 90 148C80 152 66 148 61 140Z"
        fill={strokeColor}
        fillOpacity="0.15"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {/* Leaf 2 Left */}
      <path
        d="M60 115C48 110 32 113 30 123C40 127 55 123 60 115Z"
        fill={strokeColor}
        fillOpacity="0.15"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {/* Leaf 3 Right */}
      <path
        d="M60 90C74 84 89 88 91 98C81 102 66 98 60 90Z"
        fill={strokeColor}
        fillOpacity="0.15"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {/* Leaf 4 Left */}
      <path
        d="M60 65C47 59 33 62 31 72C41 76 55 72 60 65Z"
        fill={strokeColor}
        fillOpacity="0.15"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {/* Leaf 5 Right */}
      <path
        d="M63 40C75 34 86 38 88 47C78 51 68 47 63 40Z"
        fill={strokeColor}
        fillOpacity="0.15"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {/* Tip Leaf */}
      <path
        d="M70 5C68 15 72 25 76 28C80 20 78 10 70 5Z"
        fill={strokeColor}
        fillOpacity="0.25"
        stroke={strokeColor}
        strokeWidth="1"
      />
    </svg>
  );
};

export const MinimalLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-4 h-4',
  color = '#C88A12',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    <path
      d="M12 22C12 22 19 18 19 11C19 6 15 2 12 2C9 2 5 6 5 11C5 18 12 22 12 22Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V22"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M12 7C14 8 16 9.5 16 11"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 12C10 13 8 14.5 8 16"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

export const OrganicBlob: React.FC<{
  className?: string;
  variant?: 'gold' | 'sage' | 'cream';
  opacity?: number;
}> = ({ className = '', variant = 'gold', opacity = 0.25 }) => {
  const bgClass =
    variant === 'gold'
      ? 'from-[#F4DFC0] via-[#F8E7C5] to-[#FFF8EA]'
      : variant === 'sage'
      ? 'from-[#EBF0E6] via-[#F4DFC0]/40 to-transparent'
      : 'from-[#F8E7C5] via-[#FFF8EA] to-transparent';

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-tr ${bgClass} blur-2xl pointer-events-none -z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export const EditorialDivider: React.FC<{ className?: string }> = ({
  className = 'my-8 sm:my-12',
}) => (
  <div className={`flex items-center justify-center gap-3 w-full max-w-xs mx-auto ${className}`}>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C88A12]/40" />
    <span className="w-1.5 h-1.5 rounded-full bg-[#C88A12]/60" />
    <MinimalLeaf className="w-4 h-4 text-[#858B72]" color="#858B72" />
    <span className="w-1.5 h-1.5 rounded-full bg-[#C88A12]/60" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C88A12]/40" />
  </div>
);
