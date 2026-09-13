import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  SiteData,
  PsychologistProfile,
  SiteConfig,
  Specialty,
  AttendanceModalities,
  TherapyStep,
  FAQItem,
  Testimonial,
  BlogPost,
  ContactMessage,
  ThemeColor,
  Patient,
  Appointment,
  PrivateActivity,
  PublicAppointmentView,
  PublicSiteData,
  AdminPrivateData,
  isAuthorizedAdminEmail,
  AUTHORIZED_ADMIN_EMAILS,
} from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import {
  auth,
  ensureAuthUser,
  testFirebaseConnection,
  loginWithEmailAndPassword,
  registerAdminWithEmailAndPassword,
  sendEmailVerificationToUser,
  sendAdminPasswordReset,
  changeCurrentUserPassword,
  reloadAdminUser,
  logoutAdminUser,
  getFriendlyAuthErrorMessage,
  createPatientRecord,
  updatePatientRecord,
  deletePatientRecord,
  createAppointmentRecord,
  updateAppointmentRecord,
  deleteAppointmentRecord,
  createPrivateActivityRecord,
  updatePrivateActivityRecord,
  deletePrivateActivityRecord,
  createMessageRecord,
  lookupPublicAppointmentByCode,
  normalizeAccessCode,
  savePublicProjectionRecord,
  savePublicDataToCloud,
  getPublicDataFromCloud,
  subscribePublicDataFromCloud,
  saveAdminDataToCloud,
  getAdminDataFromCloud,
  subscribeAdminDataFromCloud,
} from '../lib/firebase';

const PUBLIC_STORAGE_KEY = 'psicologia_public_site_data_v3';
const SESSION_ADMIN_DATA_KEY = 'psico_admin_private_data_v2';
const SESSION_STORAGE_KEY = 'psico_admin_session_start_v2';
export const MAX_SESSION_SECONDS = 3600; // 1 hour absolute maximum
export const WARNING_THRESHOLD_SECONDS = 300; // 5 minutes

export type AppRoute =
  | 'home'
  | 'about'
  | 'specialties'
  | 'specialty-detail'
  | 'attendance'
  | 'how-it-works'
  | 'blog'
  | 'article'
  | 'faq'
  | 'testimonials'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'consultation'
  | 'admin';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

// Generate high-entropy, cryptographically strong appointment codes (e.g. HM-7K9W-4M2P)
export function generateAppointmentCode(prefix: string = 'HM'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 characters, excludes ambiguous 0, O, 1, I
  let part1 = '';
  let part2 = '';

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint8Array(8);
    window.crypto.getRandomValues(buffer);
    for (let i = 0; i < 4; i++) {
      part1 += chars[buffer[i] % chars.length];
      part2 += chars[buffer[i + 4] % chars.length];
    }
  } else {
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return `${prefix}-${part1}-${part2}`;
}

interface SiteContextType {
  data: SiteData;
  adminUser: User | null;
  isAdmin: boolean;
  isAdminLoggedIn: boolean;
  adminAuthLoading: boolean;
  sessionRemainingSeconds: number;
  isSessionWarningOpen: boolean;
  currentRoute: AppRoute;
  routeParams: string | null;
  currentArticleSlug: string | null;
  selectedSpecialtyId: string | null;
  adminActiveTab: string;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  navigateTo: (route: AppRoute, param?: string) => void;
  goBack: (fallbackRoute?: AppRoute) => void;
  setAdminActiveTab: (tab: string) => void;
  
  // Auth & Session Management
  loginAdminWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; emailVerified?: boolean }>;
  registerNewAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resendAdminVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  checkVerificationStatus: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  extendAdminSession: () => void;
  closeSessionWarning: () => void;
  simulateSessionWarning: () => void;
  simulateSessionExpired: () => void;
  
  // Legacy compatibility helpers
  loginAdmin: (password: string) => boolean;
  changeAdminPassword: (newPass: string) => boolean;
  setAdminPassword?: (newPass: string) => void;
  updateLegal: (legal: SiteConfig['legal']) => void;
  updateSEO: (seo: SiteConfig['seo']) => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  resetToDemoData: () => void;

  // Updaters
  updateProfile: (profile: Partial<PsychologistProfile>) => void;
  updateConfig: (config: Partial<SiteConfig>) => void;
  updateThemeColor: (color: ThemeColor) => void;
  updateAttendance: (attendance: Partial<AttendanceModalities>) => void;
  updateSteps: (steps: TherapyStep[]) => void;
  
  // Specialties
  addSpecialty: (specialty: Omit<Specialty, 'id'>) => void;
  updateSpecialty: (id: string, specialty: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;
  toggleSpecialty: (id: string) => void;
  
  // Blog
  addPost: (post: Omit<BlogPost, 'id' | 'views'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  incrementPostViews: (slug: string) => void;
  
  // FAQ
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQ: (items: FAQItem[]) => void;
  
  // Testimonials
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  toggleTestimonial: (id: string) => void;
  
  // Contact messages
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // Patient Management (Admin)
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;

  // Appointment Management (Admin)
  addAppointment: (
    appointmentData: Omit<Appointment, 'id' | 'accessCode' | 'createdAt' | 'updatedAt'>,
    customCode?: string
  ) => Promise<Appointment>;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, notes?: string) => Promise<void>;

  // Private Psychologist Activities (Admin)
  addPrivateActivity: (
    activityData: Omit<PrivateActivity, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PrivateActivity>;
  updatePrivateActivity: (id: string, activityData: Partial<PrivateActivity>) => Promise<void>;
  deletePrivateActivity: (id: string) => Promise<void>;

  // Public Consultation Lookup
  lookupConsultation: (code: string) => Promise<PublicAppointmentView | null>;

  // Data management
  resetToDefaultData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  
  // WhatsApp helpers
  getWhatsAppUrl: (customMessage?: string) => string;
  getAppointmentWhatsAppUrl: (appointment: Appointment, customPatientName?: string) => string;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    // 1. Erase any legacy insecure cache if present
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('psicologia_site_data_v2');
      }
    } catch {}

    // 2. Load strictly public data from localStorage
    let publicSlice: Partial<PublicSiteData> = {};
    try {
      const saved = localStorage.getItem(PUBLIC_STORAGE_KEY);
      if (saved) {
        publicSlice = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar dados públicos locais:', e);
    }

    // 3. Load private data only if already in active authenticated session
    let privateSlice: Partial<AdminPrivateData> = {};
    try {
      const savedPrivate = sessionStorage.getItem(SESSION_ADMIN_DATA_KEY);
      if (savedPrivate) {
        privateSlice = JSON.parse(savedPrivate);
      }
    } catch {}

    return {
      ...INITIAL_SITE_DATA,
      ...publicSlice,
      profile: { ...INITIAL_SITE_DATA.profile, ...(publicSlice.profile || {}) },
      config: { ...INITIAL_SITE_DATA.config, ...(publicSlice.config || {}) },
      // Patients, appointments, private activities and messages are strictly protected
      patients: privateSlice.patients || [],
      appointments: privateSlice.appointments || [],
      privateActivities: privateSlice.privateActivities || [],
      messages: privateSlice.messages || [],
    };
  });

  // Real Firebase Auth state
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState<boolean>(true);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(MAX_SESSION_SECONDS);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState<boolean>(false);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [routeParams, setRouteParams] = useState<string | null>(null);
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('agenda');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ route: AppRoute; param?: string }>>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous && isAuthorizedAdminEmail(user.email)) {
        setAdminUser(user);
        if (user.emailVerified) {
          const savedStart = sessionStorage.getItem(SESSION_STORAGE_KEY);
          if (!savedStart) {
            const now = Date.now();
            sessionStorage.setItem(SESSION_STORAGE_KEY, now.toString());
            setSessionStartTime(now);
          }
        }
      } else {
        setAdminUser(null);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_ADMIN_DATA_KEY);
        setSessionStartTime(null);
        setIsSessionWarningOpen(false);
      }
      setAdminAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1-Hour Session Timer Monitor
  useEffect(() => {
    if (!adminUser || !adminUser.emailVerified || !sessionStartTime) {
      return;
    }

    const checkSession = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionStartTime) / 1000);
      const remaining = MAX_SESSION_SECONDS - elapsed;

      if (remaining <= 0) {
        // Expire session
        setSessionRemainingSeconds(0);
        setIsSessionWarningOpen(false);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_ADMIN_DATA_KEY);
        setSessionStartTime(null);
        logoutAdminUser().catch(() => {});
        setAdminUser(null);
        setData((prev) => ({
          ...prev,
          patients: [],
          appointments: [],
          privateActivities: [],
          messages: [],
        }));
        setCurrentRoute('admin');
        window.location.hash = 'admin';
        showToast('Sua sessão expirou por segurança. Faça login novamente.', 'error');
      } else {
        setSessionRemainingSeconds(remaining);
        if (remaining <= WARNING_THRESHOLD_SECONDS) {
          setIsSessionWarningOpen(true);
        } else {
          setIsSessionWarningOpen(false);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [adminUser, sessionStartTime]);

  // Is logged in strictly when Firebase user is present, not anonymous, authorized in allowlist, email verified, and session valid
  const isAdminLoggedIn = Boolean(
    adminUser &&
    !adminUser.isAnonymous &&
    isAuthorizedAdminEmail(adminUser.email) &&
    adminUser.emailVerified &&
    sessionRemainingSeconds > 0
  );
  const isAdmin = isAdminLoggedIn;

  // Initialize Firebase connection and synchronize Public SiteData with Cloud Firestore
  useEffect(() => {
    let isSubscribed = true;

    const initPublicSync = async () => {
      await testFirebaseConnection();
      await ensureAuthUser();

      try {
        const cloudPublic = await getPublicDataFromCloud();
        if (cloudPublic && isSubscribed) {
          setData((prev) => ({
            ...prev,
            ...cloudPublic,
            profile: { ...INITIAL_SITE_DATA.profile, ...(prev.profile || {}), ...(cloudPublic.profile || {}) },
            config: { ...INITIAL_SITE_DATA.config, ...(prev.config || {}), ...(cloudPublic.config || {}) },
            specialties: cloudPublic.specialties || prev.specialties,
            attendance: cloudPublic.attendance || prev.attendance,
            steps: cloudPublic.steps || prev.steps,
            faq: cloudPublic.faq || prev.faq,
            testimonials: cloudPublic.testimonials || prev.testimonials,
            posts: cloudPublic.posts || prev.posts,
            lastUpdated: cloudPublic.lastUpdated || prev.lastUpdated,
          }));
        }
      } catch (err) {
        console.warn('Sync notice: public data load error:', err);
      }
    };

    initPublicSync();

    // Subscribe to cloud Firestore publicData snapshot for real-time visitor updates
    const unsubscribeSnapshot = subscribePublicDataFromCloud((cloudPublic) => {
      if (!isSubscribed || !cloudPublic) return;
      setData((prev) => {
        if (cloudPublic.lastUpdated && cloudPublic.lastUpdated === prev.lastUpdated) {
          return prev;
        }
        return {
          ...prev,
          ...cloudPublic,
          profile: { ...INITIAL_SITE_DATA.profile, ...(prev.profile || {}), ...(cloudPublic.profile || {}) },
          config: { ...INITIAL_SITE_DATA.config, ...(prev.config || {}), ...(cloudPublic.config || {}) },
          specialties: cloudPublic.specialties || prev.specialties,
          attendance: cloudPublic.attendance || prev.attendance,
          steps: cloudPublic.steps || prev.steps,
          faq: cloudPublic.faq || prev.faq,
          testimonials: cloudPublic.testimonials || prev.testimonials,
          posts: cloudPublic.posts || prev.posts,
          lastUpdated: cloudPublic.lastUpdated || prev.lastUpdated,
        };
      });
    });

    return () => {
      isSubscribed = false;
      unsubscribeSnapshot();
    };
  }, []);

  // Synchronize Private Admin Data (patients, appointments, private activities, messages)
  // ONLY when user is authenticated as an authorized administrator
  useEffect(() => {
    if (!isAdminLoggedIn) {
      // Clear private data from state and session when logged out
      setData((prev) => ({
        ...prev,
        patients: [],
        appointments: [],
        privateActivities: [],
        messages: [],
      }));
      try {
        sessionStorage.removeItem(SESSION_ADMIN_DATA_KEY);
      } catch {}
      return;
    }

    let isSubscribed = true;

    const loadAdminData = async () => {
      try {
        const cloudAdmin = await getAdminDataFromCloud();
        if (cloudAdmin && isSubscribed) {
          setData((prev) => ({
            ...prev,
            patients: cloudAdmin.patients || prev.patients || [],
            appointments: cloudAdmin.appointments || prev.appointments || [],
            privateActivities: cloudAdmin.privateActivities || prev.privateActivities || [],
            messages: cloudAdmin.messages || prev.messages || [],
          }));
        }
      } catch (err) {
        console.warn('Sync notice: admin private data load:', err);
      }

      // Proactively ensure sanitized public projections exist in cloud for all appointments
      if (data.appointments && data.appointments.length > 0) {
        for (const apt of data.appointments) {
          if (apt.accessCode) {
            const projection: PublicAppointmentView = {
              accessCode: normalizeAccessCode(apt.accessCode),
              date: apt.date,
              time: apt.time,
              durationMinutes: apt.durationMinutes,
              modality: apt.modality,
              status: apt.status,
              psychologistName: data.profile.name,
              psychologistCrp: data.profile.crp,
              publicMessage: apt.publicMessage,
              locationOrLink:
                apt.modality === 'presencial'
                  ? data.config.contact.address
                  : 'Link de videochamada enviado pela psicóloga',
              updatedAt: apt.updatedAt || new Date().toISOString(),
            };
            savePublicProjectionRecord(apt.accessCode, projection).catch(() => {});
          }
        }
      }
    };

    loadAdminData();

    // Subscribe to cloud Firestore adminData snapshot for real-time admin sync
    const unsubscribeAdmin = subscribeAdminDataFromCloud((cloudAdmin) => {
      if (!isSubscribed || !cloudAdmin) return;
      setData((prev) => {
        if (cloudAdmin.lastUpdated && cloudAdmin.lastUpdated === prev.lastUpdated) {
          return prev;
        }
        return {
          ...prev,
          patients: cloudAdmin.patients || prev.patients || [],
          appointments: cloudAdmin.appointments || prev.appointments || [],
          privateActivities: cloudAdmin.privateActivities || prev.privateActivities || [],
          messages: cloudAdmin.messages || prev.messages || [],
        };
      });
    });

    return () => {
      isSubscribed = false;
      unsubscribeAdmin();
    };
  }, [isAdminLoggedIn]);

  // Persist data: strictly segregated
  // Public data -> localStorage (and cloud if admin)
  // Private data -> sessionStorage (and cloud only if admin)
  useEffect(() => {
    // 1. Separate public slice
    const publicSlice: PublicSiteData = {
      profile: data.profile,
      config: data.config,
      specialties: data.specialties,
      attendance: data.attendance,
      steps: data.steps,
      faq: data.faq,
      testimonials: data.testimonials,
      posts: data.posts,
      lastUpdated: data.lastUpdated,
    };

    try {
      localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify(publicSlice));
      // Always purge old unified key
      localStorage.removeItem('psicologia_site_data_v2');
    } catch (e) {
      console.error('Erro ao salvar dados públicos no localStorage:', e);
    }

    // 2. Private data & Cloud synchronization (Admin only)
    if (isAdminLoggedIn) {
      const privateSlice: AdminPrivateData = {
        patients: data.patients || [],
        appointments: data.appointments || [],
        privateActivities: data.privateActivities || [],
        messages: data.messages || [],
        lastUpdated: data.lastUpdated,
      };

      try {
        sessionStorage.setItem(SESSION_ADMIN_DATA_KEY, JSON.stringify(privateSlice));
      } catch {}

      const timer = setTimeout(() => {
        savePublicDataToCloud(publicSlice).catch((e) => {
          console.warn('Public cloud save notice:', e);
        });
        saveAdminDataToCloud(privateSlice).catch((e) => {
          console.warn('Admin cloud save notice:', e);
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [data, isAdminLoggedIn]);

  // Handle URL hash and pathname changes for friendly navigation
  useEffect(() => {
    const handleHashAndPathChange = () => {
      const pathname = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '');
      const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();

      // Determine target route from hash first, then pathname
      const target = hash || pathname.replace(/^\//, '');

      if (
        pathname === '/admin' ||
        target === 'admin' ||
        target.startsWith('admin/') ||
        target.startsWith('admin')
      ) {
        setCurrentRoute('admin');
        return;
      }
      if (target.startsWith('blog/')) {
        const slug = target.replace('blog/', '');
        setCurrentRoute('article');
        setCurrentArticleSlug(slug);
        setRouteParams(slug);
      } else if (target.startsWith('especialidade/')) {
        const specId = target.replace('especialidade/', '');
        setCurrentRoute('specialty-detail');
        setSelectedSpecialtyId(specId);
        setRouteParams(specId);
      } else if (target.startsWith('consulta/') || target.startsWith('consultar/')) {
        const rawCode = target.replace('consulta/', '').replace('consultar/', '');
        const code = normalizeAccessCode(decodeURIComponent(rawCode));
        setCurrentRoute('consultation');
        setRouteParams(code);
      } else if (target === 'consulta' || target === 'consultar') {
        setCurrentRoute('consultation');
        setRouteParams(null);
      } else if (target === 'blog') {
        setCurrentRoute('blog');
      } else if (target === 'privacidade') {
        setCurrentRoute('privacy');
      } else if (target === 'termos') {
        setCurrentRoute('terms');
      } else if (target === 'contato') {
        setCurrentRoute('contact');
      } else if (target === 'sobre') {
        setCurrentRoute('about');
      } else if (target === 'especialidades') {
        setCurrentRoute('specialties');
      } else if (target === 'atendimento') {
        setCurrentRoute('attendance');
      } else if (target === 'faq') {
        setCurrentRoute('faq');
      } else if (!target || target === 'home' || target === 'inicio') {
        setCurrentRoute('home');
      }
    };

    handleHashAndPathChange();
    window.addEventListener('hashchange', handleHashAndPathChange);
    window.addEventListener('popstate', handleHashAndPathChange);
    return () => {
      window.removeEventListener('hashchange', handleHashAndPathChange);
      window.removeEventListener('popstate', handleHashAndPathChange);
    };
  }, []);

  const navigateTo = (route: AppRoute, param?: string) => {
    // Only push to history if route or param changed
    if (route !== currentRoute || (param && param !== routeParams)) {
      setNavigationHistory((prev) => [
        ...prev.filter((h) => h.route !== currentRoute || h.param !== routeParams),
        { route: currentRoute, param: routeParams || undefined },
      ]);
    }
    setCurrentRoute(route);
    setRouteParams(param || null);

    if (route === 'article' && param) {
      setCurrentArticleSlug(param);
      window.location.hash = `blog/${param}`;
    } else if (route === 'specialty-detail' && param) {
      setSelectedSpecialtyId(param);
      window.location.hash = `especialidade/${param}`;
    } else if (route === 'consultation') {
      window.location.hash = param ? `consulta/${param}` : 'consulta';
    } else if (route === 'admin') {
      window.location.hash = 'admin';
    } else if (route === 'blog') {
      window.location.hash = 'blog';
    } else if (route === 'privacy') {
      window.location.hash = 'privacidade';
    } else if (route === 'terms') {
      window.location.hash = 'termos';
    } else if (route === 'contact') {
      window.location.hash = 'contato';
    } else if (route === 'home') {
      setSelectedSpecialtyId(null);
      setCurrentArticleSlug(null);
      try {
        if (window.location.hash) {
          window.location.hash = '';
        }
      } catch {}
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = (fallbackRoute: AppRoute = 'home') => {
    // Look through history for a previous route distinct from current
    if (navigationHistory.length > 0) {
      const historyCopy = [...navigationHistory];
      while (historyCopy.length > 0) {
        const prevItem = historyCopy.pop();
        if (
          prevItem &&
          (prevItem.route !== currentRoute || (prevItem.param && prevItem.param !== routeParams))
        ) {
          setNavigationHistory(historyCopy);
          setCurrentRoute(prevItem.route);
          setRouteParams(prevItem.param || null);
          if (prevItem.route === 'article' && prevItem.param) {
            window.location.hash = `blog/${prevItem.param}`;
          } else if (prevItem.route === 'consultation') {
            window.location.hash = prevItem.param ? `consulta/${prevItem.param}` : 'consulta';
          } else if (prevItem.route === 'home') {
            window.location.hash = '';
          } else {
            window.location.hash = prevItem.route;
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    }
    // Guaranteed fallback navigation to home or specified route
    navigateTo(fallbackRoute);
  };

  // ======================== AUTH & SESSION HANDLERS ========================

  const loginAdminWithEmail = async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        return {
          success: false,
          error: 'Acesso não autorizado: este e-mail não possui permissão administrativa.',
        };
      }

      const user = await loginWithEmailAndPassword(cleanEmail, pass);
      setAdminUser(user);

      if (!user.emailVerified) {
        return {
          success: false,
          emailVerified: false,
          error: 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e confirme o link recebido.',
        };
      }

      const now = Date.now();
      sessionStorage.setItem(SESSION_STORAGE_KEY, now.toString());
      setSessionStartTime(now);
      setSessionRemainingSeconds(MAX_SESSION_SECONDS);
      setIsSessionWarningOpen(false);
      showToast('Bem-vinda ao painel administrativo!', 'success');
      return { success: true, emailVerified: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const registerNewAdmin = async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        return {
          success: false,
          error:
            'Cadastro não autorizado: este e-mail não possui permissão prévia para gerenciar este consultório.',
        };
      }

      const user = await registerAdminWithEmailAndPassword(cleanEmail, pass);
      setAdminUser(user);
      showToast('Conta criada! Enviamos um link de confirmação para seu e-mail.', 'success');
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const resendAdminVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Nenhum usuário logado para reenviar confirmação.' };
      }
      await sendEmailVerificationToUser(user);
      showToast('Link de confirmação reenviado para seu e-mail!', 'success');
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const user = await reloadAdminUser();
      if (user && isAuthorizedAdminEmail(user.email)) {
        setAdminUser(user);
        if (user.emailVerified) {
          const now = Date.now();
          sessionStorage.setItem(SESSION_STORAGE_KEY, now.toString());
          setSessionStartTime(now);
          setSessionRemainingSeconds(MAX_SESSION_SECONDS);
          setIsSessionWarningOpen(false);
          showToast('E-mail confirmado com sucesso! Acesso administrativo liberado.', 'success');
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        return {
          success: false,
          error: 'E-mail não autorizado para recuperação administrativa.',
        };
      }

      await sendAdminPasswordReset(cleanEmail);
      showToast('Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.', 'info');
      return { success: true };
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/invalid-email') {
        return { success: false, error: 'Formato de e-mail inválido. Digite um e-mail válido.' };
      }
      showToast('Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.', 'info');
      return { success: true };
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    try {
      if (newPass.length < 6) {
        showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
        return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
      }
      await changeCurrentUserPassword(currentPass, newPass);
      showToast('Senha administrativa atualizada com sucesso!', 'success');
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logoutAdmin = async () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_ADMIN_DATA_KEY);
    setSessionStartTime(null);
    setSessionRemainingSeconds(0);
    setIsSessionWarningOpen(false);
    try {
      await logoutAdminUser();
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    setAdminUser(null);
    setData((prev) => ({
      ...prev,
      patients: [],
      appointments: [],
      privateActivities: [],
      messages: [],
    }));
    setCurrentRoute('admin');
    window.location.hash = 'admin';
    showToast('Você saiu do painel administrativo.', 'info');
  };

  const extendAdminSession = () => {
    const now = Date.now();
    sessionStorage.setItem(SESSION_STORAGE_KEY, now.toString());
    setSessionStartTime(now);
    setSessionRemainingSeconds(MAX_SESSION_SECONDS);
    setIsSessionWarningOpen(false);
    showToast('Sessão administrativa renovada por mais 1 hora.', 'success');
  };

  const closeSessionWarning = () => {
    setIsSessionWarningOpen(false);
  };

  // Simulation test tools for verification without waiting 1 full hour
  const simulateSessionWarning = () => {
    const simulatedStart = Date.now() - (MAX_SESSION_SECONDS - 270) * 1000;
    sessionStorage.setItem(SESSION_STORAGE_KEY, simulatedStart.toString());
    setSessionStartTime(simulatedStart);
    setSessionRemainingSeconds(270);
    setIsSessionWarningOpen(true);
    showToast('Simulação: Aviso de 5 minutos de expiração ativado.', 'info');
  };

  const simulateSessionExpired = async () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSessionStartTime(null);
    setSessionRemainingSeconds(0);
    setIsSessionWarningOpen(false);
    await logoutAdminUser().catch(() => {});
    setAdminUser(null);
    setCurrentRoute('admin');
    window.location.hash = 'admin';
    showToast('Sua sessão expirou por segurança. Faça login novamente.', 'error');
  };

  // Legacy compatibility aliases
  const loginAdmin = (_pass: string): boolean => {
    return false;
  };

  const changeAdminPassword = (_newPass: string): boolean => {
    return false;
  };

  const setAdminPassword = (_newPass: string) => {};

  const updateLegal = (legal: SiteConfig['legal']) => {
    setData((prev) => ({
      ...prev,
      config: { ...prev.config, legal },
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Termos legais atualizados com sucesso!', 'success');
  };

  const updateSEO = (seo: SiteConfig['seo']) => {
    setData((prev) => ({
      ...prev,
      config: { ...prev.config, seo },
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Configurações de SEO salvas!', 'success');
  };

  const exportBackupJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_psicologia_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!', 'success');
  };

  const importBackupJSON = (jsonString: string): boolean => {
    return importDataJSON(jsonString);
  };

  const resetToDemoData = () => {
    resetToDefaultData();
  };

  // Updaters
  const updateProfile = (profileUpdate: Partial<PsychologistProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Perfil profissional atualizado!', 'success');
  };

  const updateConfig = (configUpdate: Partial<SiteConfig>) => {
    setData((prev) => ({
      ...prev,
      config: { ...prev.config, ...configUpdate },
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Configurações do site salvas!', 'success');
  };

  const updateThemeColor = (color: ThemeColor) => {
    setData((prev) => ({
      ...prev,
      config: { ...prev.config, themeColor: color },
      lastUpdated: new Date().toISOString(),
    }));
    showToast(`Paleta de cores alterada!`, 'success');
  };

  const updateAttendance = (attendanceUpdate: Partial<AttendanceModalities>) => {
    setData((prev) => ({
      ...prev,
      attendance: { ...prev.attendance, ...attendanceUpdate },
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Modalidades de atendimento atualizadas!', 'success');
  };

  const updateSteps = (steps: TherapyStep[]) => {
    setData((prev) => ({
      ...prev,
      steps,
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Etapas da terapia atualizadas!', 'success');
  };

  // Specialties
  const addSpecialty = (specialty: Omit<Specialty, 'id'>) => {
    const id = `spec-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, { ...specialty, id }],
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Nova especialidade cadastrada com sucesso!', 'success');
  };

  const updateSpecialty = (id: string, specialty: Partial<Specialty>) => {
    setData((prev) => ({
      ...prev,
      specialties: prev.specialties.map((s) => (s.id === id ? { ...s, ...specialty } : s)),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Especialidade atualizada com sucesso!', 'success');
  };

  const deleteSpecialty = (id: string) => {
    setData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Especialidade removida.', 'info');
  };

  const toggleSpecialty = (id: string) => {
    setData((prev) => ({
      ...prev,
      specialties: prev.specialties.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Blog
  const addPost = (post: Omit<BlogPost, 'id' | 'views'>) => {
    const id = `post-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      posts: [{ ...post, id, views: 0 }, ...prev.posts],
      lastUpdated: new Date().toISOString(),
    }));
    showToast(post.published ? 'Artigo publicado no blog com sucesso!' : 'Rascunho do artigo salvo!', 'success');
  };

  const updatePost = (id: string, post: Partial<BlogPost>) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? { ...p, ...post } : p)),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Artigo atualizado com sucesso!', 'success');
  };

  const deletePost = (id: string) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Artigo removido.', 'info');
  };

  const incrementPostViews = (slug: string) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.slug === slug ? { ...p, views: (p.views || 0) + 1 } : p)),
    }));
  };

  // FAQ
  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const id = `faq-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      faq: [...prev.faq, { ...faq, id }],
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Pergunta frequente adicionada!', 'success');
  };

  const updateFAQ = (id: string, faq: Partial<FAQItem>) => {
    setData((prev) => ({
      ...prev,
      faq: prev.faq.map((f) => (f.id === id ? { ...f, ...faq } : f)),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Pergunta frequente atualizada!', 'success');
  };

  const deleteFAQ = (id: string) => {
    setData((prev) => ({
      ...prev,
      faq: prev.faq.filter((f) => f.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Pergunta removida.', 'info');
  };

  const reorderFAQ = (items: FAQItem[]) => {
    setData((prev) => ({
      ...prev,
      faq: items,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Testimonials
  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    const id = `test-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { ...testimonial, id }],
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Depoimento adicionado!', 'success');
  };

  const updateTestimonial = (id: string, testimonial: Partial<Testimonial>) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...testimonial } : t)),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Depoimento atualizado!', 'success');
  };

  const deleteTestimonial = (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
    showToast('Depoimento removido.', 'info');
  };

  const toggleTestimonial = (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Contact
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };
    createMessageRecord(newMsg).catch((e) => console.warn('Message send notice:', e));
    if (isAdminLoggedIn) {
      setData((prev) => ({
        ...prev,
        messages: [newMsg, ...prev.messages],
        lastUpdated: new Date().toISOString(),
      }));
    }
    showToast('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
  };

  const markMessageRead = (id: string) => {
    setData((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
    }));
  };

  const deleteMessage = (id: string) => {
    setData((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id),
    }));
    showToast('Mensagem excluída.', 'info');
  };

  // ======================== PATIENT MANAGEMENT ========================

  const addPatient = async (
    patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Patient> => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      patients: [newPatient, ...prev.patients],
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await createPatientRecord(newPatient);
    } catch (e) {
      console.warn('Sync notice patient save:', e);
    }

    showToast('Paciente cadastrado com sucesso!', 'success');
    return newPatient;
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<void> => {
    setData((prev) => ({
      ...prev,
      patients: prev.patients.map((p) =>
        p.id === id ? { ...p, ...patientData, updatedAt: new Date().toISOString() } : p
      ),
      // Also update patientName in appointments if name was changed
      appointments: patientData.name
        ? prev.appointments.map((a) => (a.patientId === id ? { ...a, patientName: patientData.name! } : a))
        : prev.appointments,
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await updatePatientRecord(id, patientData);
    } catch (e) {
      console.warn('Sync notice patient update:', e);
    }

    showToast('Dados do paciente atualizados!', 'success');
  };

  const deletePatient = async (id: string): Promise<void> => {
    setData((prev) => ({
      ...prev,
      patients: prev.patients.filter((p) => p.id !== id),
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await deletePatientRecord(id);
    } catch (e) {
      console.warn('Sync notice patient delete:', e);
    }

    showToast('Paciente removido com sucesso.', 'info');
  };

  // ======================== APPOINTMENT MANAGEMENT ========================

  const addAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'accessCode' | 'createdAt' | 'updatedAt'>,
    customCode?: string
  ): Promise<Appointment> => {
    const code = customCode || generateAppointmentCode('HM');
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      accessCode: code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Public sanitized projection - STRICTLY MINIMAL & ANONYMIZED (NO patient names or sensitive data)
    const publicProjection: PublicAppointmentView = {
      accessCode: code,
      date: newAppointment.date,
      time: newAppointment.time,
      durationMinutes: newAppointment.durationMinutes,
      modality: newAppointment.modality,
      status: newAppointment.status,
      psychologistName: data.profile.name,
      psychologistCrp: data.profile.crp,
      publicMessage: newAppointment.publicMessage,
      locationOrLink:
        newAppointment.modality === 'presencial'
          ? data.config.contact.address
          : 'Link de videochamada enviado pela psicóloga',
      updatedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      appointments: [newAppointment, ...prev.appointments],
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await createAppointmentRecord(newAppointment, publicProjection);
    } catch (e) {
      console.warn('Sync notice appointment save:', e);
    }

    showToast(`Consulta agendada! Código de acesso gerado: ${code}`, 'success');
    return newAppointment;
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<void> => {
    const existing = data.appointments.find((a) => a.id === id);
    const updated = existing ? { ...existing, ...appointmentData } : null;

    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a.id === id ? { ...a, ...appointmentData, updatedAt: new Date().toISOString() } : a
      ),
      lastUpdated: new Date().toISOString(),
    }));

    if (updated) {
      const publicProjection: Partial<PublicAppointmentView> = {
        date: updated.date,
        time: updated.time,
        durationMinutes: updated.durationMinutes,
        modality: updated.modality,
        status: updated.status,
        publicMessage: updated.publicMessage,
      };

      try {
        await updateAppointmentRecord(id, appointmentData, publicProjection);
      } catch (e) {
        console.warn('Sync notice appointment update:', e);
      }
    }

    showToast('Consulta atualizada com sucesso!', 'success');
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    const existing = data.appointments.find((a) => a.id === id);
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await deleteAppointmentRecord(id, existing?.accessCode);
    } catch (e) {
      console.warn('Sync notice appointment delete:', e);
    }

    showToast('Consulta removida da agenda.', 'info');
  };

  const rescheduleAppointment = async (
    id: string,
    newDate: string,
    newTime: string,
    notes?: string
  ): Promise<void> => {
    const existing = data.appointments.find((a) => a.id === id);
    if (!existing) return;

    const updatedData: Partial<Appointment> = {
      date: newDate,
      time: newTime,
      status: 'remarcada',
      adminNotes: notes ? `${existing.adminNotes ? existing.adminNotes + ' | ' : ''}Remarcada: ${notes}` : existing.adminNotes,
      updatedAt: new Date().toISOString(),
    };

    await updateAppointment(id, updatedData);
    showToast(`Consulta remarcada para ${newDate} às ${newTime}!`, 'success');
  };

  // ======================== PRIVATE ACTIVITY MANAGEMENT ========================

  const addPrivateActivity = async (
    activityData: Omit<PrivateActivity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PrivateActivity> => {
    const newActivity: PrivateActivity = {
      ...activityData,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      privateActivities: [newActivity, ...prev.privateActivities],
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await createPrivateActivityRecord(newActivity);
    } catch (e) {
      console.warn('Sync notice private activity save:', e);
    }

    showToast('Compromisso particular adicionado à agenda!', 'success');
    return newActivity;
  };

  const updatePrivateActivity = async (id: string, activityData: Partial<PrivateActivity>): Promise<void> => {
    setData((prev) => ({
      ...prev,
      privateActivities: prev.privateActivities.map((a) =>
        a.id === id ? { ...a, ...activityData, updatedAt: new Date().toISOString() } : a
      ),
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await updatePrivateActivityRecord(id, activityData);
    } catch (e) {
      console.warn('Sync notice private activity update:', e);
    }

    showToast('Atividade da agenda atualizada!', 'success');
  };

  const deletePrivateActivity = async (id: string): Promise<void> => {
    setData((prev) => ({
      ...prev,
      privateActivities: prev.privateActivities.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString(),
    }));

    try {
      await deletePrivateActivityRecord(id);
    } catch (e) {
      console.warn('Sync notice private activity delete:', e);
    }

    showToast('Atividade removida da agenda.', 'info');
  };

  // ======================== PUBLIC CODE LOOKUP ========================

  const lookupConsultation = async (code: string): Promise<PublicAppointmentView | null> => {
    const cleanCode = normalizeAccessCode(code);
    if (!cleanCode || cleanCode.length < 3) return null;

    // 1. Direct Firestore cloud verification
    try {
      const cloudResult = await lookupPublicAppointmentByCode(cleanCode);
      if (cloudResult) return cloudResult;
    } catch (e) {
      console.warn('Firestore lookup notice:', e);
    }

    // 2. Local fallback if code matches normalized format
    const localMatch = data.appointments.find((a) => {
      const aCode = normalizeAccessCode(a.accessCode);
      const codeWithoutPrefix = cleanCode.replace(/^HM-/, '');
      const aWithoutPrefix = aCode.replace(/^HM-/, '');
      return aCode === cleanCode || (codeWithoutPrefix.length >= 4 && codeWithoutPrefix === aWithoutPrefix);
    });

    if (localMatch) {
      const result: PublicAppointmentView = {
        accessCode: normalizeAccessCode(localMatch.accessCode),
        date: localMatch.date,
        time: localMatch.time,
        durationMinutes: localMatch.durationMinutes,
        modality: localMatch.modality,
        status: localMatch.status,
        psychologistName: data.profile.name,
        psychologistCrp: data.profile.crp,
        publicMessage: localMatch.publicMessage,
        locationOrLink:
          localMatch.modality === 'presencial'
            ? data.config.contact.address
            : 'Atendimento Online - Link enviado no WhatsApp da psicóloga',
        updatedAt: localMatch.updatedAt,
      };

      // Also persist to cloud so future lookups succeed instantly
      savePublicProjectionRecord(localMatch.accessCode, result).catch(() => {});

      return result;
    }

    return null;
  };

  // Data management
  const resetToDefaultData = () => {
    setData(INITIAL_SITE_DATA);
    try {
      const publicSlice: PublicSiteData = {
        profile: INITIAL_SITE_DATA.profile,
        config: INITIAL_SITE_DATA.config,
        specialties: INITIAL_SITE_DATA.specialties,
        attendance: INITIAL_SITE_DATA.attendance,
        steps: INITIAL_SITE_DATA.steps,
        faq: INITIAL_SITE_DATA.faq,
        testimonials: INITIAL_SITE_DATA.testimonials,
        posts: INITIAL_SITE_DATA.posts,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify(publicSlice));
      localStorage.removeItem('psicologia_site_data_v2');
      sessionStorage.removeItem(SESSION_ADMIN_DATA_KEY);
    } catch {}
    showToast('Dados restaurados para o padrão demonstrativo.', 'info');
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.config && parsed.specialties) {
        const fullData: SiteData = {
          ...INITIAL_SITE_DATA,
          ...parsed,
          patients: parsed.patients || [],
          appointments: parsed.appointments || [],
          privateActivities: parsed.privateActivities || [],
          messages: parsed.messages || [],
        };
        setData(fullData);

        if (isAdminLoggedIn) {
          const publicSlice: PublicSiteData = {
            profile: fullData.profile,
            config: fullData.config,
            specialties: fullData.specialties,
            attendance: fullData.attendance,
            steps: fullData.steps,
            faq: fullData.faq,
            testimonials: fullData.testimonials,
            posts: fullData.posts,
            lastUpdated: fullData.lastUpdated,
          };
          const privateSlice: AdminPrivateData = {
            patients: fullData.patients,
            appointments: fullData.appointments,
            privateActivities: fullData.privateActivities,
            messages: fullData.messages,
            lastUpdated: fullData.lastUpdated,
          };
          savePublicDataToCloud(publicSlice).catch(() => {});
          saveAdminDataToCloud(privateSlice).catch(() => {});
        }

        showToast('Dados importados com sucesso!', 'success');
        return true;
      }
      showToast('Arquivo de backup inválido.', 'error');
      return false;
    } catch {
      showToast('Erro ao ler arquivo JSON.', 'error');
      return false;
    }
  };

  // WhatsApp Helpers
  const getWhatsAppUrl = (customMessage?: string) => {
    let rawNumber = data.config.whatsapp.number.replace(/\D/g, '');
    if (rawNumber.length === 10 || rawNumber.length === 11) {
      rawNumber = `55${rawNumber}`;
    }
    const message = customMessage || data.config.whatsapp.defaultMessage;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${rawNumber}?text=${encoded}`;
  };

  const getAppointmentWhatsAppUrl = (appointment: Appointment, customPatientName?: string) => {
    let rawNumber = (appointment.patientPhone || data.config.whatsapp.number).replace(/\D/g, '');
    if (rawNumber.length === 10 || rawNumber.length === 11) {
      rawNumber = `55${rawNumber}`;
    }
    const patientName = customPatientName || appointment.patientName;
    const firstName = patientName.split(' ')[0] || patientName;
    
    // Format date in PT-BR (DD/MM/AAAA)
    let formattedDate = appointment.date;
    try {
      const [year, month, day] = appointment.date.split('-');
      if (year && month && day) {
        formattedDate = `${day}/${month}/${year}`;
      }
    } catch {}

    const modalityText =
      appointment.modality === 'online'
        ? 'Online (via videochamada segura)'
        : `Presencial no consultório (${data.config.contact.address})`;

    const siteUrl = window.location.origin;
    const confirmationLink = `${siteUrl}/#consulta/${appointment.accessCode}`;

    const text = `Olá, *${firstName}*! Tudo bem?\n\nPassando para confirmar os dados da sua consulta psicológica com a *${data.profile.name}* (CRP ${data.profile.crp}):\n\n📅 *Data:* ${formattedDate}\n⏰ *Horário:* ${appointment.time} (duração de ${appointment.durationMinutes || 50} min)\n📍 *Modalidade:* ${modalityText}\n\n🔑 *Código da sua consulta:* \`${appointment.accessCode}\`\n\nVocê também pode consultar as informações da sua consulta a qualquer momento pelo site:\n👉 ${confirmationLink}\n\nQualquer dúvida ou caso precise remarcar, por favor me avise com antecedência. Até logo! 🌿`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${rawNumber}?text=${encoded}`;
  };

  return (
    <SiteContext.Provider
      value={{
        data,
        adminUser,
        isAdmin,
        isAdminLoggedIn,
        adminAuthLoading,
        sessionRemainingSeconds,
        isSessionWarningOpen,
        currentRoute,
        routeParams,
        currentArticleSlug,
        selectedSpecialtyId,
        adminActiveTab,
        toasts,
        showToast,
        removeToast,
        navigateTo,
        goBack,
        setAdminActiveTab,
        loginAdminWithEmail,
        registerNewAdmin,
        resendAdminVerificationEmail,
        checkVerificationStatus,
        sendPasswordReset,
        changePassword,
        logoutAdmin,
        extendAdminSession,
        closeSessionWarning,
        simulateSessionWarning,
        simulateSessionExpired,
        loginAdmin,
        changeAdminPassword,
        setAdminPassword,
        updateLegal,
        updateSEO,
        exportBackupJSON,
        importBackupJSON,
        resetToDemoData,
        updateProfile,
        updateConfig,
        updateThemeColor,
        updateAttendance,
        updateSteps,
        addSpecialty,
        updateSpecialty,
        deleteSpecialty,
        toggleSpecialty,
        addPost,
        updatePost,
        deletePost,
        incrementPostViews,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        reorderFAQ,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleTestimonial,
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        rescheduleAppointment,
        addPrivateActivity,
        updatePrivateActivity,
        deletePrivateActivity,
        lookupConsultation,
        resetToDefaultData,
        exportDataJSON,
        importDataJSON,
        getWhatsAppUrl,
        getAppointmentWhatsAppUrl,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite deve ser utilizado dentro de um SiteProvider');
  }
  return context;
};
