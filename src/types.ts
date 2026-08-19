export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year?: string;
  visible?: boolean;
}

export interface ExperienceItem {
  id?: string;
  title: string;
  institution?: string;
  period?: string;
  description?: string;
  visible?: boolean;
}

export interface SpecializationItem {
  id?: string;
  title: string;
  visible?: boolean;
}

export interface PsychologistProfile {
  name: string;
  title: string;
  crp: string;
  crpRegion: string;
  photo: string;
  secondaryPhoto?: string;
  bio: string;
  shortBio: string;
  approach: string; // ex: Terapia Cognitivo-Comportamental (TCC) e Humanista
  education: EducationItem[];
  specializations: Array<string | SpecializationItem>;
  experiences: Array<string | ExperienceItem>;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  // Public Visibility Toggles for administrator
  showBio?: boolean;
  showApproach?: boolean;
  showEducation?: boolean;
  showSpecializations?: boolean;
  showExperiences?: boolean;
  showSocialLinks?: boolean;
  showCrpBadge?: boolean;
}

export type ThemeColor = 'sage' | 'warm' | 'terracotta' | 'lavender' | 'ocean' | 'sand' | 'geometric';

export type AttendanceInfo = AttendanceModalities;
export type StepItem = TherapyStep;

export interface SiteConfig {
  brandName: string;
  tagline: string;
  themeColor: ThemeColor;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    showStats: boolean;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
  whatsapp: {
    number: string; // apenas numeros com DDI/DDD, ex: 5511999999999
    displayNumber: string; // ex: (11) 99999-9999
    defaultMessage: string;
    appointmentMessage: string;
    doubtMessage: string;
    showFloatingButton: boolean;
    floatingButtonTooltip: string;
    onlineStatusText: string;
  };
  contact: {
    email: string;
    phone?: string;
    address: string;
    neighborhood?: string;
    city: string;
    state: string;
    postalCode?: string;
    googleMapsUrl?: string;
    businessHours: string;
    emergencyNotice: string;
  };
  seo: {
    siteTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
    author: string;
  };
  legal: {
    privacyPolicy: string;
    termsOfUse: string;
    cfpEthicsNotice: string;
  };
}

export interface Specialty {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  benefits: string[];
  active: boolean;
  order: number;
}

export interface AttendanceOption {
  active: boolean;
  title: string;
  location?: string;
  duration: string;
  description: string;
  address?: string;
  environment?: string;
  platform?: string;
  reach?: string;
  features: string[];
}

export interface AttendanceModalities {
  introTitle: string;
  introDescription: string;
  inPerson: AttendanceOption;
  presential?: AttendanceOption;
  online: AttendanceOption;
  pricingNotice: string;
  reimbursementNotice: string;
}

export interface TherapyStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  patientName: string;
  roleOrContext: string;
  quote: string;
  rating: number;
  date: string;
  active: boolean;
  isSample: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  readTimeMinutes: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  preferredContact: 'whatsapp' | 'email' | 'phone';
}

export type AppointmentStatus = 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'remarcada';
export type AppointmentModality = 'presencial' | 'online';
export type ActivityType = 'consulta' | 'reuniao' | 'pessoal' | 'estudo' | 'evento' | 'outro';
export type ActivityStatus = 'agendado' | 'concluido' | 'cancelado';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string; // Observações administrativas e financeiras (nunca dados clínicos)
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  modality: AppointmentModality;
  status: AppointmentStatus;
  accessCode: string; // Ex: HM-8K2P-9M4W
  adminNotes?: string;
  publicMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateActivity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: ActivityType;
  notes?: string;
  patientId?: string;
  patientName?: string;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Strictly minimal and anonymized public appointment projection.
 * Excludes all PII: NO patient names, NO phone, NO email, NO notes, NO prices.
 */
export interface PublicAppointmentView {
  accessCode: string;
  date: string;
  time: string;
  durationMinutes: number;
  modality: AppointmentModality;
  status: AppointmentStatus;
  psychologistName: string;
  psychologistCrp: string;
  publicMessage?: string;
  locationOrLink?: string;
  updatedAt?: string;
}

export interface SiteData {
  profile: PsychologistProfile;
  config: SiteConfig;
  specialties: Specialty[];
  attendance: AttendanceModalities;
  steps: TherapyStep[];
  faq: FAQItem[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  messages: ContactMessage[];
  patients: Patient[];
  appointments: Appointment[];
  privateActivities: PrivateActivity[];
  lastUpdated: string;
}
