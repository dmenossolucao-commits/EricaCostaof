import { ThemeColor } from '../types';

export interface ThemeClasses {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  primaryText: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  heroGlow: string;
  buttonPrimary: string;
  buttonSecondary: string;
  cardHighlight: string;
  iconBg: string;
}

export const THEME_CONFIGS: Record<ThemeColor, {
  name: string;
  previewColor: string;
  description: string;
  classes: ThemeClasses;
}> = {
  sage: {
    name: 'Acolhimento & Ouro Nobre',
    previewColor: '#C88A12',
    description: 'Tons acolhedores em creme, marrom profundo, dourado mostarda e oliva suave.',
    classes: {
      primary: 'bg-[#33251A]',
      primaryHover: 'hover:bg-[#C88A12]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#C88A12]/30',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#C88A12]',
      badgeBg: 'bg-[#C88A12]/10',
      badgeText: 'text-[#B97808]',
      ring: 'focus:ring-[#C88A12]',
      heroGlow: 'from-[#F8E7C5] via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#C88A12] transition-all duration-200 active:scale-95',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/20',
    },
  },
  geometric: {
    name: 'Creme Editorial & Dourado',
    previewColor: '#C88A12',
    description: 'Design sofisticado e humanizado com tipografia editorial e contrastes quentes.',
    classes: {
      primary: 'bg-[#33251A]',
      primaryHover: 'hover:bg-[#C88A12]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#C88A12]/30',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#C88A12]',
      badgeBg: 'bg-[#C88A12]/10',
      badgeText: 'text-[#B97808]',
      ring: 'focus:ring-[#C88A12]',
      heroGlow: 'from-[#F8E7C5] via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#C88A12] transition-all duration-200 active:scale-95',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/20',
    },
  },
  sand: {
    name: 'Areia Quente & Âmbar',
    previewColor: '#B97808',
    description: 'Tons terrosos e quentes que trazem sensação de aconchego e serenidade.',
    classes: {
      primary: 'bg-[#33251A]',
      primaryHover: 'hover:bg-[#B97808]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#D49A20]/40',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#B97808]',
      badgeBg: 'bg-[#F4DFC0]',
      badgeText: 'text-[#33251A]',
      ring: 'focus:ring-[#B97808]',
      heroGlow: 'from-[#F4DFC0]/80 via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#B97808] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#B97808]',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#B97808] border border-[#B97808]/20',
    },
  },
  warm: {
    name: 'Areia Quente & Âmbar',
    previewColor: '#B97808',
    description: 'Tons terrosos e quentes que trazem sensação de aconchego e serenidade.',
    classes: {
      primary: 'bg-[#33251A]',
      primaryHover: 'hover:bg-[#B97808]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#D49A20]/40',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#B97808]',
      badgeBg: 'bg-[#F4DFC0]',
      badgeText: 'text-[#33251A]',
      ring: 'focus:ring-[#B97808]',
      heroGlow: 'from-[#F4DFC0]/80 via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#B97808] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#B97808]',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#B97808] border border-[#B97808]/20',
    },
  },
  terracotta: {
    name: 'Argila & Terracota Nobre',
    previewColor: '#A05C4D',
    description: 'Sensibilidade e profundidade com tons argila acolhedores e elegantes.',
    classes: {
      primary: 'bg-[#453426]',
      primaryHover: 'hover:bg-[#A05C4D]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#C88A12]/30',
      primaryText: 'text-[#453426]',
      accent: 'text-[#C88A12]',
      badgeBg: 'bg-[#C88A12]/10',
      badgeText: 'text-[#B97808]',
      ring: 'focus:ring-[#C88A12]',
      heroGlow: 'from-[#F8E7C5] via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#C88A12]',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#C88A12]',
    },
  },
  lavender: {
    name: 'Sálvia & Oliva Suave',
    previewColor: '#858B72',
    description: 'Equilíbrio botânico e serenidade com tons de verde oliva e sálvia suave.',
    classes: {
      primary: 'bg-[#858B72]',
      primaryHover: 'hover:bg-[#6E745C]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#858B72]/40',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#858B72]',
      badgeBg: 'bg-[#EBF0E6]',
      badgeText: 'text-[#5C634B]',
      ring: 'focus:ring-[#858B72]',
      heroGlow: 'from-[#EBF0E6]/80 via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#858B72] hover:bg-[#6E745C] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#858B72]',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#EBF0E6] text-[#858B72]',
    },
  },
  ocean: {
    name: 'Oliva Profunda & Dourado',
    previewColor: '#6E745C',
    description: 'Inspirado na tranquilidade e equilíbrio da natureza.',
    classes: {
      primary: 'bg-[#33251A]',
      primaryHover: 'hover:bg-[#C88A12]',
      primaryLight: 'bg-[#FFF8EA]',
      primaryBorder: 'border-[#C88A12]/30',
      primaryText: 'text-[#33251A]',
      accent: 'text-[#C88A12]',
      badgeBg: 'bg-[#C88A12]/10',
      badgeText: 'text-[#B97808]',
      ring: 'focus:ring-[#C88A12]',
      heroGlow: 'from-[#F8E7C5] via-[#FFF8EA] to-transparent',
      buttonPrimary: 'bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200',
      buttonSecondary: 'bg-transparent text-[#33251A] hover:bg-[#FFF8EA] border border-[#C88A12]',
      cardHighlight: 'border-[#E8DACB]',
      iconBg: 'bg-[#FFF8EA] text-[#C88A12]',
    },
  },
};
