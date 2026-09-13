import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Patient,
  Appointment,
  PrivateActivity,
  PublicAppointmentView,
  ContactMessage,
  SiteData,
  PublicSiteData,
  AdminPrivateData,
  isAuthorizedAdminEmail,
  AUTHORIZED_ADMIN_EMAILS,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
export const auth = getAuth(app);

// Convert Firebase Auth error codes to user-friendly Portuguese messages
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro ao processar sua solicitação.';
  const code = error?.code || (typeof error === 'string' ? error : error?.message || '');

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido. Utilize um endereço válido (ex: psicologa@dominio.com).';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Faça login ou use a opção Esqueci minha senha.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas consecutivas detectadas. Por segurança, aguarde alguns instantes antes de tentar novamente.';
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado no Firebase. Adicione o domínio (erica-costaof.vercel.app) no Firebase Console em Authentication > Configurações > Domínios autorizados.';
    case 'auth/operation-not-allowed':
      return 'O provedor de E-mail/Senha precisa ser ativado no Firebase Console (Authentication > Sign-in method > E-mail/senha).';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar aos servidores do Firebase. Verifique sua conexão e tente novamente.';
    case 'auth/requires-recent-login':
      return 'Por segurança, confirme sua senha atual antes de alterar suas credenciais.';
    case 'auth/user-disabled':
      return 'Este usuário administrativo foi desativado.';
    case 'auth/expired-action-code':
      return 'O link de verificação ou recuperação expirou. Solicite um novo link.';
    case 'auth/invalid-action-code':
      return 'O link de verificação ou recuperação é inválido ou já foi utilizado.';
    default:
      return error?.message && !error.message.includes('Firebase')
        ? error.message
        : 'Não foi possível realizar o login. Verifique sua conexão e tente novamente.';
  }
}

// ======================== AUTHENTICATION SERVICES ========================

// Authenticate session silently if needed for public operations
export async function ensureAuthUser(): Promise<User | null> {
  try {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Silent auth fallback notice:', err);
    return null;
  }
}

// Administrative Login with Email and Password (Strict Allowlist Validation)
export async function loginWithEmailAndPassword(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    throw new Error('Acesso não autorizado: este e-mail não possui permissão administrativa.');
  }
  const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return cred.user;
}

// Create new administrator account and dispatch verification email (Strict Allowlist Validation)
export async function registerAdminWithEmailAndPassword(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    throw new Error(
      'Cadastro não autorizado: este e-mail não possui permissão prévia para gerenciar este consultório.'
    );
  }
  const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  try {
    await sendEmailVerification(cred.user);
  } catch (e) {
    console.warn('Falha ao enviar e-mail de verificação imediato:', e);
  }
  return cred.user;
}

// Send verification email to currently signed-in user
export async function sendEmailVerificationToUser(user: User): Promise<void> {
  await sendEmailVerification(user);
}

// Send password reset email (Strict Allowlist Validation)
export async function sendAdminPasswordReset(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    throw new Error('E-mail não autorizado para redefinição administrativa.');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

// Re-authenticate and update user password securely
export async function changeCurrentUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('Nenhum usuário administrativo autenticado.');
  }

  // 1. Re-authenticate user with current password
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // 2. Update to new password
  await updatePassword(user, newPassword);
}

// Reload current user state to check emailVerified status
export async function reloadAdminUser(): Promise<User | null> {
  const user = auth.currentUser;
  if (user) {
    await user.reload();
    return auth.currentUser;
  }
  return null;
}

// Sign out from Firebase Authentication
export async function logoutAdminUser(): Promise<void> {
  await signOut(auth);
}

// Test connection on boot
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_check', 'ping'));
    return true;
  } catch (e: any) {
    if (e?.message?.includes('the client is offline')) {
      console.info('Firebase offline mode active.');
    }
    return false;
  }
}

// Collections references
export const COLLECTIONS = {
  PUBLIC_DATA: 'publicData',
  ADMIN_DATA: 'adminData',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  PRIVATE_ACTIVITIES: 'privateActivities',
  PUBLIC_APPOINTMENTS: 'publicAppointments',
  MESSAGES: 'messages',
  SITE_DATA: 'siteData', // Legacy compatibility fallback
};

// ======================== PATIENT SERVICES ========================

export async function createPatientRecord(patient: Patient): Promise<void> {
  const path = `${COLLECTIONS.PATIENTS}/${patient.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.PATIENTS, patient.id), patient);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePatientRecord(patientId: string, data: Partial<Patient>): Promise<void> {
  const path = `${COLLECTIONS.PATIENTS}/${patientId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.PATIENTS, patientId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePatientRecord(patientId: string): Promise<void> {
  const path = `${COLLECTIONS.PATIENTS}/${patientId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PATIENTS, patientId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================== APPOINTMENT SERVICES ========================

export async function createAppointmentRecord(
  appointment: Appointment,
  publicProjection: PublicAppointmentView
): Promise<void> {
  const appointmentPath = `${COLLECTIONS.APPOINTMENTS}/${appointment.id}`;
  const publicPath = `${COLLECTIONS.PUBLIC_APPOINTMENTS}/${appointment.accessCode}`;
  try {
    // 1. Save main appointment
    await setDoc(doc(db, COLLECTIONS.APPOINTMENTS, appointment.id), appointment);
    // 2. Save public projection keyed by accessCode
    await setDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, appointment.accessCode), publicProjection);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, appointmentPath);
  }
}

export async function updateAppointmentRecord(
  appointmentId: string,
  data: Partial<Appointment>,
  publicProjection?: Partial<PublicAppointmentView>
): Promise<void> {
  const path = `${COLLECTIONS.APPOINTMENTS}/${appointmentId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.APPOINTMENTS, appointmentId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    if (data.accessCode && publicProjection) {
      await updateDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, data.accessCode), {
        ...publicProjection,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAppointmentRecord(appointmentId: string, accessCode?: string): Promise<void> {
  const path = `${COLLECTIONS.APPOINTMENTS}/${appointmentId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, appointmentId));
    if (accessCode) {
      await deleteDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, accessCode));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================== PRIVATE ACTIVITY SERVICES ========================

export async function createPrivateActivityRecord(activity: PrivateActivity): Promise<void> {
  const path = `${COLLECTIONS.PRIVATE_ACTIVITIES}/${activity.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.PRIVATE_ACTIVITIES, activity.id), activity);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePrivateActivityRecord(activityId: string, data: Partial<PrivateActivity>): Promise<void> {
  const path = `${COLLECTIONS.PRIVATE_ACTIVITIES}/${activityId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.PRIVATE_ACTIVITIES, activityId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePrivateActivityRecord(activityId: string): Promise<void> {
  const path = `${COLLECTIONS.PRIVATE_ACTIVITIES}/${activityId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRIVATE_ACTIVITIES, activityId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Normalize access codes by stripping spaces, unicode hyphens, and invalid chars
export function normalizeAccessCode(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-') // Normalize unicode dashes (en-dash, em-dash, minus)
    .replace(/\s+/g, '') // Remove all whitespace (e.g. "HM - R9BY - KEYT" -> "HM-R9BY-KEYT")
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .toUpperCase();
}

// ======================== PUBLIC CODE VERIFICATION ========================

export async function lookupPublicAppointmentByCode(accessCode: string): Promise<PublicAppointmentView | null> {
  const cleanCode = normalizeAccessCode(accessCode);
  if (!cleanCode || cleanCode.length < 3) return null;

  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, cleanCode));
    if (docSnap.exists()) {
      return docSnap.data() as PublicAppointmentView;
    }
  } catch (error) {
    console.warn('Public consultation lookup notice:', error);
  }

  // Fallback: if code was typed without 'HM-' prefix (e.g. 'R9BY-KEYT' or '482915'), try with 'HM-' prefix
  if (!cleanCode.startsWith('HM-') && cleanCode.length >= 4) {
    try {
      const prefixed = `HM-${cleanCode}`;
      const docSnap = await getDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, prefixed));
      if (docSnap.exists()) {
        return docSnap.data() as PublicAppointmentView;
      }
    } catch (e) {
      console.warn('Prefix lookup notice:', e);
    }
  }

  return null;
}

export async function savePublicProjectionRecord(
  accessCode: string,
  projection: PublicAppointmentView
): Promise<void> {
  const cleanCode = normalizeAccessCode(accessCode);
  if (!cleanCode) return;

  // Strict sanitization: ensure ONLY public appointment fields are written
  // Never leak patientPhone, patientEmail, adminNotes or internal data
  const sanitizedProjection: PublicAppointmentView = {
    accessCode: cleanCode,
    date: projection.date,
    time: projection.time,
    durationMinutes: projection.durationMinutes,
    modality: projection.modality,
    status: projection.status,
    psychologistName: projection.psychologistName || '',
    psychologistCrp: projection.psychologistCrp || '',
    publicMessage: projection.publicMessage || '',
    locationOrLink: projection.locationOrLink || '',
    updatedAt: projection.updatedAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COLLECTIONS.PUBLIC_APPOINTMENTS, cleanCode), sanitizedProjection, { merge: true });
  } catch (e) {
    console.warn('Save public projection notice:', e);
  }
}

// ======================== CONTACT MESSAGES ========================

export async function createMessageRecord(message: ContactMessage): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), message);
  } catch (e) {
    console.warn('Save contact message notice:', e);
  }
}

// ======================== PUBLIC DATA CLOUD PERSISTENCE ========================

export async function savePublicDataToCloud(publicData: PublicSiteData): Promise<void> {
  const path = `${COLLECTIONS.PUBLIC_DATA}/current`;
  try {
    await setDoc(doc(db, COLLECTIONS.PUBLIC_DATA, 'current'), publicData, { merge: true });
  } catch (error) {
    console.warn('Sync notice: could not save publicData to cloud:', error);
  }
}

export async function getPublicDataFromCloud(): Promise<PublicSiteData | null> {
  try {
    // 1. Try new segregated publicData collection
    const snap = await getDoc(doc(db, COLLECTIONS.PUBLIC_DATA, 'current'));
    if (snap.exists()) {
      return snap.data() as PublicSiteData;
    }
  } catch (error) {
    console.warn('Sync notice: could not read publicData from cloud:', error);
  }

  // Fallback: if publicData/current is not yet created, read legacy public fields from siteData/current
  try {
    const legacySnap = await getDoc(doc(db, COLLECTIONS.SITE_DATA, 'current'));
    if (legacySnap.exists()) {
      const data = legacySnap.data() as any;
      if (data.profile && data.config) {
        const publicSlice: PublicSiteData = {
          profile: data.profile,
          config: data.config,
          specialties: data.specialties || [],
          attendance: data.attendance,
          steps: data.steps || [],
          faq: data.faq || [],
          testimonials: data.testimonials || [],
          posts: data.posts || [],
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
        return publicSlice;
      }
    }
  } catch {
    // Legacy fallback silent
  }

  return null;
}

export function subscribePublicDataFromCloud(onData: (data: PublicSiteData) => void): () => void {
  try {
    const unsub = onSnapshot(
      doc(db, COLLECTIONS.PUBLIC_DATA, 'current'),
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as PublicSiteData);
        }
      },
      (error) => {
        console.warn('Sync notice: publicData snapshot error:', error);
      }
    );
    return unsub;
  } catch (e) {
    console.warn('Sync notice: failed to attach publicData snapshot listener:', e);
    return () => {};
  }
}

// ======================== ADMIN PRIVATE DATA CLOUD PERSISTENCE ========================

export async function saveAdminDataToCloud(adminData: AdminPrivateData): Promise<void> {
  const path = `${COLLECTIONS.ADMIN_DATA}/current`;
  try {
    await setDoc(doc(db, COLLECTIONS.ADMIN_DATA, 'current'), adminData, { merge: true });
  } catch (error) {
    console.warn('Sync notice: could not save adminData to cloud:', error);
  }
}

export async function getAdminDataFromCloud(): Promise<AdminPrivateData | null> {
  try {
    // 1. Try dedicated private adminData collection
    const snap = await getDoc(doc(db, COLLECTIONS.ADMIN_DATA, 'current'));
    if (snap.exists()) {
      return snap.data() as AdminPrivateData;
    }
  } catch (error) {
    console.warn('Sync notice: could not read adminData from cloud:', error);
  }

  // Fallback: if adminData/current is not yet created, read legacy private fields from siteData/current
  try {
    const legacySnap = await getDoc(doc(db, COLLECTIONS.SITE_DATA, 'current'));
    if (legacySnap.exists()) {
      const data = legacySnap.data() as any;
      if (data.patients || data.appointments || data.privateActivities || data.messages) {
        const privateSlice: AdminPrivateData = {
          patients: data.patients || [],
          appointments: data.appointments || [],
          privateActivities: data.privateActivities || [],
          messages: data.messages || [],
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
        return privateSlice;
      }
    }
  } catch {
    // Legacy fallback silent
  }

  return null;
}

export function subscribeAdminDataFromCloud(onData: (data: AdminPrivateData) => void): () => void {
  try {
    const unsub = onSnapshot(
      doc(db, COLLECTIONS.ADMIN_DATA, 'current'),
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as AdminPrivateData);
        }
      },
      (error) => {
        console.warn('Sync notice: adminData snapshot error:', error);
      }
    );
    return unsub;
  } catch (e) {
    console.warn('Sync notice: failed to attach adminData snapshot listener:', e);
    return () => {};
  }
}

// ======================== LEGACY SITE DATA COMPATIBILITY ========================

export async function saveSiteDataToCloud(siteData: SiteData): Promise<void> {
  try {
    // Dispatch to both publicData and adminData
    const publicSlice: PublicSiteData = {
      profile: siteData.profile,
      config: siteData.config,
      specialties: siteData.specialties,
      attendance: siteData.attendance,
      steps: siteData.steps,
      faq: siteData.faq,
      testimonials: siteData.testimonials,
      posts: siteData.posts,
      lastUpdated: siteData.lastUpdated,
    };
    const privateSlice: AdminPrivateData = {
      patients: siteData.patients,
      appointments: siteData.appointments,
      privateActivities: siteData.privateActivities,
      messages: siteData.messages,
      lastUpdated: siteData.lastUpdated,
    };

    await Promise.all([
      savePublicDataToCloud(publicSlice),
      saveAdminDataToCloud(privateSlice),
    ]);
  } catch (error) {
    console.warn('Sync notice: could not save unified siteData to cloud:', error);
  }
}

export async function getSiteDataFromCloud(): Promise<SiteData | null> {
  const [publicData, adminData] = await Promise.all([
    getPublicDataFromCloud(),
    getAdminDataFromCloud(),
  ]);

  if (!publicData && !adminData) return null;

  return {
    ...(publicData as any),
    patients: adminData?.patients || [],
    appointments: adminData?.appointments || [],
    privateActivities: adminData?.privateActivities || [],
    messages: adminData?.messages || [],
    lastUpdated: adminData?.lastUpdated || publicData?.lastUpdated || new Date().toISOString(),
  } as SiteData;
}

