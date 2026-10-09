import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Estado de Sesión Efímera
  planGenerado: '',
  estadoCambios: false,
  sesionChatIA: [],
  apiKey: localStorage.getItem('inspiratec_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '',
  planStatus: 'borrador', // borrador, guardado

  setPlanGenerado: (plan) => set({ planGenerado: plan, estadoCambios: true, planStatus: 'borrador' }),
  setEstadoCambios: (estado) => set({ estadoCambios: estado }),
  setPlanStatus: (status) => set({ planStatus: status }),
  addMensajeChatIA: (mensaje) => set((state) => ({ sesionChatIA: [...state.sesionChatIA, mensaje] })),
  clearChatIA: () => set({ sesionChatIA: [] }),
  
  recursosAnexos: [],
  addRecursoAnexo: (recurso) => set((state) => ({ recursosAnexos: [...state.recursosAnexos, recurso], estadoCambios: true, planStatus: 'borrador' })),
  
  setApiKey: (key) => {
    localStorage.setItem('inspiratec_api_key', key);
    set({ apiKey: key });
  },

  // Estado del Formulario (Wizard)
  wizardData: {
    tema: '',
    formato: 'Estructura estándar INSPIRATEC',
    grado: '',
    materia: 'Tecnología e Informática',
    duracion: '',
    sesiones: '',
    numEstudiantes: '',
    recursos: '',
    metodologiaSTEAM: '',
    objetivos: '',
    estandaresMEN: [],
    inclusion: [],
    otrasNecesidades: ''
  },

  updateWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),

  userId: null,
  userProfile: null,
  setUserId: (id) => set({ userId: id }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  planId: null,
  setPlanId: (id) => set({ planId: id }),
  planesCount: 0,
  setPlanesCount: (count) => set({ planesCount: count }),

  misPlantillas: [],
  addPlantilla: (plantilla) => set((state) => ({
    misPlantillas: [plantilla, ...state.misPlantillas]
  })),
  setMisPlantillas: (plantillas) => set({ misPlantillas: plantillas }),

  loadPlan: (planMetadata, markdownContent, planId = null) => set((state) => ({
    wizardData: { ...state.wizardData, ...planMetadata },
    planGenerado: markdownContent,
    planId: planId,
    planStatus: 'guardado',
    estadoCambios: false,
    sesionChatIA: [],
    recursosAnexos: planMetadata.recursosAnexos || []
  })),

  resetWizard: () => set({
    wizardData: {
      tema: '', formato: 'Estructura estándar INSPIRATEC', formatoInstrucciones: '', grado: '', materia: 'Tecnología e Informática', duracion: '', sesiones: '', numEstudiantes: '', recursos: '', metodologiaSTEAM: '', objetivos: '', estandaresMEN: [], inclusion: [], otrasNecesidades: ''
    },
    planGenerado: '',
    planId: null,
    sesionChatIA: [],
    recursosAnexos: []
  })
}));
