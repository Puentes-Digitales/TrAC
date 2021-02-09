import { createStore } from "react-state-selector";

export const {
  hooks: { useIsMockActive },
  actions: { setMock },
} = createStore(
  {
    mock: 0,
  },
  {
    storagePersistence: {
      isActive: true,
      persistenceKey: "MockIsActive",
    },
    hooks: {
      useIsMockActive({ mock }) {
        return Boolean(mock);
      },
    },
    actions: {
      setMock: (mock: boolean) => (draft) => {
        draft.mock = mock ? 1 : 0;
      },
    },
  }
);

export const {
  hooks: { useGroupedActive },
  actions: { setGroupedActive },
} = createStore(
  {
    groupedActive: 0,
  },
  {
    storagePersistence: {
      isActive: true,
      persistenceKey: "GroupedActive",
    },
    hooks: {
      useGroupedActive({ groupedActive }) {
        return Boolean(groupedActive);
      },
    },
    actions: {
      setGroupedActive: (groupedActive: boolean) => (draft) => {
        draft.groupedActive = groupedActive ? 1 : 0;
      },
    },
  }
);

export const {
  useStore: useDashboardInputState,
  actions: DashboardInputActions,
  hooks: {
    useProgram,
    useStudent,
    useChosenCurriculum,
    useChosenAdmissionType,
    useChosenCohort,
  },
} = createStore(
  {
    chosenCurriculum: undefined as string | undefined,
    program: undefined as string | undefined,
    student: undefined as string | undefined,
    chosenAdmissionType: undefined as string | undefined,
    chosenCohort: undefined as string | undefined,
  },
  {
    devName: "DashboardInput",
    hooks: {
      useProgram: ({ program }) => {
        return program;
      },
      useStudent: ({ student }) => {
        return student;
      },
      useChosenCurriculum: ({ chosenCurriculum }) => {
        return chosenCurriculum;
      },
      useChosenAdmissionType: ({ chosenAdmissionType }) => {
        return chosenAdmissionType;
      },
      useChosenCohort: ({ chosenCohort }) => {
        return chosenCohort;
      },
    },
    actions: {
      setProgram: (program?: string) => (draft) => {
        draft.program = program;
      },
      setStudent: (student?: string) => (draft) => {
        draft.student = student;
      },
      setChosenCurriculum: (chosenCurriculum?: string) => (draft) => {
        draft.chosenCurriculum = chosenCurriculum;
      },
      setChosenAdmissionType: (chosenAdmissionType?: string) => (draft) => {
        draft.chosenAdmissionType = chosenAdmissionType;
      },
      setChosenCohort: (chosenCohort?: string) => (draft) => {
        draft.chosenCohort = chosenCohort;
      },
    },
  }
);
