import { AnimatePresence, motion } from "framer-motion";
import { range, uniq } from "lodash";
import dynamic from "next/dynamic";
import Router from "next/router";
import { DownloadWord } from "./DownloadWord";
import { generate } from "randomstring";
import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Select from "react-select";
import { Button as Button2 } from "@chakra-ui/react";
import { Button, Icon } from "semantic-ui-react";
import pixelWidth from "string-pixel-width";
import { useRememberState } from "use-remember-state";

import { useApolloClient } from "@apollo/client";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
} from "@chakra-ui/react";

import { UserType } from "../../../constants";
import { ConfigContext } from "../../context/Config";
import {
  DashboardInputActions,
  setMock,
  useChosenCurriculum,
  useIsMockActive,
  useGroupedActive,
  setGroupedActive,
  useChosenAdmissionType,
  useChosenCohort,
} from "../../context/DashboardInput";
import { setTrackingData, track } from "../../context/Tracking";
import { useMyProgramsQuery } from "../../graphql";
import { marginLeft5px } from "../../utils/cssConstants";
import { useUser } from "../../utils/useUser";
import { Help } from "../Help";

import { Parameter } from "../dashboard/Parameter";

import { useSendCredentialMutation } from "../../graphql";
import type { $ElementType } from "utility-types";
import { loginHelpdesk } from "../../utils/helpdeskForm";
const StudentList = dynamic(() => import("./StudentList"));

const MockingMode: FC = memo(() => {
  const mock = useIsMockActive();
  return (
    <Button
      basic
      onClick={() => {
        setMock(!mock);
      }}
      color={mock ? "blue" : "red"}
    >
      {mock ? "Mocking ON" : "Mocking OFF"}
    </Button>
  );
});

export const SearchBar: FC<{
  isSearchLoading: boolean;
  onSearch: (input: {
    student_id: string;
    program_id: string;
  }) => Promise<"student" | "program" | undefined>;
  searchResult?: {
    curriculums: string[];
    admission_types: string[];
    cohorts: string[];
    student?: string;
    program_id?: string;
    program_name?: string;
  };
  error?: string;
}> = memo(({ isSearchLoading, onSearch, searchResult, error }) => {
  const mock = useIsMockActive();
  const chosenCurriculum = useChosenCurriculum();
  const groupedActive = useGroupedActive();
  const chosenAdmissionType = useChosenAdmissionType();
  const chosenCohort = useChosenCohort();
  const { user } = useUser();

  const [
    sendCredentials,
    { loading: loadingSendCredentials },
  ] = useSendCredentialMutation();

  const callLoginHelpdesk = async () => {
    {
      var userEmail = user?.email ? user.email : "";
      var userFullName = user?.name ? user.name : "";
      var name: string = "";
      var lastName: string = "";
      var userFullNameArray = [""];
      if (userFullName.includes(" ")) {
        userFullNameArray = userFullName.split(" ");
        name = userFullNameArray[0] ? userFullNameArray[0] : "";
        lastName = userFullNameArray[1] ? userFullNameArray[1] : "";
      } else {
        name = user?.name ? user.name : "";
      }
      var admin = user?.admin ? user.admin : false;

      const datahd = await sendCredentials({
        variables: {
          email: userEmail,
          Name: name,
          LastName: lastName,
          type: admin,
        },
      });
      loginHelpdesk(
        user?.email ? user.email : "",
        JSON.stringify(datahd.data?.sendCredentials),
        admin
      );
    }
  };
  const GrupedMode: FC = memo(() => {
    const groupedActive = useGroupedActive();
    return (
      <Button2
        cursor="pointer"
        colorScheme="blue"
        mr={3}
        onClick={async (ev) => {
          setGroupedActive(!groupedActive);
          setTrackingData({ student: undefined });
          if (program) {
            ev.preventDefault();
            onSearch({
              student_id: "",
              program_id: program.value,
            });
          }
        }}
      >
        {groupedActive ? GROUPED_ON : GROUPED_OFF}
      </Button2>
    );
  });

  const SendCredentialsToHelpdesk: FC = () => {
    return (
      <Button
        color="purple"
        size="medium"
        //css={marginLeft5px}
        icon
        loading={loadingSendCredentials}
        disable={loadingSendCredentials}
        labelPosition="left"
        onClick={() => callLoginHelpdesk()}
      >
        <Icon name="help circle" />
        {HELP_DESK_LABEL}
      </Button>
    );
  };

  useEffect(() => {
    DashboardInputActions.setChosenCurriculum("");
    DashboardInputActions.setChosenAdmissionType("");
    DashboardInputActions.setChosenCohort("");
  }, [groupedActive]);

  useEffect(() => {
    if (
      (chosenCurriculum === undefined &&
        (searchResult?.curriculums.length ?? 0) > 0) ||
      !searchResult?.curriculums.includes(chosenCurriculum ?? "")
    ) {
      DashboardInputActions.setChosenCurriculum(
        searchResult?.curriculums.sort().slice()[0]
      );
    }
  }, [chosenCurriculum, searchResult?.curriculums]);

  const [showGroupedDownloadBotton, setshowGroupedDownloadBotton] = useState(
    false
  );

  useEffect(() => {
    if (searchResult?.admission_types.length) {
      setshowGroupedDownloadBotton(true);
    } else {
      setshowGroupedDownloadBotton(false);
    }
  }, [searchResult, showGroupedDownloadBotton]);

  useEffect(() => {
    if (
      (chosenAdmissionType === undefined &&
        (searchResult?.admission_types.length ?? 0) > 0) ||
      !searchResult?.admission_types.includes(chosenAdmissionType ?? "")
    ) {
      DashboardInputActions.setChosenAdmissionType(
        searchResult?.admission_types.sort().slice()[0]
      );
    }
  }, [chosenAdmissionType, searchResult?.admission_types]);

  useEffect(() => {
    if (
      (chosenCohort === undefined && (searchResult?.cohorts.length ?? 0) > 0) ||
      !searchResult?.cohorts.includes(chosenCohort ?? "")
    ) {
      DashboardInputActions.setChosenCohort(
        searchResult?.cohorts.sort().slice()[0]
      );
    }
  }, [chosenCohort, searchResult?.cohorts]);

  useEffect(() => {
    setGroupedActive(false);
    setMock(false);
  }, []);

  const isDirector = user?.type === UserType.Director;

  const {
    LOGOUT_BUTTON_LABEL,
    SEARCH_BAR_BACKGROUND_COLOR,
    SEARCH_BUTTON_LABEL,
    NO_CURRICULUMS_LABEL,
    PROGRAM_NOT_SPECIFIED_PLACEHOLDER,
    CURRICULUM_LABEL,
    ADMISSION_TYPE_LABEL,
    COHORT_LABEL,
    STUDENT_LABEL,
    PLACEHOLDER_SEARCH_STUDENT,
    LOGOUT_CONFIRMATION_LABEL,
    HELP_ENABLED,
    GROUPED_ON,
    GROUPED_OFF,
    SHOW_PARAMETER,
    HELP_DESK_LABEL,
    HELPDESK_BUTTON_ENABLED,
  } = useContext(ConfigContext);

  const {
    data: myProgramsData,
    loading: myProgramsLoading,
  } = useMyProgramsQuery({
    ssr: false,
    skip: !isDirector,
  });

  const [student_id, setStudentId] = useRememberState<string>(
    "student_input",
    ""
  );

  const [studentOptions, setStudentOptions] = useRememberState<
    Record<string, string[] | undefined>
  >("student_input_program_options", {});

  const programsOptions = useMemo(() => {
    return (
      myProgramsData?.myPrograms.map(({ id, name }) => ({
        label: `${id} - ${name}`,
        value: id,
      })) ?? []
    );
  }, [myProgramsLoading, myProgramsData]);

  const [program, setProgram] = useRememberState<
    $ElementType<typeof programsOptions, number> | undefined
  >("program_input", undefined);

  const addStudentOption = useCallback(
    (value: string) => {
      if (!value || !program) return;

      let studentIdList = studentOptions[program.value];

      if (studentIdList === undefined) studentIdList = [];

      studentIdList = uniq(studentIdList.concat(value));

      setStudentOptions((prevStudentOptions) => {
        return {
          ...prevStudentOptions,
          [program.value]: studentIdList,
        };
      });
    },
    [studentOptions, setStudentOptions, program]
  );

  useEffect(() => {
    if (student_id.trim() !== student_id) {
      setStudentId((student) => student.trim());
    }
  }, [student_id, setStudentId]);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [studentIdShow, setStudentIdShow] = useState("");

  useEffect(() => {
    if (
      myProgramsData?.myPrograms &&
      programsOptions.findIndex((programFound) => {
        return programFound.value === program?.value;
      }) === -1
    ) {
      setProgram(programsOptions[0]);
    }
  }, [program, setProgram, programsOptions, myProgramsData]);

  const apolloClient = useApolloClient();

  const rightSide = useMemo(() => {
    return (
      <Flex
        wrap="wrap"
        justifyContent="flex-end"
        alignItems="center"
        className="stack"
      >
        {isDirector && user?.config?.SHOW_GROUPED_VIEW && <GrupedMode />}

        {user?.admin && <MockingMode />}
        {(student_id || (groupedActive && showGroupedDownloadBotton)) &&
          user?.config?.SHOW_DOWNLOAD && <DownloadWord />}
        {/*groupedActive &&
          showGroupedDownloadBotton &&
          user?.config?.SHOW_DOWNLOAD && <DownloadWord />*/}
        {isDirector && !groupedActive && user?.config?.SHOW_STUDENT_LIST && (
          <StudentList
            program_id={program?.value}
            mockData={
              mock
                ? range(160).map(() => {
                    const dropout_probability = Math.round(Math.random() * 100);
                    return {
                      student_id: "mock_" + generate(),
                      dropout_probability,
                      start_year: 2005 + Math.round(Math.random() * 14),
                      progress: Math.round(Math.random() * 100),
                      explanation: `se estima que el ${dropout_probability}% de todos los estudiantes tienen más riesgo de abandono que el estudiante en análisis`,
                    };
                  })
                : undefined
            }
            searchStudent={async (student_id: string) => {
              if (program) {
                setStudentId(student_id);
                const onSearchResult = await onSearch({
                  student_id,
                  program_id: program?.value,
                });
                switch (onSearchResult) {
                  case "student": {
                    addStudentOption(student_id);
                    setStudentId("");
                    setStudentIdShow(student_id);
                    track({
                      action: "click",
                      effect: "load-student",
                      target: "student-list-row",
                    });
                    break;
                  }

                  default: {
                    setStudentIdShow("");
                    setTrackingData({
                      student: student_id,
                    });
                    track({
                      action: "click",
                      effect: "wrong-student",
                      target: "student-list-row",
                    });
                  }
                }
              }
            }}
          />
        )}
        {HELP_ENABLED && <Help />}
        {isDirector && SHOW_PARAMETER && <Parameter mockIsActive={mock} />}
        {HELPDESK_BUTTON_ENABLED && <SendCredentialsToHelpdesk />}
        <Button
          css={marginLeft5px}
          negative
          size="medium"
          disabled={logoutLoading}
          loading={logoutLoading}
          onClick={async () => {
            const confirmed = window.confirm(LOGOUT_CONFIRMATION_LABEL);
            if (!confirmed) return;

            setLogoutLoading(true);

            apolloClient.clearStore().catch(console.error);

            track({
              action: "click",
              effect: "logout",
              target: "logoutButton",
            });
            setTimeout(() => {
              Router.push("/logout");
            }, 1000);
          }}
          icon
          labelPosition="left"
        >
          <Icon name="power off" />
          {LOGOUT_BUTTON_LABEL}
        </Button>
      </Flex>
    );
  }, [
    user,
    isDirector,
    setLogoutLoading,
    track,
    LOGOUT_BUTTON_LABEL,
    addStudentOption,
    setStudentId,
    setStudentIdShow,
    setTrackingData,
    logoutLoading,
    program,
    mock,
    groupedActive,
    onSearch,
    HELP_ENABLED,
    showGroupedDownloadBotton,
  ]);

  useEffect(() => {
    setTrackingData({
      program_menu: program?.value,
    });
  }, [program, setTrackingData]);

  const programOptionsComponent = useMemo(() => {
    return (
      <>
        {isDirector && (
          <Box width={300} mr={4} fontSize="0.85em">
            <Select<{ value: string; label: string }>
              options={programsOptions}
              value={program || null}
              isLoading={isSearchLoading}
              isDisabled={isSearchLoading}
              placeholder={PROGRAM_NOT_SPECIFIED_PLACEHOLDER}
              classNamePrefix="react-select"
              onChange={async (selected: any) => {
                track({
                  action: "click",
                  effect: `change-program-menu-to-${selected?.value}`,
                  target: "program-menu",
                });
                setProgram(
                  selected as $ElementType<typeof programsOptions, number>
                );
                if (program && groupedActive) {
                  const onSearchResult = await onSearch({
                    student_id,
                    program_id: selected.value,
                  });

                  switch (onSearchResult) {
                    case "program": {
                      setTrackingData({
                        student: undefined,
                      });
                      setStudentIdShow("");
                      track({
                        action: "click",
                        effect: "load-program",
                        target: "search-button",
                      });
                      break;
                    }
                    default: {
                      setTrackingData({
                        student: student_id,
                      });
                      setStudentIdShow("");
                      track({
                        action: "click",
                        effect: "wrong-student",
                        target: "search-button",
                      });
                    }
                  }
                }
              }}
              css={{ color: "black" }}
            />
          </Box>
        )}
      </>
    );
  }, [
    programsOptions,
    program,
    isSearchLoading,
    track,
    setProgram,
    PROGRAM_NOT_SPECIFIED_PLACEHOLDER,
  ]);

  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      alignContent="flex-end"
      backgroundColor={SEARCH_BAR_BACKGROUND_COLOR}
      p={3}
      cursor="default"
      wrap="wrap"
    >
      <Flex wrap="wrap" alignItems="center">
        {programOptionsComponent}
        {isDirector && groupedActive && (
          <Flex mr={5}>
            <Stack>
              <Tag minHeight="2.5rem" colorScheme="blue" variant="outline">
                {CURRICULUM_LABEL}
              </Tag>
              <Tag minHeight="2.5rem" colorScheme="blue" variant="outline">
                {COHORT_LABEL}
              </Tag>
              <Tag minHeight="2.5rem" colorScheme="blue" variant="outline">
                {ADMISSION_TYPE_LABEL}
              </Tag>
            </Stack>
            <Box width={150} ml={2}>
              <Select
                id="chosenCurriculumComponent"
                options={
                  searchResult?.curriculums
                    .sort()
                    .slice()
                    .reverse()
                    .map((curriculum) => {
                      if (curriculum == "") {
                        return {
                          label: "Todos",
                          value: curriculum,
                        };
                      } else {
                        return {
                          label: curriculum,
                          value: curriculum,
                        };
                      }
                    }) ?? []
                }
                value={
                  chosenCurriculum != undefined
                    ? chosenCurriculum
                      ? {
                          value: chosenCurriculum,
                          label: chosenCurriculum,
                        }
                      : {
                          value: chosenCurriculum,
                          label: "Todos",
                        }
                    : undefined
                }
                onChange={(selected) => {
                  track({
                    action: "click",
                    target: "curriculum-menu",
                    effect: "change-curriculum",
                  });
                  DashboardInputActions.setChosenCurriculum(
                    (selected as { label: string; value: string }).value
                  );
                }}
                placeholder="..."
                noOptionsMessage={() => NO_CURRICULUMS_LABEL}
                css={{ color: "black" }}
              />
              <Select
                id="chosenCohortComponent"
                options={
                  searchResult?.cohorts
                    .sort()
                    .slice()
                    .reverse()
                    .map((cohort) => {
                      if (cohort == "") {
                        return {
                          label: "Todos",
                          value: cohort,
                        };
                      } else {
                        return {
                          label: cohort,
                          value: cohort,
                        };
                      }
                    }) ?? []
                }
                value={
                  chosenCohort != undefined
                    ? chosenCohort
                      ? {
                          value: chosenCohort,
                          label: chosenCohort,
                        }
                      : {
                          value: chosenCohort,
                          label: "Todos",
                        }
                    : undefined
                }
                onChange={(selected) => {
                  track({
                    action: "click",
                    target: "cohort-menu",
                    effect: "change-cohort",
                  });
                  DashboardInputActions.setChosenCohort(
                    (selected as { label: string; value: string }).value
                  );
                }}
                placeholder={"..."}
                css={{ color: "black" }}
              />
              <Select
                id="chosenAdmissionTypeComponent"
                options={
                  searchResult?.admission_types
                    .sort()
                    .slice()
                    .reverse()
                    .map((admission_type) => {
                      if (admission_type == "") {
                        return {
                          label: "Todos",
                          value: admission_type,
                        };
                      } else {
                        return {
                          label: admission_type,
                          value: admission_type,
                        };
                      }
                    }) ?? []
                }
                value={
                  chosenAdmissionType != undefined
                    ? chosenAdmissionType
                      ? {
                          value: chosenAdmissionType,
                          label: chosenAdmissionType,
                        }
                      : {
                          value: chosenAdmissionType,
                          label: "Todos",
                        }
                    : undefined
                }
                onChange={(selected) => {
                  track({
                    action: "click",
                    target: "admission-menu",
                    effect: "change-admission",
                  });
                  DashboardInputActions.setChosenAdmissionType(
                    (selected as { label: string; value: string }).value
                  );
                }}
                placeholder={"..."}
                css={{ color: "black" }}
              />
            </Box>
          </Flex>
        )}
        {searchResult?.student && (
          <Tag
            cursor="text"
            mt={1}
            mb={1}
            mr={2}
            p={3}
            maxW="300px"
            textAlign="center"
          >{`${STUDENT_LABEL}: ${studentIdShow || searchResult?.student}`}</Tag>
        )}

        {isDirector && !groupedActive && (
          <form>
            <Flex wrap="wrap" alignItems="center">
              <InputGroup size="lg" width="fit-content" mt={2} mb={2}>
                <Input
                  color="black"
                  bg="white"
                  borderColor="gray.400"
                  fontFamily="Lato"
                  variant="outline"
                  fontSize="1em"
                  width={Math.min(
                    // Width should maximum 300 for mobile
                    Math.max(
                      // Width has to be at least 160 for the placeholder text
                      pixelWidth(student_id ?? "", { size: 21 }),
                      160
                    ),
                    300
                  )}
                  list="student_options"
                  placeholder={PLACEHOLDER_SEARCH_STUDENT}
                  value={student_id}
                  onChange={({
                    target: { value },
                  }: ChangeEvent<HTMLInputElement>) => {
                    setStudentId(value);
                  }}
                  mr={4}
                  isDisabled={isSearchLoading}
                />
                {program && studentOptions[program.value] && (
                  <datalist id="student_options">
                    {studentOptions[program.value]?.map((value, key) => (
                      <option key={key} value={value} />
                    ))}
                  </datalist>
                )}

                {student_id !== "" && (
                  <InputRightElement
                    mr={1}
                    cursor="pointer"
                    onClick={() => {
                      setStudentId("");
                    }}
                  >
                    <Icon color="grey" name="close" />
                  </InputRightElement>
                )}
              </InputGroup>

              <Button
                icon
                labelPosition="left"
                primary
                loading={isSearchLoading}
                type="submit"
                disabled={isSearchLoading || !program?.value}
                onClick={async (ev) => {
                  if (program) {
                    ev.preventDefault();
                    const onSearchResult = await onSearch({
                      student_id,
                      program_id: program.value,
                    });

                    switch (onSearchResult) {
                      case "student": {
                        addStudentOption(student_id);
                        setStudentIdShow(student_id);
                        setStudentId("");
                        track({
                          action: "click",
                          effect: "load-student",
                          target: "search-button",
                        });
                        break;
                      }
                      case "program": {
                        setTrackingData({
                          student: undefined,
                        });

                        setStudentIdShow("");
                        track({
                          action: "click",
                          effect: "load-program",
                          target: "search-button",
                        });

                        break;
                      }
                      default: {
                        setTrackingData({
                          student: student_id,
                        });
                        setStudentIdShow("");
                        track({
                          action: "click",
                          effect: "wrong-student",
                          target: "search-button",
                        });
                      }
                    }
                  }
                }}
                size="medium"
              >
                <Icon name="search" />
                {SEARCH_BUTTON_LABEL}
              </Button>

              <AnimatePresence>
                {!isSearchLoading && error && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert
                      key="error"
                      status="error"
                      borderRadius={4}
                      whiteSpace="pre-wrap"
                      mt={5}
                      mb={5}
                      maxWidth="40vw"
                    >
                      <AlertIcon />
                      <AlertTitle mr={2}>{error}</AlertTitle>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </Flex>
          </form>
        )}
      </Flex>

      {rightSide}
    </Flex>
  );
});
