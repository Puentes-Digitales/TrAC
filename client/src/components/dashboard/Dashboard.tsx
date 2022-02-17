import { flatMapDeep, random, uniq, toInteger } from "lodash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useUpdateEffect } from "react-use";
import { Box, Flex, Stack } from "@chakra-ui/react";

import { ITakenCourse, ITakenExternalEvaluation } from "../../../../interfaces";
import {
  IS_NOT_TEST,
  PROGRAM_NOT_FOUND,
  PROGRAM_UNAUTHORIZED,
  StateCourse,
  STUDENT_NOT_FOUND,
  UserType,
  termTypeToNumber,
} from "../../../constants";
import { ConfigContext } from "../../context/Config";
import { CoursesDashbordManager } from "../../context/CoursesDashboard";
import {
  DashboardInputActions,
  setMock,
  setGroupedActive,
  useChosenCurriculum,
  useChosenAdmissionType,
  useChosenCohort,
  useIsMockActive,
  useProgram,
  useGroupedActive,
} from "../../context/DashboardInput";
import {
  ForeplanActiveStore,
  ForeplanContextManager,
  ForeplanHelperStore,
} from "../../context/ForeplanContext";
import { useIsPersistenceLoading } from "../../context/PersistenceLoading";
import {
  setTrackingData,
  track,
  TrackingManager,
} from "../../context/Tracking";
import {
  useDirectTakeCoursesMutation,
  useIndirectTakeCoursesMutation,
  usePerformanceLoadAdvicesMutation,
  useSearchProgramMutation,
  useSearchStudentMutation,
  useStudentsFilterListQuery,
  useGroupedSpecialTypesAdmissionQuery,
} from "../../graphql";
import { useUser } from "../../utils/useUser";
import { ToggleDarkMode } from "../DarkMode";
import {
  Dropout,
  ForeplanModeSwitch,
  ComplementaryInfo,
} from "../DynamicComponents";
import { Feedback } from "../feedback";
import { LoadingPage } from "../Loading";
import { SearchBar } from "./SearchBar";
import { SemestersList } from "./SemestersList";
import { GroupedSemestersList } from "./GroupedSemesterList";
import { TakenSemesterBox } from "./TakenSemesterBox";
import { GroupedTakenSemesterBox } from "./GroupedTakenSemesterBox";
import { TimeLine } from "./Timeline/Timeline";
import { GroupedTimeLine } from "./Timeline/GroupedTimeline";
import { ProgressStudent } from "./ProgressStudent";
import { CoursesDashboardStore } from "../../context/CoursesDashboard";
import { GroupedComplementaryInfo } from "./GroupedComplementaryInfo";

export function Dashboard() {
  const mock = useIsMockActive();
  const grouped = useGroupedActive();
  const chosenCurriculum = useChosenCurriculum();
  const program = useProgram();
  const chosenAdmissionType = useChosenAdmissionType();
  const chosenCohort = useChosenCohort();
  const explicitSemester = CoursesDashboardStore.hooks
    .useExplicitSemester()
    ?.split("—");
  const { user } = useUser();
  const [mockData, setMockData] = useState<
    typeof import("../../../constants/mockData")
  >();
  var nStudentsComplementaryInfo:
    | number
    | null
    | undefined; /*this value match # students from complementary info with semesterTaken components*/

  useEffect(() => {
    if (mock && !mockData) {
      import("../../../constants/mockData").then((data) => {
        setMockData(data);
      });
    }
  }, [mock, mockData, setMockData]);

  const [
    searchPerformanceByLoad,
    { data: dataPerformanceByLoad, error: errorPerformanceByLoad },
  ] = usePerformanceLoadAdvicesMutation();
  const [
    searchDirectTakeCourses,
    { data: dataDirectTakeCourses, error: errorDirectTakeCourses },
  ] = useDirectTakeCoursesMutation();
  const [
    searchIndirectTakeCourses,
    { data: dataIndirectTakeCourses, error: errorIndirectTakeCourses },
  ] = useIndirectTakeCoursesMutation();

  useEffect(() => {
    if (errorDirectTakeCourses) {
      console.error(JSON.stringify(errorDirectTakeCourses, null, 2));
    }
    if (errorIndirectTakeCourses) {
      console.error(JSON.stringify(errorIndirectTakeCourses, null, 2));
    }
    if (errorPerformanceByLoad) {
      console.error(JSON.stringify(errorPerformanceByLoad, null, 2));
    }
  }, [
    errorDirectTakeCourses,
    errorPerformanceByLoad,
    errorIndirectTakeCourses,
  ]);

  const [
    searchProgram,
    {
      data: searchProgramData,
      loading: searchProgramLoading,
      error: searchProgramError,
    },
  ] = useSearchProgramMutation();

  const [
    searchStudent,
    {
      data: searchStudentData,
      loading: searchStudentLoading,
      error: searchStudentError,
    },
  ] = useSearchStudentMutation();

  const { data: dataStudentFilterList } = useStudentsFilterListQuery({
    variables: {
      program_id: program || "",
      curriculum: chosenCurriculum || "",
      grouped: grouped,
    },
    skip: !program,
  });

  const {
    data: dataGroupedSpecialAdmissions,
  } = useGroupedSpecialTypesAdmissionQuery();

  useUpdateEffect(() => {
    if (IS_NOT_TEST && user?.admin) {
      console.log({
        searchProgramData,
        searchStudentData,
        dataPerformanceByLoad,
        dataDirectTakeCourses,
        dataIndirectTakeCourses,
      });
    }
  }, [
    searchProgramData,
    searchStudentData,
    dataPerformanceByLoad,
    dataDirectTakeCourses,
    dataIndirectTakeCourses,
    user,
  ]);

  useEffect(() => {
    if (!user?.admin && mock) {
      setMock(false);
    }
  }, [user, mock]);

  useEffect(() => {
    setTrackingData({
      curriculum: chosenCurriculum,
    });
  }, [chosenCurriculum]);

  useEffect(() => {
    setTrackingData({
      admission_type: chosenAdmissionType,
    });
  }, [chosenAdmissionType]);

  useEffect(() => {
    setTrackingData({
      cohort: chosenCohort,
    });
  }, [chosenCohort]);

  useEffect(() => {
    setGroupedActive(false);
    setMock(false);
  }, []);

  useEffect(() => {
    if (searchStudentData?.student) {
      setMock(false);
      setTrackingData({
        student: searchStudentData.student.id,
      });
      DashboardInputActions.setStudent(searchStudentData.student.id);
    } else {
      setTrackingData({
        student: undefined,
      });
      DashboardInputActions.setStudent(undefined);
    }
  }, [searchStudentData]);

  useEffect(() => {
    if (searchProgramData?.program) {
      DashboardInputActions.setProgram(searchProgramData.program.id);
      setTrackingData({
        showingProgress: true,
        program: searchProgramData.program.id,
      });
    } else {
      DashboardInputActions.setProgram(undefined);
      setTrackingData({
        showingProgress: false,
        program: undefined,
      });
    }
  }, [searchProgramData]);

  useEffect(() => {
    if (user?.type === UserType.Student) {
      searchProgram();
      searchStudent();
      searchPerformanceByLoad();
      searchDirectTakeCourses();
      searchIndirectTakeCourses();
    }
  }, [user, searchProgram, searchStudent, searchPerformanceByLoad]);

  const isPersistenceLoading = useIsPersistenceLoading();

  useEffect(() => {
    if (!mock || !mockData || isPersistenceLoading) return;

    ForeplanHelperStore.actions.setForeplanAdvices(
      mockData.default.performanceByLoad ?? []
    );
    const allCoursesOfProgram: {
      code: string;
      requisites: string[];
    }[] = [];
    mockData.default.searchProgramData.program.curriculums.forEach(
      ({ semesters }) => {
        for (const { courses } of semesters) {
          for (const { code, requisites } of courses) {
            allCoursesOfProgram.push({
              code,
              requisites: requisites.map(({ code }) => code),
            });
          }
        }
      }
    );
    const allApprovedCourses: Record<string, boolean> = {};
    mockData.default.searchStudentData.student.terms.forEach(
      ({ takenCourses }) => {
        for (const { state, code, equiv } of takenCourses) {
          if (state === StateCourse.Passed) {
            allApprovedCourses[code] = true;
            if (equiv) {
              allApprovedCourses[equiv] = true;
            }
          }
        }
      }
    );

    ForeplanHelperStore.actions.setDirectTakeData(
      allCoursesOfProgram.reduce<string[]>((acum, { code, requisites }) => {
        if (
          requisites.every((requisiteCourseCode) => {
            return allApprovedCourses[requisiteCourseCode] || false;
          })
        ) {
          acum.push(code);
        }
        return acum;
      }, [])
    );

    const requisitesUnmetObj = allCoursesOfProgram.reduce<
      {
        course: string;
        requisitesUnmet: string[];
      }[]
    >((acum, { code, requisites }) => {
      if (
        requisites.some((requisiteCourseCode) => {
          return !allApprovedCourses[requisiteCourseCode];
        })
      ) {
        acum.push({
          course: code,
          requisitesUnmet: requisites.reduce<string[]>(
            (acum, requisiteCourseCode) => {
              if (!allApprovedCourses[requisiteCourseCode]) {
                acum.push(requisiteCourseCode);
              }
              return acum;
            },
            []
          ),
        });
      }
      return acum;
    }, []);

    ForeplanHelperStore.actions.setIndirectTakeCoursesRequisites(
      requisitesUnmetObj
    );

    const allCodes = flatMapDeep(
      mockData.default.searchProgramData.program.curriculums.map(
        ({ semesters }) => {
          return semesters.map(({ courses }) => {
            return courses.map(({ code }) => {
              return code;
            });
          });
        }
      )
    );

    if (user?.config.FOREPLAN_COURSE_STATS) {
      if (user?.config.FOREPLAN_COURSE_EFFORT_STATS) {
        ForeplanHelperStore.actions.setEffortData(
          allCodes.map((code) => {
            return { code, effort: random(1, 5) };
          })
        );
      }

      if (user?.config.FOREPLAN_COURSE_FAIL_RATE_STATS) {
        ForeplanHelperStore.actions.setFailRateData(
          allCodes.map((code) => {
            return { code, failRate: Math.random() };
          })
        );
      }
    }
  }, [mock, mockData, user, isPersistenceLoading]);

  useEffect(() => {
    if (mock) return;

    if (dataPerformanceByLoad?.performanceLoadAdvices) {
      ForeplanHelperStore.actions.setForeplanAdvices(
        dataPerformanceByLoad.performanceLoadAdvices
      );
    }
  }, [mock, dataPerformanceByLoad]);

  useEffect(() => {
    if (mock) return;

    if (dataDirectTakeCourses?.directTakeCourses) {
      ForeplanHelperStore.actions.setDirectTakeData(
        dataDirectTakeCourses.directTakeCourses.map(({ code }) => code)
      );
    }
  }, [mock, dataDirectTakeCourses]);

  useEffect(() => {
    if (mock) return;

    if (!isPersistenceLoading && dataIndirectTakeCourses?.indirectTakeCourses) {
      const indirectTakesCoursesList = dataIndirectTakeCourses.indirectTakeCourses.map(
        ({ course: { code }, requisitesUnmet }) => {
          return {
            course: code,
            requisitesUnmet,
          };
        }
      );

      ForeplanHelperStore.actions.setIndirectTakeCoursesRequisites(
        indirectTakesCoursesList
      );
    }
  }, [mock, dataIndirectTakeCourses, isPersistenceLoading]);

  useEffect(() => {
    if (mock) return;

    if (
      !isPersistenceLoading &&
      !dataPerformanceByLoad &&
      !dataDirectTakeCourses &&
      !dataIndirectTakeCourses
    ) {
      ForeplanActiveStore.actions.disableForeplan();
      ForeplanHelperStore.actions.setForeplanAdvices([]);
    }
  }, [
    user,
    isPersistenceLoading,
    dataPerformanceByLoad,
    dataDirectTakeCourses,
    dataIndirectTakeCourses,
    mock,
  ]);

  const {
    TimeLineComponent,
    TakenSemestersComponent,
    SemestersComponent,
    DropoutComponent,
    ComplementaryInfoComponent,
    ProgressStudentComponent,
    ForePlanSwitchComponent,
    GroupedPerformanceInfoComponent,
  } = useMemo(() => {
    let TimeLineComponent: JSX.Element | null = null;
    let DropoutComponent: JSX.Element | null = null;
    let TakenSemestersComponent: JSX.Element | null = null;
    let SemestersComponent: JSX.Element | null = null;
    let ComplementaryInfoComponent: JSX.Element | null = null;
    let ProgressStudentComponent: JSX.Element | null = null;
    let ForePlanSwitchComponent: JSX.Element | null = null;
    let GroupedPerformanceInfoComponent: JSX.Element | null = null;

    const studentData = mock
      ? grouped
        ? undefined
        : mockData?.default.searchStudentData.student
      : searchStudentData?.student;

    const programData = mock
      ? mockData?.default.searchProgramData.program
      : searchProgramData?.program;

    const studentListData = mock
      ? mockData?.default.searchStudentListData
      : dataStudentFilterList;
    console.log(
      "COHORTE ",
      chosenCohort,
      "CURRICULUM",
      chosenCurriculum,
      "TIPO DE ADMI",
      chosenAdmissionType
    );

    if (studentData && !grouped) {
      const {
        cumulated_grade,
        semestral_grade,
        program_grade,
        semestersTaken,
      } = studentData.terms.reduce<{
        cumulated_grade: number[];
        semestral_grade: number[];
        program_grade: number[];
        semestersTaken: { year: number; term: string }[];
      }>(
        (acum, value) => {
          acum.semestersTaken.push({
            year: value.year,
            term: value.term,
          });
          acum.cumulated_grade.push(value.cumulated_grade);
          acum.semestral_grade.push(value.semestral_grade);
          acum.program_grade.push(value.program_grade);
          return acum;
        },
        {
          cumulated_grade: [],
          semestral_grade: [],
          program_grade: [],
          semestersTaken: [],
        }
      );
      TimeLineComponent = (
        <TimeLine
          cumulatedGrades={cumulated_grade.slice().reverse()}
          semestralGrades={semestral_grade.slice().reverse()}
          programGrades={program_grade.slice().reverse()}
          semestersTaken={semestersTaken.slice().reverse()}
        />
      );
      TakenSemestersComponent = (
        <Flex alignItems="center" justifyContent="center" mt={0} mb={3}>
          {studentData.terms
            .slice()
            .reverse()
            .map(({ term, year, comments }, key) => {
              return (
                <TakenSemesterBox
                  key={key}
                  term={term}
                  year={year}
                  comments={comments}
                />
              );
            })}
        </Flex>
      );
      if (user?.config?.FOREPLAN)
        ForePlanSwitchComponent = <ForeplanModeSwitch />;
      if (
        studentData.dropout?.active &&
        studentData.dropout.prob_dropout &&
        user?.config?.SHOW_DROPOUT
      ) {
        DropoutComponent = (
          <Dropout
            probability={studentData.dropout.prob_dropout}
            accuracy={studentData.dropout.model_accuracy}
          />
        );
      } else {
        DropoutComponent = null;
      }
      if (
        (studentData.admission?.type_admission || studentData.employed) &&
        user?.config?.SHOW_STUDENT_COMPLEMENTARY_INFORMATION
      ) {
        ComplementaryInfoComponent = (
          <ComplementaryInfo
            employed={studentData.employed?.employed}
            type_admission={studentData.admission.type_admission}
            educational_system={studentData.employed?.educational_system}
            institution={studentData.employed?.institution}
            months_to_first_job={studentData.employed?.months_to_first_job}
          />
        );
      }
      if (
        user?.config?.SHOW_PROGRESS_STUDENT_CYCLE &&
        studentData.n_courses_cycles.length > 0 &&
        studentData.n_cycles.length > 0
      ) {
        ProgressStudentComponent = (
          <ProgressStudent
            n_courses_cycles={studentData.n_courses_cycles}
            n_cycles_student={studentData.n_cycles}
          />
        );
      }
    }
    //CARGA
    if (programData && !grouped) {
      const curriculums =
        programData?.curriculums
          .filter(({ id }) => {
            if (studentData) {
              return studentData.curriculums.includes(id);
            }
            return true;
          })
          .map(({ semesters: curriculumSemesters, id: curriculumId }) => {
            const semesters = curriculumSemesters.map((va) => {
              const semester = {
                n: va.id,
                externalEvaluations: va.externalEvaluations.map(
                  ({ code, name, bandColors }) => {
                    return {
                      code,
                      name,
                      bandColors,

                      taken: (() => {
                        const taken: ITakenExternalEvaluation[] = [];
                        if (studentData) {
                          for (const {
                            term,
                            year,
                            takenExternalEvaluations,
                          } of studentData.terms) {
                            for (const {
                              code: courseCode,
                              registration,
                              state,
                              grade,
                              topic,
                              currentDistribution,
                              bandColors,
                            } of takenExternalEvaluations) {
                              if (courseCode === code) {
                                taken.push({
                                  term,
                                  year,
                                  registration,
                                  state,
                                  grade,
                                  topic,
                                  currentDistribution,
                                  bandColors,
                                });
                              }
                            }
                          }
                        }

                        return taken;
                      })(),
                    };
                  }
                ),
                courses: va.courses.map(
                  ({
                    code,
                    name,
                    credits,
                    flow,
                    requisites,
                    historicalDistribution,
                    bandColors,
                    mention,
                  }) => {
                    return {
                      code,
                      mention,
                      name,
                      credits,
                      flow: flow.map(({ code }) => {
                        return code;
                      }),
                      requisites: requisites.map(({ code }) => {
                        return code;
                      }),
                      historicDistribution: historicalDistribution,
                      bandColors,
                      taken: (() => {
                        const taken: ITakenCourse[] = [];
                        if (studentData) {
                          for (const {
                            term,
                            year,
                            takenCourses,
                          } of studentData.terms) {
                            for (const {
                              code: courseCode,
                              equiv,
                              registration,
                              state,
                              grade,
                              currentDistribution, //<------ grouped distributon
                              historicalDistribution,
                              parallelGroup,
                              bandColors,
                            } of takenCourses) {
                              if (equiv === code || courseCode === code) {
                                taken.push({
                                  term,
                                  year,
                                  registration,
                                  state,
                                  grade,
                                  currentDistribution,
                                  historicalDistribution,
                                  parallelGroup,
                                  equiv: equiv === code ? courseCode : "",
                                  bandColors,
                                });
                              }
                            }
                          }
                        }

                        return taken;
                      })(),
                    };
                  }
                ),
              };
              return { semester };
            });
            return { id: curriculumId, semesters };
          }) ?? [];

      const data = curriculums.find(({ id: curriculumId }) => {
        return !mock && chosenCurriculum
          ? curriculumId === chosenCurriculum
          : true;
      });

      if (data && studentData) {
        SemestersComponent = (
          <SemestersList
            semesters={data.semesters.map(({ semester }) => semester)}
            student_mention={searchStudentData?.student?.mention ?? ""}
          />
        );
      }
    }

    if (programData && grouped) {
      ///////////////////////////////////////////////////////////////////////////////////////// <------------
      const curriculums =
        programData?.curriculums
          .filter(({ id }) => {
            if (studentData) {
              return studentData.curriculums.includes(id);
            }
            return true;
          })
          .map(({ semesters: curriculumSemesters, id: curriculumId }) => {
            const semesters = curriculumSemesters.map((va) => {
              const foundData = explicitSemester
                ? {
                    year: toInteger(explicitSemester[1]),
                    term: termTypeToNumber(explicitSemester[0]),
                  }
                : {
                    year: programData.courseGroupedStats
                      .filter((course) => course.curriculum == curriculumId)
                      .map((course) => course.year)
                      .reduce((a, b) => Math.max(a, b)),
                    term: programData.courseGroupedStats.filter(
                      (course) =>
                        course.curriculum == chosenCurriculum &&
                        course.cohort == chosenCohort
                    )[0]?.term,
                  };
              const semester = {
                n: va.id,
                externalEvaluations: va.externalEvaluations.map(
                  ({ code, name }) => {
                    const externalEvaluationFilter = programData.externalEvaluationGroupedStats.filter(
                      (value) =>
                        value.curriculum == curriculumId &&
                        value.type_admission == chosenAdmissionType &&
                        value.cohort == chosenCohort &&
                        value.external_evaluation_id == code &&
                        value.year == foundData.year &&
                        value.term == foundData.term
                    );
                    return {
                      code,
                      name,
                      taken: externalEvaluationFilter,
                      n_passed: externalEvaluationFilter[0]
                        ? externalEvaluationFilter[0].n_pass
                        : 0,
                      n_total: externalEvaluationFilter[0]
                        ? externalEvaluationFilter[0].n_students
                        : 0,
                    };
                  }
                ),
                courses: va.courses.map(
                  ({
                    code,
                    name,
                    mention,
                    credits,
                    flow,
                    requisites,
                    historicalDistribution,
                    bandColors,
                  }) => {
                    const filteredData = programData.courseGroupedStats.filter(
                      (value) =>
                        value.curriculum == curriculumId &&
                        value.type_admission == chosenAdmissionType &&
                        value.cohort == chosenCohort &&
                        value.course_id == code &&
                        value.year <= foundData.year! &&
                        value.year >=
                          (chosenCohort != ""
                            ? toInteger(chosenCohort)
                            : value.year)
                    );
                    const courseSelected = filteredData.filter(
                      (value) =>
                        value.year === foundData.year &&
                        value.term === foundData.term
                    );

                    let numStudentsApproveed = 0;
                    filteredData.map((value) => {
                      if (value.year < foundData.year!) {
                        numStudentsApproveed =
                          numStudentsApproveed + value.n_pass;
                      }
                      if (
                        value.year == foundData.year &&
                        value.term <= foundData.term!
                      ) {
                        numStudentsApproveed =
                          numStudentsApproveed + value.n_pass;
                      }
                    });

                    return {
                      code,
                      name,
                      credits,
                      mention,
                      flow: flow.map(({ code }) => {
                        return code;
                      }),
                      requisites: requisites.map(({ code }) => {
                        return code;
                      }),
                      historicDistribution: historicalDistribution,
                      bandColors,
                      n_passed: numStudentsApproveed,
                      n_total: filteredData[0] ? filteredData[0].n_students : 0,
                      agroupedDistribution: courseSelected[0]
                        ? courseSelected[0].distribution
                        : [],
                      agroupedBandColors: courseSelected[0]
                        ? courseSelected[0].color_bands
                        : [],
                    };
                  }
                ),
              };
              return { semester };
            });
            return { id: curriculumId, semesters };
          }) ?? [];
      const data = curriculums.find(({ id: curriculumId }) => {
        return !mock && chosenCurriculum
          ? curriculumId === chosenCurriculum
          : true;
      });
      if (data) {
        const filteredComplementaryData = programData.groupedComplementary.filter(
          (value) =>
            value.curriculum == chosenCurriculum &&
            value.type_admission == chosenAdmissionType &&
            value.cohort == chosenCohort
        );
        const filteredEmpleabilityData = programData.groupedEmployed.filter(
          (value) =>
            value.curriculum == chosenCurriculum &&
            value.type_admission == chosenAdmissionType &&
            value.cohort == chosenCohort
        );

        if (chosenCurriculum != "") {
          SemestersComponent = (
            <GroupedSemestersList
              semesters={data.semesters.map(({ semester }) => semester)}
            />
          );
        }

        if (chosenCurriculum && chosenCohort && studentListData) {
          const allStudents = studentListData.students_filter
            .filter((stu) => stu.curriculums.includes(chosenCurriculum))
            .map((stu) => {
              return {
                id: stu.id,
                curriculums: stu.curriculums,
                start_year: stu.start_year,
                mention: stu.mention,
                programs: stu.programs,
                admission: stu.admission,
                terms: stu.terms.filter(
                  (term) => term.year >= toInteger(chosenCurriculum)
                ),
              };
            });
          console.log("allStudents", allStudents);

          const allStudentsGrades = allStudents.map((stu) =>
            stu.terms
              .map((semester) => {
                return semester.semestral_grade;
              })
              .reverse()
          );
          console.log("ALL STUDENTS GRADES", allStudentsGrades);
          var filteredStudents;
          if (chosenAdmissionType === "OTROS INGRESOS ESPECIALES") {
            //Hard-Code - To do refactoring
            filteredStudents = studentListData.students_filter
              .filter(
                (stu) =>
                  dataGroupedSpecialAdmissions?.groupedSpecialTypesAdmission.includes(
                    stu.admission.type_admission
                  ) &&
                  stu.curriculums.includes(chosenCurriculum) &&
                  stu.start_year == toInteger(chosenCohort)
              )
              .map((stu) => {
                return {
                  id: stu.id,
                  curriculums: stu.curriculums,
                  start_year: stu.start_year,
                  mention: stu.mention,
                  programs: stu.programs,
                  admission: stu.admission,
                  terms: stu.terms.filter(
                    (term) =>
                      term.year >= toInteger(chosenCohort) &&
                      term.program_id === program
                  ),
                };
              });
          } else {
            filteredStudents = studentListData.students_filter
              .filter((stu) =>
                chosenAdmissionType?.length /* when chosenAdmissionType="" means user want to see all types Admission */
                  ? stu.admission.type_admission === chosenAdmissionType &&
                    stu.curriculums.includes(chosenCurriculum) &&
                    stu.start_year == toInteger(chosenCohort)
                  : stu.curriculums.includes(chosenCurriculum) &&
                    stu.start_year == toInteger(chosenCohort)
              )
              .map((stu) => {
                return {
                  id: stu.id,
                  curriculums: stu.curriculums,
                  start_year: stu.start_year,
                  mention: stu.mention,
                  programs: stu.programs,
                  admission: stu.admission,
                  terms: stu.terms.filter(
                    (term) =>
                      term.year >= toInteger(chosenCohort) &&
                      term.program_id === program
                  ),
                };
              });
          }
          console.log("FILTERED STUDENTS :", filteredStudents);
          const filteredStudentsGrades = filteredStudents.map((stu) =>
            stu.terms
              .map((semester) => {
                if (semester.year >= toInteger(chosenCohort))
                  return semester.semestral_grade;
              })
              .reverse()
          );
          console.log("FILTERED STUDENTS GRADES ", filteredStudentsGrades);

          const maxTerm =
            allStudents.length != 0
              ? allStudents
                  ?.map((v) => v.terms.length)
                  .reduce((a, b) => {
                    return Math.max(a, b);
                  })
              : 0;

          const filteredMaxTerm =
            filteredStudents.length != 0
              ? filteredStudents
                  .map((v) => v.terms.length)
                  .reduce((a, b) => {
                    return Math.max(a, b);
                  })
              : 0;

          const grades = new Array();
          for (let i = 0; i < maxTerm; i++) {
            grades.push(allStudentsGrades.map((v) => v[i] ?? 0));
          }

          console.log("ALL GRADES :", grades);

          const filteredGrades = new Array();
          for (let i = 0; i < filteredMaxTerm; i++) {
            filteredGrades.push(filteredStudentsGrades.map((v) => v[i] ?? 0));
          }
          console.log("FILTERED GRADES :", filteredGrades);
          const maxGrades =
            filteredStudentsGrades.length != 0
              ? filteredStudentsGrades
                  ?.map((v) => v.length)
                  .reduce((a, b) => {
                    return Math.max(a, b);
                  })
              : 0;

          const avgGrades = grades.map((arr) => {
            return (
              arr.reduce((a: number, b: number) => {
                if (a && b) return a + b;
                if (!a) return b;
                if (!b) return a;
                return;
              }) / (arr.filter((ele: number) => ele).length || 1)
            );
          });
          console.log("avgGrades : ", avgGrades);

          const n_students_per_semester: number[] = [];

          const filteredAvgGrades = filteredGrades!.map((arr) => {
            n_students_per_semester.push(
              arr.filter((ele: number) => ele).length
            );

            if (
              n_students_per_semester.length === 1 &&
              n_students_per_semester[0] === 0
            ) {
              n_students_per_semester[0] = filteredGrades[0].length;
            }

            //number of students with registered courses

            //n_students_per_semester[maxGrades - 1] = registered;
            console.log("n students per semester: ", n_students_per_semester);
            return (
              arr.reduce((a: number, b: number) => {
                if (a && b) return a + b;
                if (!a) return b;
                if (!b) return a;
              }, 0) / (arr.filter((ele: number) => ele).length || 1)
            );
          });
          let registered = 0;
          filteredStudentsGrades.map((item) => {
            if (item.length === maxGrades) {
              console.log("item.length :", item.length);
              registered = registered + 1;
            }
          });
          console.log("filteredGrades:", filteredGrades);

          n_students_per_semester.splice(maxGrades - 1, 0, registered);
          nStudentsComplementaryInfo = n_students_per_semester[0];

          const studentTerms = filteredStudents.filter(
            (student) => student.terms.length == filteredMaxTerm
          )[0]?.terms;
          console.log("studentTerms: ", studentTerms);

          const takenTerms = studentTerms?.map((i) => {
            return { year: i.year, term: i.term };
          });
          var cohortLen = filteredAvgGrades.length;

          //To do: Refactoring
          var isZero = true;
          let i = 1;
          while (isZero) {
            if (filteredAvgGrades[filteredAvgGrades.length - i] === 0) {
              cohortLen = cohortLen - 1;
            } else {
              isZero = false;
            }
            i++;
          }
          //
          TimeLineComponent = (
            <GroupedTimeLine
              programGrades={avgGrades.slice(0, cohortLen)}
              filteredGrades={filteredAvgGrades}
              takenSemesters={takenTerms?.slice().reverse() ?? []}
            />
          );

          studentTerms
            ? (TakenSemestersComponent = (
                <Flex alignItems="center" justifyContent="center" mt={0} mb={3}>
                  {studentTerms
                    .slice()
                    .reverse()
                    .map(({ term, year }, key) => {
                      if (n_students_per_semester[key])
                        return (
                          <GroupedTakenSemesterBox
                            key={key}
                            term={term}
                            n_students={n_students_per_semester[key] ?? 0}
                            year={year}
                            comments={""}
                          />
                        );
                    })}
                </Flex>
              ))
            : (TakenSemestersComponent = null);
        }

        if (
          (filteredEmpleabilityData[0] || filteredComplementaryData[0]) &&
          user?.config?.SHOW_GROUPED_COMPLEMENTARY_INFO
        ) {
          if (!chosenCohort?.length) {
            if (chosenCurriculum?.length) {
              if (chosenAdmissionType?.length) {
                if (chosenAdmissionType === "Otro Ingresos especiales") {
                  nStudentsComplementaryInfo = studentListData?.students_filter.filter(
                    (stu) =>
                      dataGroupedSpecialAdmissions?.groupedSpecialTypesAdmission.includes(
                        stu.admission.type_admission
                      )
                  ).length;
                } else {
                  nStudentsComplementaryInfo = studentListData?.students_filter.filter(
                    (stu) =>
                      stu.admission.type_admission === chosenAdmissionType
                  ).length;
                }
              } else {
                nStudentsComplementaryInfo =
                  dataStudentFilterList?.students_filter.length;
              }
            } else {
              nStudentsComplementaryInfo =
                dataStudentFilterList?.students_filter.length;
            }
          }

          GroupedPerformanceInfoComponent = (
            <GroupedComplementaryInfo
              total_students={
                nStudentsComplementaryInfo
                  ? nStudentsComplementaryInfo
                  : filteredComplementaryData[0]?.total_students
              }
              university_degree_rate={
                filteredComplementaryData[0]?.university_degree_rate
              }
              average_time_university_degree={
                filteredComplementaryData[0]?.average_time_university_degree
              }
              timely_university_degree_rate={
                filteredComplementaryData[0]?.timely_university_degree_rate
              }
              retention_rate={filteredComplementaryData[0]?.retention_rate}
              empleability_rate={filteredEmpleabilityData[0]?.employed_rate}
              average_time_finding_job={
                filteredEmpleabilityData[0]?.average_time_job_finding
              }
              empleability_rate_educational_system={
                filteredEmpleabilityData[0]?.employed_rate_educational_system
              }
              inactive_time_rate={
                filteredComplementaryData[0]?.inactive_time_rate
              }
            />
          );
        }
      }
    }

    return {
      TimeLineComponent,
      DropoutComponent,
      TakenSemestersComponent,
      SemestersComponent,
      ComplementaryInfoComponent,
      ProgressStudentComponent,
      ForePlanSwitchComponent,
      GroupedPerformanceInfoComponent,
    };
  }, [
    searchStudentData,
    searchProgramData,
    dataStudentFilterList,
    chosenCurriculum,
    chosenAdmissionType,
    chosenCohort,
    explicitSemester,
    mock,
    grouped,
    mockData,
  ]);

  const {
    ERROR_STUDENT_NOT_FOUND_MESSAGE,
    ERROR_PROGRAM_UNAUTHORIZED_MESSAGE,
    ERROR_PROGRAM_NOT_FOUND,
    FEEDBACK_ENABLED,
  } = useContext(ConfigContext);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        track({
          action: "login",
          effect: "load-app",
          target: "website",
        });
      }, 1000);
    }
  }, [user]);

  const onlyProgramSearch =
    !!searchProgramData?.program && !searchStudentData?.student;

  const searchResult = useMemo(() => {
    return {
      curriculums: uniq(
        searchProgramData?.program?.courseGroupedStats?.map((i) =>
          chosenAdmissionType == i.type_admission && chosenCohort == i.cohort
            ? i.curriculum
            : ""
        )
      ),

      admission_types: uniq(
        searchProgramData?.program?.courseGroupedStats?.map((i) =>
          chosenCurriculum == i.curriculum && chosenCohort == i.cohort
            ? i.type_admission
            : ""
        )
      ),

      cohorts: uniq(
        searchProgramData?.program?.courseGroupedStats?.map((i) =>
          chosenCurriculum == i.curriculum &&
          chosenAdmissionType == i.type_admission
            ? i.cohort
            : ""
        )
      ),
      student:
        user?.type === UserType.Director
          ? searchStudentData?.student?.id
          : user?.student_id,
      program_id: searchProgramData?.program?.id,
      program_name: searchProgramData?.program?.name,
    };
  }, [
    searchProgramData,
    searchStudentData,
    chosenCurriculum,
    chosenAdmissionType,
    chosenCohort,
    user,
  ]);
  const searchError = useMemo(() => {
    return uniq(
      [
        ...(searchProgramError?.graphQLErrors ?? []),
        ...(searchStudentError?.graphQLErrors ?? []),
        ...(errorPerformanceByLoad?.graphQLErrors ?? []),
        ...(errorDirectTakeCourses?.graphQLErrors ?? []),
      ].map(({ message }) => {
        switch (message) {
          case STUDENT_NOT_FOUND:
            return ERROR_STUDENT_NOT_FOUND_MESSAGE;
          case PROGRAM_UNAUTHORIZED:
            return ERROR_PROGRAM_UNAUTHORIZED_MESSAGE;
          case PROGRAM_NOT_FOUND:
            return ERROR_PROGRAM_NOT_FOUND;
          default:
            return message;
        }
      })
    )
      .join("\n")
      .trim();
  }, [
    searchProgramError,
    searchStudentError,
    errorPerformanceByLoad,
    errorDirectTakeCourses,
  ]);

  const onSearchFn = useCallback(
    async ({ student_id, program_id }) => {
      try {
        if (student_id) {
          if (user?.config.FOREPLAN) {
            searchPerformanceByLoad({
              variables: { student_id, program_id },
            });
            searchDirectTakeCourses({
              variables: { student_id, program_id },
            });
            if (user.config.FOREPLAN_FUTURE_COURSE_PLANIFICATION) {
              searchIndirectTakeCourses({
                variables: { student_id, program_id },
              });
            }
          }
        }
        const [programSearch, studentSearch] = await Promise.all([
          searchProgram({
            variables: {
              id: program_id,
              student_id: student_id || undefined,
            },
          }),
          searchStudent({
            variables: { student_id, program_id },
          }),
        ]);

        if (studentSearch.data?.student && programSearch.data?.program) {
          return "student";
        } else if (programSearch.data?.program) {
          return "program";
        }
      } catch (err) {
        console.error(err);
      }

      return undefined;
    },
    [
      searchPerformanceByLoad,
      searchDirectTakeCourses,
      searchIndirectTakeCourses,
      searchProgram,
      searchStudent,
    ]
  );
  const showsForeplanSummaryTab = ForeplanActiveStore.hooks.useAnyForeplanCourses();

  return (
    <>
      {user?.type === UserType.Director ? (
        <SearchBar
          error={searchError}
          searchResult={searchResult}
          isSearchLoading={searchProgramLoading || searchStudentLoading}
          onSearch={onSearchFn}
        />
      ) : (
        <>
          {searchProgramLoading || searchStudentLoading ? (
            <LoadingPage />
          ) : (
            <SearchBar
              onSearch={onSearchFn}
              isSearchLoading={false}
              searchResult={searchResult}
            />
          )}
        </>
      )}

      <Flex
        pos={onlyProgramSearch ? "relative" : "absolute"}
        width="100%"
        justifyContent="flex-end"
      >
        <ToggleDarkMode
          mr={showsForeplanSummaryTab ? "30px" : undefined}
          p={2}
        />
      </Flex>

      <ScrollContainer activationDistance={5} hideScrollbars={false}>
        <Flex>
          <Box pt={25}>
            <Flex>
              {GroupedPerformanceInfoComponent}
              {ComplementaryInfoComponent}
              {ProgressStudentComponent}
            </Flex>
          </Box>

          {TimeLineComponent && (
            <Box id="graphic_advance">
              {TimeLineComponent}

              <Stack isInline pl={45}>
                {TakenSemestersComponent}
              </Stack>
            </Box>
          )}
          <Stack pt={25}>
            {DropoutComponent}
            <Stack pt={DropoutComponent ? 55 : 245}>
              {ForePlanSwitchComponent}
            </Stack>
          </Stack>
        </Flex>
      </ScrollContainer>

      {SemestersComponent}

      <TrackingManager />

      {FEEDBACK_ENABLED && user?.config.FEEDBACK && <Feedback />}

      {user?.config.FOREPLAN && <ForeplanContextManager />}

      <CoursesDashbordManager
        distinct={`${chosenCurriculum}${program}${mock}`}
      />
    </>
  );
}
