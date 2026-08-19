import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Building,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Lock,
  Sparkles,
  RefreshCw,
  X,
  FileText,
  CalendarCheck,
  CalendarRange,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Patient,
  Appointment,
  PrivateActivity,
  AppointmentStatus,
  AppointmentModality,
  ActivityType,
  ActivityStatus,
} from '../types';

export const AdminAgendaAndPatients: React.FC = () => {
  const {
    data,
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
    getAppointmentWhatsAppUrl,
    showToast,
  } = useSite();

  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  // Active top subtab: 'agenda' | 'patients' | 'appointments'
  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'patients' | 'appointments'>('agenda');

  // Calendar state
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Search & Filter states
  const [patientSearch, setPatientSearch] = useState<string>('');
  const [patientStatusFilter, setPatientStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'appointments' | 'activities'>('all');

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [preselectedPatientId, setPreselectedPatientId] = useState<string | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<PrivateActivity | null>(null);

  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState<boolean>(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(null);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduleNotes, setRescheduleNotes] = useState<string>('');

  const [isWhatsAppPreviewOpen, setIsWhatsAppPreviewOpen] = useState<boolean>(false);
  const [previewAppointment, setPreviewAppointment] = useState<Appointment | null>(null);

  // Patient form fields
  const [patientForm, setPatientForm] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Appointment form fields
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    durationMinutes: 50,
    modality: 'online' as AppointmentModality,
    status: 'agendada' as AppointmentStatus,
    adminNotes: '',
    publicMessage: '',
  });

  // Private activity form fields
  const [activityForm, setActivityForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'reuniao' as ActivityType,
    notes: '',
    status: 'agendado' as ActivityStatus,
  });

  // Conflict state warning
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // -------------------------------------------------------------
  // CALENDAR HELPERS
  // -------------------------------------------------------------
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (calendarView === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
      setSelectedDateStr(d.toISOString().split('T')[0]);
    }
  };

  const handleNextPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (calendarView === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
      setSelectedDateStr(d.toISOString().split('T')[0]);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Month days calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month filler
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevLastDate - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Next month filler to complete 35 or 42 slots
    const remaining = 42 - days.length;
    for (let i = 1; i <= (remaining > 7 ? remaining - 7 : remaining); i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Merge appointments and private activities for a given date
  const getEventsForDate = (dateStr: string) => {
    const apts = (data.appointments || [])
      .filter((a) => a.date === dateStr)
      .map((a) => ({
        id: a.id,
        title: `Consulta: ${a.patientName}`,
        time: a.time,
        duration: a.durationMinutes || 50,
        type: 'appointment' as const,
        modality: a.modality,
        status: a.status,
        raw: a,
      }));

    const acts = (data.privateActivities || [])
      .filter((act) => act.date === dateStr)
      .map((act) => ({
        id: act.id,
        title: `${act.title}`,
        time: act.startTime,
        duration: 60,
        type: 'activity' as const,
        activityType: act.type,
        status: act.status,
        raw: act,
      }));

    let combined = [];
    if (calendarFilter === 'all') {
      combined = [...apts, ...acts];
    } else if (calendarFilter === 'appointments') {
      combined = apts;
    } else {
      combined = acts;
    }

    return combined.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Conflict checker
  const checkTimeConflict = (date: string, time: string, durationMin: number, excludeId?: string) => {
    // Check appointments
    const conflictingApt = (data.appointments || []).find((a) => {
      if (a.id === excludeId) return false;
      if (a.date !== date) return false;
      if (a.status === 'cancelada') return false;
      // Simple slot comparison
      return a.time === time;
    });

    if (conflictingApt) {
      return `Conflito detectado: Já existe a consulta de "${conflictingApt.patientName}" às ${conflictingApt.time}.`;
    }

    // Check private activities
    const conflictingAct = (data.privateActivities || []).find((act) => {
      if (act.id === excludeId) return false;
      if (act.date !== date) return false;
      if (act.status === 'cancelado') return false;
      return act.startTime === time;
    });

    if (conflictingAct) {
      return `Conflito detectado: Já existe o compromisso "${conflictingAct.title}" às ${conflictingAct.startTime}.`;
    }

    return null;
  };

  // -------------------------------------------------------------
  // PATIENT MODAL HANDLERS
  // -------------------------------------------------------------
  const openNewPatientModal = () => {
    setEditingPatient(null);
    setPatientForm({
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      notes: '',
      status: 'active',
    });
    setIsPatientModalOpen(true);
  };

  const openEditPatientModal = (patient: Patient) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      phone: patient.phone,
      email: patient.email || '',
      birthDate: patient.birthDate || '',
      notes: patient.notes || '',
      status: patient.status,
    });
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name.trim() || !patientForm.phone.trim()) {
      showToast('Nome e Telefone/WhatsApp são obrigatórios.', 'error');
      return;
    }

    if (editingPatient) {
      await updatePatient(editingPatient.id, patientForm);
    } else {
      await addPatient(patientForm);
    }
    setIsPatientModalOpen(false);
  };

  // -------------------------------------------------------------
  // APPOINTMENT MODAL HANDLERS
  // -------------------------------------------------------------
  const openNewAppointmentModal = (patientId?: string, defaultDate?: string) => {
    setEditingAppointment(null);
    setConflictWarning(null);
    const targetPatientId = patientId || (data.patients[0]?.id || '');
    setPreselectedPatientId(targetPatientId);
    setAppointmentForm({
      patientId: targetPatientId,
      date: defaultDate || selectedDateStr || new Date().toISOString().split('T')[0],
      time: '14:00',
      durationMinutes: 50,
      modality: 'online',
      status: 'agendada',
      adminNotes: '',
      publicMessage: 'Atendimento via link seguro ou presencial.',
    });
    setIsAppointmentModalOpen(true);
  };

  const openEditAppointmentModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setConflictWarning(null);
    setAppointmentForm({
      patientId: apt.patientId,
      date: apt.date,
      time: apt.time,
      durationMinutes: apt.durationMinutes || 50,
      modality: apt.modality,
      status: apt.status,
      adminNotes: apt.adminNotes || '',
      publicMessage: apt.publicMessage || '',
    });
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = data.patients.find((p) => p.id === appointmentForm.patientId);
    if (!patient) {
      showToast('Selecione um paciente cadastrado.', 'error');
      return;
    }

    // Check conflict
    const conflict = checkTimeConflict(
      appointmentForm.date,
      appointmentForm.time,
      appointmentForm.durationMinutes,
      editingAppointment?.id
    );

    if (conflict && !conflictWarning) {
      setConflictWarning(conflict);
      return;
    }

    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, {
        ...appointmentForm,
        patientName: patient.name,
        patientPhone: patient.phone,
      });
      setIsAppointmentModalOpen(false);
    } else {
      const created = await addAppointment({
        ...appointmentForm,
        patientName: patient.name,
        patientPhone: patient.phone,
      });
      setIsAppointmentModalOpen(false);
      // Open WhatsApp preview prompt
      setPreviewAppointment(created);
      setIsWhatsAppPreviewOpen(true);
    }
  };

  // -------------------------------------------------------------
  // PRIVATE ACTIVITY MODAL HANDLERS
  // -------------------------------------------------------------
  const openNewActivityModal = (defaultDate?: string) => {
    setEditingActivity(null);
    setConflictWarning(null);
    setActivityForm({
      title: '',
      date: defaultDate || selectedDateStr || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'reuniao',
      notes: '',
      status: 'agendado',
    });
    setIsActivityModalOpen(true);
  };

  const openEditActivityModal = (act: PrivateActivity) => {
    setEditingActivity(act);
    setConflictWarning(null);
    setActivityForm({
      title: act.title,
      date: act.date,
      startTime: act.startTime,
      endTime: act.endTime,
      type: act.type,
      notes: act.notes || '',
      status: act.status,
    });
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title.trim()) {
      showToast('O título da atividade é obrigatório.', 'error');
      return;
    }

    // Conflict check
    const conflict = checkTimeConflict(
      activityForm.date,
      activityForm.startTime,
      60,
      editingActivity?.id
    );

    if (conflict && !conflictWarning) {
      setConflictWarning(conflict);
      return;
    }

    if (editingActivity) {
      await updatePrivateActivity(editingActivity.id, activityForm);
    } else {
      await addPrivateActivity(activityForm);
    }
    setIsActivityModalOpen(false);
  };

  // -------------------------------------------------------------
  // RESCHEDULE HANDLER
  // -------------------------------------------------------------
  const openRescheduleModal = (apt: Appointment) => {
    setRescheduleTarget(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setRescheduleNotes('');
    setIsRescheduleModalOpen(true);
  };

  const handleExecuteReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) return;

    await rescheduleAppointment(
      rescheduleTarget.id,
      rescheduleDate,
      rescheduleTime,
      rescheduleNotes
    );

    const updatedApt: Appointment = {
      ...rescheduleTarget,
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'remarcada',
    };

    setIsRescheduleModalOpen(false);
    // Show WhatsApp prompt to notify patient
    setPreviewAppointment(updatedApt);
    setIsWhatsAppPreviewOpen(true);
  };

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return (data.patients || []).filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.phone.includes(patientSearch) ||
        (p.email && p.email.toLowerCase().includes(patientSearch.toLowerCase()));
      const matchStatus =
        patientStatusFilter === 'all' ? true : p.status === patientStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [data.patients, patientSearch, patientStatusFilter]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return (data.appointments || []).filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        a.accessCode.toLowerCase().includes(appointmentSearch.toLowerCase());
      const matchStatus =
        appointmentStatusFilter === 'all' ? true : a.status === appointmentStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [data.appointments, appointmentSearch, appointmentStatusFilter]);

  // Selected date events for side panel in month view or day view
  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDateStr);
  }, [selectedDateStr, data.appointments, data.privateActivities, calendarFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header with Navigation Sub-tabs and Actions */}
      <div className="bg-white rounded-3xl border border-[#E5E1DA] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8370] bg-[#7C8370]/10 px-2.5 py-0.5 rounded-full">
                Módulo Exclusivo da Psicóloga
              </span>
              <span className="flex items-center gap-1 text-xs text-[#5D5D5D]">
                <Lock className="w-3 h-3 text-[#A89F91]" />
                Privacidade 100% Protegida
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2D3436] font-medium">
              Agenda & Gestão de Pacientes
            </h1>
            <p className="text-xs sm:text-sm text-[#5D5D5D] mt-0.5">
              Gerencie consultas, compromissos particulares da psicóloga, fichas de pacientes e confirmações via WhatsApp.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => openNewPatientModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#F7F5F2] hover:bg-[#EAE6DF] text-[#2D3436] border border-[#E5E1DA] transition-all active:scale-95 shadow-2xs"
            >
              <Users className="w-4 h-4 text-[#7C8370]" />
              <span>+ Novo Paciente</span>
            </button>

            <button
              onClick={() => openNewActivityModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#F7F5F2] hover:bg-[#EAE6DF] text-[#2D3436] border border-[#E5E1DA] transition-all active:scale-95 shadow-2xs"
            >
              <CalendarCheck className="w-4 h-4 text-purple-600" />
              <span>+ Nova Atividade Particular</span>
            </button>

            <button
              onClick={() => openNewAppointmentModal()}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-xs transition-all active:scale-95 ${theme.classes.buttonPrimary}`}
            >
              <Plus className="w-4 h-4" />
              <span>+ Agendar Consulta</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#E5E1DA] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('agenda')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'agenda'
                ? 'bg-[#7C8370] text-white shadow-xs'
                : 'text-[#5D5D5D] hover:text-[#2D3436] hover:bg-[#F7F5F2]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Agenda & Calendário</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
              {(data.appointments?.length || 0) + (data.privateActivities?.length || 0)}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'patients'
                ? 'bg-[#7C8370] text-white shadow-xs'
                : 'text-[#5D5D5D] hover:text-[#2D3436] hover:bg-[#F7F5F2]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Meus Pacientes</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/10">
              {data.patients?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'appointments'
                ? 'bg-[#7C8370] text-white shadow-xs'
                : 'text-[#5D5D5D] hover:text-[#2D3436] hover:bg-[#F7F5F2]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Lista de Consultas & Códigos</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/10">
              {data.appointments?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: AGENDA & CALENDÁRIO */}
      {/* ========================================================= */}
      {activeSubTab === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Calendar Section (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E1DA] p-5 sm:p-6 shadow-2xs space-y-4">
            {/* Calendar Controls Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E1DA]">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl sm:text-2xl text-[#2D3436] font-medium capitalize">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center bg-[#FAF9F6] border border-[#E5E1DA] rounded-lg p-0.5">
                  <button
                    onClick={handlePrevPeriod}
                    className="p-1.5 text-[#5D5D5D] hover:text-[#2D3436] hover:bg-white rounded transition-colors"
                    title="Mês Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-2.5 py-1 text-xs font-medium text-[#2D3436] hover:bg-white rounded transition-colors"
                  >
                    Hoje
                  </button>
                  <button
                    onClick={handleNextPeriod}
                    className="p-1.5 text-[#5D5D5D] hover:text-[#2D3436] hover:bg-white rounded transition-colors"
                    title="Próximo Mês"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter by event type */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#A89F91]">Exibir:</span>
                <button
                  onClick={() => setCalendarFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    calendarFilter === 'all'
                      ? 'bg-[#2D3436] text-white'
                      : 'bg-[#FAF9F6] text-[#5D5D5D] hover:bg-[#EAE6DF]'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setCalendarFilter('appointments')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    calendarFilter === 'appointments'
                      ? 'bg-[#7C8370] text-white'
                      : 'bg-[#FAF9F6] text-[#5D5D5D] hover:bg-[#EAE6DF]'
                  }`}
                >
                  Consultas
                </button>
                <button
                  onClick={() => setCalendarFilter('activities')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    calendarFilter === 'activities'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#FAF9F6] text-[#5D5D5D] hover:bg-[#EAE6DF]'
                  }`}
                >
                  Particulares
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#5D5D5D] uppercase tracking-wider py-1">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDate(day.dateStr);
                const isSelected = selectedDateStr === day.dateStr;

                return (
                  <button
                    key={`${day.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative group ${
                      isSelected
                        ? 'border-[#7C8370] bg-[#7C8370]/5 ring-2 ring-[#7C8370]/30 shadow-xs'
                        : day.isCurrentMonth
                        ? 'border-[#E5E1DA]/80 bg-white hover:border-[#7C8370]/50 hover:bg-[#FAF9F6]'
                        : 'border-transparent bg-neutral-50/50 text-[#A89F91] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                          day.isToday
                            ? 'bg-[#7C8370] text-white shadow-2xs'
                            : isSelected
                            ? 'text-[#7C8370]'
                            : day.isCurrentMonth
                            ? 'text-[#2D3436]'
                            : 'text-[#A89F91]'
                        }`}
                      >
                        {day.dayNumber}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-[#5D5D5D] bg-neutral-100 px-1 rounded-md hidden sm:inline">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Day Mini-Event Badges */}
                    <div className="w-full space-y-0.5 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded font-medium ${
                            ev.type === 'appointment'
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                              : 'bg-purple-50 text-purple-900 border border-purple-200/60'
                          }`}
                        >
                          <span className="font-mono">{ev.time}</span> {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-[#5D5D5D] font-medium pl-1">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5D5D5D] pt-3 border-t border-[#E5E1DA]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Consulta com Paciente (Gera código de confirmação)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span>Atividade Particular da Psicóloga (100% privada)</span>
              </div>
            </div>
          </div>

          {/* Selected Date Timeline & Quick Details (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E1DA] p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E1DA]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
                    Dia Selecionado
                  </span>
                  <h3 className="font-serif text-lg text-[#2D3436] font-medium capitalize">
                    {(() => {
                      try {
                        const [y, m, d] = selectedDateStr.split('-').map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        });
                      } catch {
                        return selectedDateStr;
                      }
                    })()}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openNewAppointmentModal(undefined, selectedDateStr)}
                    className="p-2 rounded-xl bg-[#7C8370]/10 text-[#7C8370] hover:bg-[#7C8370] hover:text-white transition-colors"
                    title="Agendar Consulta neste dia"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timeline list of events for selected day */}
              <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E5E1DA] text-[#A89F91] space-y-2">
                    <CalendarCheck className="w-8 h-8 mx-auto text-[#A89F91]" />
                    <p className="text-xs font-medium text-[#5D5D5D]">Nenhum compromisso marcado para este dia.</p>
                    <div className="flex flex-col gap-1.5 pt-2">
                      <button
                        onClick={() => openNewAppointmentModal(undefined, selectedDateStr)}
                        className="text-xs font-semibold text-[#7C8370] hover:underline"
                      >
                        + Agendar Consulta
                      </button>
                      <button
                        onClick={() => openNewActivityModal(selectedDateStr)}
                        className="text-xs font-semibold text-purple-600 hover:underline"
                      >
                        + Nova Atividade Particular
                      </button>
                    </div>
                  </div>
                ) : (
                  selectedDateEvents.map((ev) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border transition-all ${
                        ev.type === 'appointment'
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : 'bg-purple-50/40 border-purple-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#2D3436] bg-white px-2 py-0.5 rounded border border-[#E5E1DA]">
                              {ev.time}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                ev.type === 'appointment'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {ev.type === 'appointment' ? 'Consulta' : ev.activityType}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-[#2D3436] mt-2">
                            {ev.title}
                          </h4>
                        </div>

                        {/* Actions for event */}
                        <div className="flex items-center gap-1">
                          {ev.type === 'appointment' && (
                            <>
                              <button
                                onClick={() => {
                                  setPreviewAppointment(ev.raw as Appointment);
                                  setIsWhatsAppPreviewOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Enviar confirmação WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openRescheduleModal(ev.raw as Appointment)}
                                className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors"
                                title="Remarcar Consulta"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditAppointmentModal(ev.raw as Appointment)}
                                className="p-1.5 rounded-lg text-[#5D5D5D] hover:bg-white transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Deseja realmente excluir esta consulta?')) {
                                    deleteAppointment(ev.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {ev.type === 'activity' && (
                            <>
                              <button
                                onClick={() => openEditActivityModal(ev.raw as PrivateActivity)}
                                className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Deseja realmente excluir esta atividade?')) {
                                    deletePrivateActivity(ev.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Extra info */}
                      {ev.type === 'appointment' && (
                        <div className="mt-2 text-xs text-[#5D5D5D] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              {ev.modality === 'online' ? <Video className="w-3 h-3 text-[#7C8370]" /> : <Building className="w-3 h-3 text-[#7C8370]" />}
                              <span className="capitalize">{ev.modality}</span>
                            </span>
                            <span className="font-mono text-[10px] bg-white border border-[#E5E1DA] px-1.5 py-0.5 rounded text-[#2D3436]">
                              Código: {(ev.raw as Appointment).accessCode}
                            </span>
                          </div>
                          {(ev.raw as Appointment).adminNotes && (
                            <p className="text-[11px] text-[#5D5D5D] italic bg-white/70 p-1.5 rounded border border-[#E5E1DA]/50">
                              "{(ev.raw as Appointment).adminNotes}"
                            </p>
                          )}
                        </div>
                      )}

                      {ev.type === 'activity' && (ev.raw as PrivateActivity).notes && (
                        <div className="mt-2 text-xs text-[#5D5D5D] bg-white/70 p-1.5 rounded border border-[#E5E1DA]/50 italic">
                          "{(ev.raw as PrivateActivity).notes}"
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom quick buttons */}
            <div className="pt-3 border-t border-[#E5E1DA] flex gap-2">
              <button
                onClick={() => openNewAppointmentModal(undefined, selectedDateStr)}
                className="w-1/2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-center"
              >
                + Consulta
              </button>
              <button
                onClick={() => openNewActivityModal(selectedDateStr)}
                className="w-1/2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors text-center"
              >
                + Particular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: MEUS PACIENTES (GESTÃO DE PACIENTES) */}
      {/* ========================================================= */}
      {activeSubTab === 'patients' && (
        <div className="bg-white rounded-3xl border border-[#E5E1DA] p-5 sm:p-6 shadow-2xs space-y-6">
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar paciente por nome, WhatsApp ou e-mail..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl p-1 text-xs">
                <button
                  onClick={() => setPatientStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    patientStatusFilter === 'all'
                      ? 'bg-[#7C8370] text-white'
                      : 'text-[#5D5D5D] hover:text-[#2D3436]'
                  }`}
                >
                  Todos ({data.patients?.length || 0})
                </button>
                <button
                  onClick={() => setPatientStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    patientStatusFilter === 'active'
                      ? 'bg-[#7C8370] text-white'
                      : 'text-[#5D5D5D] hover:text-[#2D3436]'
                  }`}
                >
                  Ativos ({data.patients?.filter((p) => p.status === 'active').length || 0})
                </button>
                <button
                  onClick={() => setPatientStatusFilter('inactive')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    patientStatusFilter === 'inactive'
                      ? 'bg-[#7C8370] text-white'
                      : 'text-[#5D5D5D] hover:text-[#2D3436]'
                  }`}
                >
                  Inativos
                </button>
              </div>

              <button
                onClick={openNewPatientModal}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-xs ${theme.classes.buttonPrimary}`}
              >
                <Plus className="w-4 h-4" />
                <span>Novo Paciente</span>
              </button>
            </div>
          </div>

          {/* Patients List Grid / Cards (Mobile-optimized) */}
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E5E1DA] text-[#5D5D5D] space-y-3">
              <Users className="w-10 h-10 mx-auto text-[#A89F91]" />
              <p className="font-semibold text-sm">Nenhum paciente encontrado com esses critérios.</p>
              <button
                onClick={openNewPatientModal}
                className="text-xs font-semibold text-[#7C8370] hover:underline"
              >
                + Cadastrar Novo Paciente
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => {
                // Find next upcoming appointment for this patient
                const patientAppointments = (data.appointments || [])
                  .filter((a) => a.patientId === patient.id && a.status !== 'cancelada')
                  .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
                
                const nextApt = patientAppointments.find(
                  (a) => a.date >= new Date().toISOString().split('T')[0]
                );

                return (
                  <motion.div
                    key={patient.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-2xl p-5 space-y-4 hover:border-[#7C8370]/50 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-base text-[#2D3436]">
                            {patient.name}
                          </h3>
                          <span
                            className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                              patient.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {patient.status === 'active' ? 'Paciente Ativo' : 'Inativo'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedPatientForDetail(patient);
                              setIsPatientDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#5D5D5D] hover:text-[#7C8370] hover:bg-white transition-colors"
                            title="Ver Ficha / Histórico"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditPatientModal(patient)}
                            className="p-1.5 rounded-lg text-[#5D5D5D] hover:text-[#2D3436] hover:bg-white transition-colors"
                            title="Editar Paciente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact details */}
                      <div className="mt-3 space-y-1.5 text-xs text-[#5D5D5D]">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#7C8370]" />
                          <span className="font-mono">{patient.phone}</span>
                          <a
                            href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 hover:underline font-semibold"
                          >
                            WhatsApp
                          </a>
                        </div>

                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-[#7C8370]" />
                            <span className="truncate">{patient.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Next Appointment Status */}
                      <div className="mt-3 pt-3 border-t border-[#E5E1DA] text-xs">
                        <span className="text-[11px] text-[#A89F91] block">Próxima Consulta:</span>
                        {nextApt ? (
                          <div className="flex items-center justify-between text-[#2D3436] font-medium mt-0.5">
                            <span>
                              📅 {nextApt.date} às {nextApt.time}
                            </span>
                            <span className="font-mono text-[10px] bg-white border border-[#E5E1DA] px-1.5 py-0.5 rounded">
                              {nextApt.accessCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#A89F91] italic">Nenhuma consulta futura agendada</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="pt-3 border-t border-[#E5E1DA] flex items-center gap-2">
                      <button
                        onClick={() => openNewAppointmentModal(patient.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-[#7C8370] text-white hover:bg-[#686F5E] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agendar</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatientForDetail(patient);
                          setIsPatientDetailOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-white border border-[#E5E1DA] text-[#2D3436] hover:bg-[#F7F5F2] transition-colors"
                      >
                        Ficha
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: LISTA DE TODAS AS CONSULTAS & CÓDIGOS */}
      {/* ========================================================= */}
      {activeSubTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-[#E5E1DA] p-5 sm:p-6 shadow-2xs space-y-6">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por paciente ou código (ex: HM-482915)..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
              >
                <option value="all">Todos os Status</option>
                <option value="agendada">Agendadas</option>
                <option value="confirmada">Confirmadas</option>
                <option value="remarcada">Remarcadas</option>
                <option value="realizada">Realizadas</option>
                <option value="cancelada">Canceladas</option>
              </select>

              <button
                onClick={() => openNewAppointmentModal()}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-xs ${theme.classes.buttonPrimary}`}
              >
                <Plus className="w-4 h-4" />
                <span>Nova Consulta</span>
              </button>
            </div>
          </div>

          {/* Table / List of Appointments */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F6] border-y border-[#E5E1DA] text-[#5D5D5D] uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Paciente</th>
                  <th className="py-3 px-4">Data & Horário</th>
                  <th className="py-3 px-4">Modalidade</th>
                  <th className="py-3 px-4">Código de Acesso</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DA]/60">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#A89F91] italic">
                      Nenhuma consulta encontrada com esses filtros.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#2D3436]">
                        {apt.patientName}
                        {apt.patientPhone && (
                          <span className="block font-mono font-normal text-xs text-[#5D5D5D]">
                            {apt.patientPhone}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#2D3436]">
                        <span className="font-medium">{apt.date}</span>
                        <span className="block text-xs text-[#5D5D5D]">
                          {apt.time} ({apt.durationMinutes || 50} min)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded capitalize ${
                            apt.modality === 'online'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {apt.modality === 'online' ? <Video className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                          {apt.modality}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 font-mono font-bold text-xs bg-neutral-100 border border-[#E5E1DA] px-2 py-1 rounded">
                          <span>{apt.accessCode}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(apt.accessCode);
                              showToast(`Código ${apt.accessCode} copiado!`, 'success');
                            }}
                            className="text-[#5D5D5D] hover:text-[#2D3436]"
                            title="Copiar Código"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            apt.status === 'confirmada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'agendada'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'remarcada'
                              ? 'bg-sky-100 text-sky-800'
                              : apt.status === 'realizada'
                              ? 'bg-neutral-200 text-neutral-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp confirmation */}
                          <button
                            onClick={() => {
                              setPreviewAppointment(apt);
                              setIsWhatsAppPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Enviar Confirmação no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Reschedule */}
                          <button
                            onClick={() => openRescheduleModal(apt)}
                            className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Remarcar"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditAppointmentModal(apt)}
                            className="p-1.5 rounded-lg text-[#5D5D5D] hover:text-[#2D3436] hover:bg-neutral-100 transition-colors"
                            title="Editar Consulta"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm('Deseja excluir esta consulta? O código de acesso deixará de funcionar.')) {
                                deleteAppointment(apt.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Excluir Consulta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: NOVO / EDITAR PACIENTE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E1DA]">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#2D3436]">
                    {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                  </h3>
                  <p className="text-xs text-[#5D5D5D]">Cadastro administrativo confidencial.</p>
                </div>
                <button
                  onClick={() => setIsPatientModalOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePatient} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    placeholder="Ex: Camila Rodrigues Alves"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      placeholder="Ex: (11) 98123-4567"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={patientForm.birthDate}
                      onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    placeholder="Ex: paciente@email.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Status do Paciente
                  </label>
                  <select
                    value={patientForm.status}
                    onChange={(e) => setPatientForm({ ...patientForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  >
                    <option value="active">Ativo (Em acompanhamento)</option>
                    <option value="inactive">Inativo (Alta / Pausa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Observações Administrativas (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={patientForm.notes}
                    onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                    placeholder="Ex: Preferência por sessões online às terças à tarde..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPatientModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-[#5D5D5D] hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs ${theme.classes.buttonPrimary}`}
                  >
                    {editingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: AGENDAR / EDITAR CONSULTA COM CÓDIGO */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E1DA]">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#2D3436]">
                    {editingAppointment ? 'Editar Consulta' : 'Nova Consulta'}
                  </h3>
                  <p className="text-xs text-[#5D5D5D]">Gera código de confirmação seguro para o paciente.</p>
                </div>
                <button
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conflict warning banner */}
              {conflictWarning && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{conflictWarning}</p>
                    <p className="text-amber-700 mt-0.5">Deseja agendar mesmo assim?</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveAppointment} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Selecione o Paciente *
                  </label>
                  <select
                    required
                    value={appointmentForm.patientId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  >
                    {data.patients?.length === 0 ? (
                      <option value="">Nenhum paciente cadastrado</option>
                    ) : (
                      data.patients?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.phone}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Data da Consulta *
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      required
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Modalidade
                    </label>
                    <select
                      value={appointmentForm.modality}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, modality: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    >
                      <option value="online">Online (Videochamada)</option>
                      <option value="presencial">Presencial no Consultório</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Duração (Minutos)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={120}
                      step={5}
                      value={appointmentForm.durationMinutes}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Status da Consulta
                  </label>
                  <select
                    value={appointmentForm.status}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  >
                    <option value="agendada">Agendada (Aguardando)</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="remarcada">Remarcada</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Mensagem Pública / Instruções ao Paciente
                  </label>
                  <input
                    type="text"
                    value={appointmentForm.publicMessage}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, publicMessage: e.target.value })}
                    placeholder="Ex: O link da sala virtual será enviado 10 min antes no WhatsApp..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                  <span className="text-[11px] text-[#A89F91] mt-0.5 block">
                    Visível quando o paciente consultar o código no site.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Notas Administrativas Privadas (Psicóloga)
                  </label>
                  <textarea
                    rows={2}
                    value={appointmentForm.adminNotes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, adminNotes: e.target.value })}
                    placeholder="Anotações internas sobre agendamento, pagamento, etc."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAppointmentModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-[#5D5D5D] hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs ${theme.classes.buttonPrimary}`}
                  >
                    {editingAppointment ? 'Salvar Alterações' : 'Confirmar & Gerar Código'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: NOVA ATIVIDADE PARTICULAR (PSICÓLOGA) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isActivityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E1DA]">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#2D3436]">
                    {editingActivity ? 'Editar Atividade Particular' : 'Nova Atividade Particular'}
                  </h3>
                  <p className="text-xs text-purple-700 font-medium">100% privada da psicóloga (não visível a pacientes).</p>
                </div>
                <button
                  onClick={() => setIsActivityModalOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conflict warning banner */}
              {conflictWarning && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{conflictWarning}</p>
                    <p className="text-amber-700 mt-0.5">Deseja cadastrar mesmo assim?</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveActivity} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Nome / Título da Atividade *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    placeholder="Ex: Supervisão Clínica, Estudo Teórico, Reunião de Equipe..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Tipo de Atividade
                    </label>
                    <select
                      value={activityForm.type}
                      onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                    >
                      <option value="reuniao">Reunião / Supervisão</option>
                      <option value="estudo">Estudo / Leitura</option>
                      <option value="pessoal">Compromisso Pessoal</option>
                      <option value="evento">Evento / Congresso</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={activityForm.date}
                      onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Horário Inicial *
                    </label>
                    <input
                      type="time"
                      required
                      value={activityForm.startTime}
                      onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                      Horário Final *
                    </label>
                    <input
                      type="time"
                      required
                      value={activityForm.endTime}
                      onChange={(e) => setActivityForm({ ...activityForm, endTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Observações Pessoais
                  </label>
                  <textarea
                    rows={3}
                    value={activityForm.notes}
                    onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                    placeholder="Anotações para você se preparar..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsActivityModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-[#5D5D5D] hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  >
                    {editingActivity ? 'Salvar Alterações' : 'Adicionar à Minha Agenda'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: FICHA DO PACIENTE (HISTÓRICO ADMINISTRATIVO) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPatientDetailOpen && selectedPatientForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E5E1DA]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
                    Ficha Administrativa do Paciente
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-[#2D3436] mt-0.5">
                    {selectedPatientForDetail.name}
                  </h3>
                  <span
                    className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                      selectedPatientForDetail.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {selectedPatientForDetail.status === 'active' ? 'Paciente Ativo' : 'Inativo'}
                  </span>
                </div>
                <button
                  onClick={() => setIsPatientDetailOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E1DA]">
                <div>
                  <span className="text-[#A89F91] block">WhatsApp / Telefone:</span>
                  <span className="font-semibold text-sm text-[#2D3436] font-mono">
                    {selectedPatientForDetail.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[#A89F91] block">E-mail:</span>
                  <span className="font-medium text-[#2D3436]">
                    {selectedPatientForDetail.email || 'Não informado'}
                  </span>
                </div>
                <div>
                  <span className="text-[#A89F91] block">Nascimento:</span>
                  <span className="font-medium text-[#2D3436]">
                    {selectedPatientForDetail.birthDate || 'Não informado'}
                  </span>
                </div>
              </div>

              {/* Administrative notes */}
              {selectedPatientForDetail.notes && (
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E1DA] space-y-1">
                  <span className="text-xs font-semibold text-[#5D5D5D] block">
                    Observações Administrativas:
                  </span>
                  <p className="text-xs text-[#2D3436] leading-relaxed">
                    {selectedPatientForDetail.notes}
                  </p>
                </div>
              )}

              {/* Appointments History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-[#2D3436] flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#7C8370]" />
                    <span>Histórico de Consultas ({
                      (data.appointments || []).filter((a) => a.patientId === selectedPatientForDetail.id).length
                    })</span>
                  </h4>

                  <button
                    onClick={() => {
                      setIsPatientDetailOpen(false);
                      openNewAppointmentModal(selectedPatientForDetail.id);
                    }}
                    className="text-xs font-semibold text-[#7C8370] hover:underline"
                  >
                    + Agendar Nova Consulta
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(() => {
                    const patientApts = (data.appointments || [])
                      .filter((a) => a.patientId === selectedPatientForDetail.id)
                      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

                    if (patientApts.length === 0) {
                      return (
                        <p className="text-xs text-[#A89F91] italic text-center py-4">
                          Nenhuma consulta registrada para este paciente.
                        </p>
                      );
                    }

                    return patientApts.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E1DA] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#2D3436]">
                              {apt.date} às {apt.time}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                                apt.status === 'confirmada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'agendada'
                                  ? 'bg-amber-100 text-amber-800'
                                  : apt.status === 'remarcada'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#5D5D5D] capitalize">
                            Modalidade: {apt.modality} • Código: {apt.accessCode}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setPreviewAppointment(apt);
                            setIsWhatsAppPreviewOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Enviar confirmação WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm(`Deseja excluir o paciente ${selectedPatientForDetail.name}?`)) {
                      deletePatient(selectedPatientForDetail.id);
                      setIsPatientDetailOpen(false);
                    }
                  }}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Cadastro</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedPatientForDetail.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25D366] text-white hover:bg-[#20BE5C]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Direto</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsPatientDetailOpen(false);
                      openEditPatientModal(selectedPatientForDetail);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E5E1DA] hover:bg-neutral-100 text-[#2D3436]"
                  >
                    Editar Dados
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 5: REMARCAR CONSULTA */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isRescheduleModalOpen && rescheduleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-md w-full p-6 sm:p-8 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E1DA]">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#2D3436]">
                    Remarcar Consulta
                  </h3>
                  <p className="text-xs text-[#5D5D5D]">
                    Paciente: <strong>{rescheduleTarget.patientName}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExecuteReschedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Nova Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Novo Horário *
                  </label>
                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Motivo da Remarcação (Opcional)
                  </label>
                  <input
                    type="text"
                    value={rescheduleNotes}
                    onChange={(e) => setRescheduleNotes(e.target.value)}
                    placeholder="Ex: A pedido do paciente / ajuste de grade"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E1DA] rounded-xl text-sm text-[#2D3436] focus:outline-none focus:border-[#7C8370]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E5E1DA] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRescheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#5D5D5D] hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                  >
                    Confirmar Remarcação
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 6: PREVIEW & ENVIAR CONFIRMAÇÃO VIA WHATSAPP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isWhatsAppPreviewOpen && previewAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E1DA] max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E1DA]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#2D3436]">
                      Confirmação por WhatsApp
                    </h3>
                    <p className="text-xs text-[#5D5D5D]">Mensagem pronta formatada para envio.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWhatsAppPreviewOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-[#5D5D5D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message text area preview */}
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E1DA] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5D5D5D]">
                  <span className="font-semibold">Pré-visualização da mensagem:</span>
                  <span className="font-mono text-[10px] bg-white border border-[#E5E1DA] px-2 py-0.5 rounded">
                    Código: {previewAppointment.accessCode}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5E1DA] text-xs text-[#2D3436] leading-relaxed whitespace-pre-line font-sans select-all">
                  {`Olá, *${previewAppointment.patientName.split(' ')[0]}*! Tudo bem?

Passando para confirmar os dados da sua consulta com a *${data.profile.name}* (CRP ${data.profile.crp}):

📅 *Data:* ${previewAppointment.date}
⏰ *Horário:* ${previewAppointment.time} (${previewAppointment.durationMinutes || 50} min)
📍 *Modalidade:* ${previewAppointment.modality === 'online' ? 'Online (videochamada)' : 'Presencial'}

🔑 *Código de Acesso:* \`${previewAppointment.accessCode}\`

Você pode consultar as instruções a qualquer momento no site:
👉 ${window.location.origin}/#consulta/${previewAppointment.accessCode}`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const siteUrl = window.location.origin;
                    const text = `Olá, *${previewAppointment.patientName.split(' ')[0]}*! Tudo bem?\n\nPassando para confirmar os dados da sua consulta com a *${data.profile.name}* (CRP ${data.profile.crp}):\n\n📅 *Data:* ${previewAppointment.date}\n⏰ *Horário:* ${previewAppointment.time}\n📍 *Modalidade:* ${previewAppointment.modality}\n🔑 *Código da sua consulta:* \`${previewAppointment.accessCode}\`\n\n👉 ${siteUrl}/#consulta/${previewAppointment.accessCode}`;
                    navigator.clipboard.writeText(text);
                    showToast('Texto copiado para a área de transferência!', 'success');
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs font-semibold bg-white border border-[#E5E1DA] hover:bg-neutral-100 text-[#2D3436] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Mensagem</span>
                </button>

                <a
                  href={getAppointmentWhatsAppUrl(previewAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsWhatsAppPreviewOpen(false)}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20BE5C] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir no WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
