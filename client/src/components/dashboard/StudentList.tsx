import { chunk, some, sortBy, toInteger, truncate, uniq } from "lodash";
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Component,
} from "react";
import { FaChevronLeft, FaChevronRight, FaListOl } from "react-icons/fa";
import { useUpdateEffect } from "react-use";
import { Pagination, Progress, Table, TableCell } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import {
  Center,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { Divider, Tab } from "semantic-ui-react";

import { IS_DEVELOPMENT } from "../../../constants";
import { ConfigContext } from "../../context/Config";
import { track } from "../../context/Tracking";
import { useStudentsListQuery, useRiskNoticationQuery } from "../../graphql";
import { marginZero, textAlignCenter } from "../../utils/cssConstants";
import { useUser } from "../../utils/useUser";

const progressTextShadow = css`
  .progress {
    text-shadow: 1px 0.5px 1px black !important;
  }
`;

const progressSmallText = css`
  .progress {
    font-size: 10px !important;
  }
`;

const nStudentPerChunk = 25; // normally 25

const initialOpen = (() => {
  if (IS_DEVELOPMENT && typeof window !== "undefined") {
    return !!localStorage.getItem("student_list_open");
  }

  return false;
})();

export type columnNames = keyof RiskInfo;

export type StudentListInfo = {
  student_id: string;
  dropout_probability: number;
  start_year: number;
  explanation: string;
  progress: number;
};

export type RiskInfo = {
  student_id: string;
  dropout_probability: number;
  start_year: number;
  explanation: string;
  progress: number;
  course_id: string;
  rate: number;
  year: string;
  term: string;
};
export const StudentList: FC<{
  mockData?: StudentListInfo[];
  program_id?: string;
  searchStudent: (student: string) => Promise<void>;
}> = ({ mockData, program_id, searchStudent }) => {
  const { data: dataStudentList, loading: loadingData } = useStudentsListQuery({
    variables: {
      program_id: program_id || "",
    },
    skip: !program_id,
  });

  const { data: studentPendingOfGraduation } = useRiskNoticationQuery({
    variables: {
      program_id: program_id || "",
      risk_type: "student_pending_of_graduation",
    },
  });
  const { data: lowProgressingRate } = useRiskNoticationQuery({
    variables: {
      program_id: program_id || "",
      risk_type: "low_progressing_rate",
    },
  });
  const { data: thirdAttempt } = useRiskNoticationQuery({
    variables: {
      program_id: program_id || "",
      risk_type: "third_attempt",
    },
  });
  const { data: lowPassingRateCourses } = useRiskNoticationQuery({
    variables: {
      program_id: program_id || "",
      risk_type: "low_passing_rate_courses",
    },
  });
  const { data: highDropRate } = useRiskNoticationQuery({
    variables: {
      program_id: program_id || "",
      risk_type: "high_drop_rate",
    },
  });

  const {
    STUDENT_LIST_TITLE,
    RISK_HIGH_COLOR,
    RISK_HIGH_THRESHOLD,
    RISK_MEDIUM_COLOR,
    RISK_MEDIUM_THRESHOLD,
    RISK_LOW_COLOR,
    CHECK_STUDENT_FROM_LIST_LABEL,
    NO_INFORMATION_TO_DEPLOY,
    RISK_BY_COURSES_LABEL,
    RISK_BY_STUDENTS_LABEL,
    RISK_ALL,
    RISK_ALL_TOOLTIP,
    RISK_STUDENT_PENDING_OF_GRADUATION,
    RISK_STUDENT_PENDING_OF_GRADUATION_TOOLTIP,
    RISK_LOW_PASSING_RATE_COURSES,
    RISK_LOW_PASSING_RATE_COURSES_TOOLTIP,
    RISK_LOW_PROGRESSING_RATE,
    RISK_LOW_PROGRESSING_RATE_TOOLTIP,
    RISK_THIRD_ATTEMPT,
    RISK_THIRD_ATTEMPT_TOOLTIP,
    RISK_HIGH_DROP_RATE,
    RISK_HIGH_DROP_RATE_TOOTLTIP,
    COURSE_LABEL,
    YEAR_LABEL,
    TERM_LABEL,
    RATE_LABEL,
  } = useContext(ConfigContext);

  var [riskType, setRiskType] = useRememberState(
    "risk_type_selected",
    RISK_ALL
  );

  var [riskTypeTooltip, setRiskTypeTooltip] = useRememberState(
    "risk_tooltip_selected",
    ""
  );

  var [courseRisk, setCourseRisk] = useRememberState(
    "course_risk_selected",
    false
  );
  const studentListData = useMemo(() => {
    switch (riskType) {
      case RISK_ALL:
        setRiskTypeTooltip(RISK_ALL_TOOLTIP);
        return (
          dataStudentList?.students.map(
            ({ id, start_year, progress, dropout, name }) => {
              return {
                student_id: id,
                student_rut: name,
                dropout_probability: dropout?.prob_dropout ?? -1,
                progress: progress * 100,
                start_year,
                explanation: dropout?.explanation ?? "",
                course_id: "",
                rate: 0,
                year: "",
                term: "",
              };
            }
          ) ?? []
        );
      case RISK_STUDENT_PENDING_OF_GRADUATION:
        setRiskTypeTooltip(RISK_STUDENT_PENDING_OF_GRADUATION_TOOLTIP);
        return (
          studentPendingOfGraduation?.riskNotification.map(
            ({ student_id, cohort, risk_type, details }) => {
              let cDetails = details ? JSON.parse(details) : {};
              let rut: string = details.length > 0 ? cDetails.rut : ""; //warnning with risk data
              return {
                student_id: student_id,
                student_rut: rut,
                dropout_probability: -1,
                progress: -1,
                start_year: parseInt(cohort),
                explanation: risk_type,
                course_id: "",
                rate: 0,
                year: "",
                term: "",
              };
            }
          ) ?? []
        );
      case RISK_LOW_PROGRESSING_RATE:
        setRiskTypeTooltip(RISK_LOW_PROGRESSING_RATE_TOOLTIP);
        return (
          lowProgressingRate?.riskNotification.map(
            ({ student_id, cohort, risk_type, details }) => {
              let cDetails = details ? JSON.parse(details) : {};
              let rut: string = details.length > 0 ? cDetails.rut : ""; //warnning with risk data
              return {
                student_id: student_id,
                student_rut: rut,
                dropout_probability: -1,
                progress: -1,
                start_year: parseInt(cohort),
                explanation: risk_type,
                course_id: "",
                rate: 0,
                year: "",
                term: "",
              };
            }
          ) ?? []
        );

      case RISK_THIRD_ATTEMPT:
        setRiskTypeTooltip(RISK_THIRD_ATTEMPT_TOOLTIP);
        return (
          thirdAttempt?.riskNotification.map(
            ({ student_id, course_id, cohort, risk_type, details }) => {
              let auxArray = "[ " + details + " ]";
              let parseDetails = JSON.parse(auxArray);
              let details2 = parseDetails[0] || "";
              let rut: string = details2.rut ? details2.rut : ""; // big Warning details: comment this 4 linmnes and put "" in student_rut
              return {
                student_id: student_id,
                student_rut: rut,
                dropout_probability: -1,
                progress: -1,
                start_year: parseInt(cohort),
                explanation: risk_type,
                course_id: course_id,
                rate: 0,
                year: "",
                term: "",
              };
            }
          ) ?? []
        );

      case RISK_LOW_PASSING_RATE_COURSES:
        setRiskTypeTooltip(RISK_LOW_PASSING_RATE_COURSES_TOOLTIP);
        return (
          lowPassingRateCourses?.riskNotification.map(
            ({ course_id, cohort, risk_type, details }) => {
              let cDetails = details ? JSON.parse(details) : {};
              let yearTerm = cDetails?.semester ? cDetails.semester : "";
              let year = yearTerm.length ? yearTerm.substring(0, 4) : "";
              let term = yearTerm.length ? yearTerm.substring(4, 5) : "";
              return {
                student_id: "-1",
                student_rut: "",
                dropout_probability: -1,
                progress: -1,
                start_year: parseInt(cohort),
                explanation: risk_type,
                course_id: course_id,
                rate: cDetails.failing_rate,
                year: year,
                term: term,
              };
            }
          ) ?? []
        );
      case RISK_HIGH_DROP_RATE:
        setRiskTypeTooltip(RISK_HIGH_DROP_RATE_TOOTLTIP);
        return (
          highDropRate?.riskNotification.map(
            ({ course_id, cohort, risk_type, details }) => {
              let cDetails = details ? JSON.parse(details) : {};
              let yearTerm = cDetails?.semester ? cDetails.semester : "";
              let year = yearTerm.length ? yearTerm.substring(0, 4) : "";
              let term = yearTerm.length ? yearTerm.substring(4, 5) : "";
              return {
                student_id: "-1",
                student_rut: "",
                dropout_probability: -1,
                progress: -1,
                start_year: parseInt(cohort),
                explanation: risk_type,
                course_id: course_id,
                rate: cDetails.droping_rate,
                year: year,
                term: term,
              };
            }
          ) ?? []
        );

      default:
      //console.log('.');
    }
  }, [
    dataStudentList,
    studentPendingOfGraduation,
    mockData,
    riskType,
    program_id,
    courseRisk,
  ]);

  const { user } = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: initialOpen,
  });

  useUpdateEffect(() => {
    track({
      action: "click",
      effect: isOpen ? "open-student-list" : "close-student-list",
      target: isOpen ? "student-list-button" : "outside-student-list",
    });
  }, [isOpen]);

  if (IS_DEVELOPMENT) {
    useUpdateEffect(() => {
      if (isOpen) {
        localStorage.setItem("student_list_open", "1");
      } else {
        localStorage.removeItem("student_list_open");
      }
    }, [isOpen]);
  }

  const btnRef = useRef<HTMLButtonElement>(null);

  const [columnSort, setColumnSort] = useRememberState<columnNames[]>(
    "student_list_columns_sort",
    ["student_id", "start_year", "dropout_probability", "dropout_probability"]
  );

  const [directionSort, setDirectionSort] = useRememberState<
    "ascending" | "descending" | undefined
  >("student_list_direction_sort", undefined);

  const [sortedStudentList, setSortedStudentList] = useState(() =>
    sortBy(studentListData, columnSort)
  );

  useEffect(() => {
    const newSortedStudentList = sortBy(studentListData, columnSort);
    if (directionSort === "descending") {
      newSortedStudentList.reverse();
    }
    setSortedStudentList(newSortedStudentList);
  }, [studentListData, directionSort, columnSort, setSortedStudentList]);

  const [pageSelected, setPageSelected] = useRememberState(
    "student_list_page_selected",
    1
  );

  useUpdateEffect(() => {
    track({
      action: "click",
      target: "student-list-header-sort",
      effect: `sort-student-list-by-${columnSort.join("|")}-${directionSort}`,
    });
  }, [directionSort, columnSort]);

  const [studentListChunks, setStudentListChunks] = useState(() =>
    chunk(sortedStudentList, nStudentPerChunk)
  );

  useEffect(() => {
    if (pageSelected > studentListChunks.length) {
      setPageSelected(1);
    }
  }, [studentListChunks, pageSelected, riskType, courseRisk]);

  useEffect(() => {
    setStudentListChunks(chunk(sortedStudentList, nStudentPerChunk));
  }, [sortedStudentList, setStudentListChunks, riskType, courseRisk]);

  const showDropout = useMemo(() => {
    return (
      !!user?.config?.SHOW_DROPOUT &&
      some(studentListData, ({ dropout_probability }) => {
        return (dropout_probability ?? -1) !== -1;
      })
    );
  }, [user, studentListData]);

  const handleSort = useCallback(
    (clickedColumn: columnNames) => () => {
      if (columnSort[0] !== clickedColumn) {
        setColumnSort((columnSortList) =>
          uniq([clickedColumn, ...columnSortList])
        );
        setDirectionSort("ascending");
      } else {
        setDirectionSort(
          directionSort === "ascending" ? "descending" : "ascending"
        );
      }
    },
    [columnSort, directionSort]
  );

  const selectedStudents = useMemo(() => {
    return studentListChunks[pageSelected - 1];
  }, [studentListChunks, pageSelected, riskType, courseRisk]);

  useEffect(() => {
    if (courseRisk) {
      setRiskType(RISK_ALL);
    } else {
      setRiskType(RISK_LOW_PASSING_RATE_COURSES);
    }
  }, [courseRisk]);

  const panes = [
    {
      menuItem: RISK_BY_STUDENTS_LABEL,
      render: () => <></>,
      tabIndex: 0,
    },
    {
      menuItem: RISK_BY_COURSES_LABEL,
      render: () => <></>,
      tabIndex: 1,
    },
  ];

  var [indexTab, setIndexTab] = useRememberState("index_Tab_selected", 1);
  class TabExampleColoredInverted extends Component {
    render() {
      return (
        <div>
          <Divider hidden />
          <Tab
            activeIndex={indexTab}
            menu={{ inverted: false, attached: true, tabular: false }}
            panes={panes}
            onTabChange={(e, data) => {
              let auxIndx = data?.activeIndex ?? 0;
              let auxIndx2 = parseInt("" + auxIndx);
              if (auxIndx2) {
                setCourseRisk(false);
                setIndexTab(auxIndx2);
              } else {
                setCourseRisk(true);
                setIndexTab(auxIndx2);
              }
            }}
          />
        </div>
      );
    }
  }

  const TableHeader: FC<{
    columnSort: columnNames[];
    directionSort: "ascending" | "descending" | undefined;
    handleSort: (clickedColumn: columnNames) => () => void;
    showDropout: boolean;
  }> = memo(({ columnSort, directionSort, handleSort, showDropout }) => {
    const {
      STUDENT_LABEL,
      ENTRY_YEAR_LABEL,
      PROGRESS_LABEL,
      RISK_LABEL,
    } = useContext(ConfigContext);

    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={2} />
          {courseRisk && (
            <>
              <Table.HeaderCell
                width={4}
                sorted={
                  columnSort[0] === "student_id" ? directionSort : undefined
                }
                onClick={handleSort("student_id")}
              >
                {STUDENT_LABEL}
              </Table.HeaderCell>
              <Table.HeaderCell
                width={2}
                sorted={
                  columnSort[0] === "start_year" ? directionSort : undefined
                }
                onClick={handleSort("start_year")}
              >
                {ENTRY_YEAR_LABEL}
              </Table.HeaderCell>
              {riskType === RISK_ALL && (
                <Table.HeaderCell
                  width={5}
                  sorted={
                    columnSort[0] === "progress" ? directionSort : undefined
                  }
                  onClick={handleSort("progress")}
                >
                  {PROGRESS_LABEL}
                </Table.HeaderCell>
              )}
              {showDropout && (
                <Table.HeaderCell
                  sorted={
                    columnSort[0] === "dropout_probability"
                      ? directionSort
                      : undefined
                  }
                  onClick={handleSort("dropout_probability")}
                  width={4}
                >
                  {RISK_LABEL}
                </Table.HeaderCell>
              )}
            </>
          )}
          {!courseRisk && (
            <>
              <Table.HeaderCell
                width={3}
                sorted={
                  columnSort[0] === "course_id" ? directionSort : undefined
                }
                onClick={handleSort("course_id")}
              >
                {COURSE_LABEL}
              </Table.HeaderCell>

              <Table.HeaderCell
                width={2}
                sorted={columnSort[0] === "year" ? directionSort : undefined}
                onClick={handleSort("year")}
              >
                {YEAR_LABEL}
              </Table.HeaderCell>
              <Table.HeaderCell
                width={2}
                sorted={columnSort[0] === "term" ? directionSort : undefined}
                onClick={handleSort("term")}
              >
                {TERM_LABEL}
              </Table.HeaderCell>
              <Table.HeaderCell
                width={5}
                sorted={columnSort[0] === "rate" ? directionSort : undefined}
                onClick={handleSort("rate")}
              >
                {RATE_LABEL}
              </Table.HeaderCell>
            </>
          )}
        </Table.Row>
      </Table.Header>
    );
  });

  return (
    <>
      <Button
        isLoading={loadingData}
        m={2}
        ref={btnRef}
        colorScheme="blue"
        onClick={onOpen}
        cursor="pointer"
        leftIcon={<FaListOl />}
        fontFamily="Lato"
      >
        {STUDENT_LIST_TITLE}
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xl"
        scrollBehavior="inside"
        preserveScrollBarGap={false}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton shadow="md" borderWidth="1px" borderRadius="5px" />
          <DrawerHeader height={20} display="flex" alignItems="center">
            {STUDENT_LIST_TITLE} {loadingData && <Spinner ml={3} />}
          </DrawerHeader>
          <TabExampleColoredInverted />

          <br />
          <Box>
            <Tooltip hasArrow label={riskTypeTooltip}>
              <Select
                value={riskType}
                onChange={(e) => setRiskType(e.currentTarget.value)}
                pl={6}
                height="2.5rem"
                width="25%"
                position="absolute"
                size="lg"
                color="Black"
                bg="white"
              >
                {courseRisk && (
                  <>
                    <option value={RISK_ALL}>{RISK_ALL}</option>
                    <option value={RISK_STUDENT_PENDING_OF_GRADUATION}>
                      {RISK_STUDENT_PENDING_OF_GRADUATION}
                    </option>
                    <option value={RISK_LOW_PROGRESSING_RATE}>
                      {RISK_LOW_PROGRESSING_RATE}
                    </option>
                    <option value={RISK_THIRD_ATTEMPT}>
                      {RISK_THIRD_ATTEMPT}
                    </option>
                  </>
                )}
                {!courseRisk && (
                  <>
                    <option value={RISK_LOW_PASSING_RATE_COURSES}>
                      {RISK_LOW_PASSING_RATE_COURSES}
                    </option>
                    <option value={RISK_HIGH_DROP_RATE}>
                      {RISK_HIGH_DROP_RATE}
                    </option>
                  </>
                )}
              </Select>
            </Tooltip>

            <Center>
              <Pagination
                css={[textAlignCenter, { alignSelf: "center" }]}
                totalPages={studentListChunks.length}
                activePage={pageSelected}
                boundaryRange={1}
                size="mini"
                onPageChange={(_, { activePage }) => {
                  track({
                    action: "click",
                    target: `student-list-pagination`,
                    effect: `set-student-list-page-to-${activePage}`,
                  });
                  setPageSelected(toInteger(activePage));
                }}
              />
            </Center>
          </Box>
          <DrawerBody>
            <Table sortable celled fixed>
              <TableHeader
                columnSort={columnSort}
                directionSort={directionSort}
                handleSort={handleSort}
                showDropout={showDropout}
              />
              <Table.Body>
                {!selectedStudents?.length && (
                  <>
                    <Table.Row>
                      <TableCell />
                      <Table.Cell>
                        <Text>{NO_INFORMATION_TO_DEPLOY}</Text>
                      </Table.Cell>
                      <TableCell />
                      {!courseRisk && (
                        <>
                          <TableCell />
                          <TableCell />
                        </>
                      )}
                    </Table.Row>
                  </>
                )}
                {selectedStudents?.length &&
                  selectedStudents?.map(
                    (
                      {
                        student_id,
                        student_rut,
                        dropout_probability,
                        start_year,
                        progress,
                        explanation,
                        course_id,
                        rate,
                        year,
                        term,
                      },
                      key
                    ) => {
                      let color: string;
                      if (dropout_probability > RISK_HIGH_THRESHOLD) {
                        color = RISK_HIGH_COLOR;
                      } else if (dropout_probability > RISK_MEDIUM_THRESHOLD) {
                        color = RISK_MEDIUM_COLOR;
                      } else {
                        color = RISK_LOW_COLOR;
                      }
                      const integerProgress = toInteger(progress);
                      const integerRate = toInteger(rate);
                      const checkStudentLabel = `${CHECK_STUDENT_FROM_LIST_LABEL} ${student_id}`;
                      return (
                        <Table.Row key={key} verticalAlign="middle">
                          <TableCell textAlign="center">
                            {1 + key + (pageSelected - 1) * nStudentPerChunk}
                          </TableCell>
                          {courseRisk && (
                            <>
                              <Table.Cell
                                className="cursorPointer"
                                onClick={() => {
                                  searchStudent(student_id);
                                  onClose();
                                }}
                              >
                                <Tooltip
                                  aria-label={checkStudentLabel}
                                  label={checkStudentLabel}
                                  zIndex={10000}
                                  placement="top"
                                  textAlign="center"
                                >
                                  <Text>
                                    {truncate(student_rut || student_id, {
                                      length: 35,
                                    })}
                                  </Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell>
                                <Text>{start_year}</Text>
                              </Table.Cell>
                              {riskType === RISK_ALL && (
                                <Table.Cell verticalAlign="middle">
                                  <Progress
                                    css={[
                                      marginZero,
                                      progressTextShadow,
                                      integerProgress >= 10 &&
                                        integerProgress < 20 &&
                                        progressSmallText,
                                    ]}
                                    progress
                                    percent={integerProgress}
                                  />
                                </Table.Cell>
                              )}
                              {showDropout && (
                                <Table.Cell>
                                  <Stack
                                    isInline
                                    shouldWrapChildren
                                    alignItems="center"
                                  >
                                    <Text
                                      margin={0}
                                      textShadow="0.5px 0.5px 0px #a1a1a1"
                                      color={
                                        dropout_probability !== -1
                                          ? color
                                          : undefined
                                      }
                                      fontWeight="bold"
                                    >
                                      {dropout_probability !== -1
                                        ? `${toInteger(dropout_probability)}`
                                        : "-"}
                                    </Text>
                                    {explanation ? (
                                      <Popover trigger="hover" isLazy>
                                        <PopoverTrigger>
                                          <Icon
                                            display="flex"
                                            name="info-outline"
                                            size="13px"
                                            cursor="help"
                                          />
                                        </PopoverTrigger>
                                        <PopoverContent
                                          width="fit-content"
                                          zIndex={100}
                                          padding="5px"
                                        >
                                          <PopoverArrow />
                                          <PopoverBody>
                                            <Text>
                                              {explanation
                                                .charAt(0)
                                                .toUpperCase() +
                                                explanation.slice(1)}
                                            </Text>
                                          </PopoverBody>
                                        </PopoverContent>
                                      </Popover>
                                    ) : null}
                                  </Stack>
                                </Table.Cell>
                              )}
                            </>
                          )}
                          {!courseRisk && (
                            <>
                              <Table.Cell verticalAlign="middle">
                                <Tooltip
                                  zIndex={10000}
                                  placement="top"
                                  textAlign="center"
                                >
                                  <Text>
                                    {truncate(course_id, { length: 35 })}
                                  </Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell verticalAlign="middle">
                                <Tooltip
                                  zIndex={10000}
                                  placement="top"
                                  textAlign="center"
                                >
                                  <Text>{truncate(year, { length: 35 })}</Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell verticalAlign="middle">
                                <Tooltip
                                  zIndex={10000}
                                  placement="top"
                                  textAlign="center"
                                >
                                  <Text>{truncate(term, { length: 35 })}</Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell verticalAlign="middle">
                                <Progress
                                  css={[
                                    marginZero,
                                    progressTextShadow,
                                    integerProgress >= 10 &&
                                      integerProgress < 20 &&
                                      progressSmallText,
                                  ]}
                                  progress
                                  percent={integerRate}
                                />
                              </Table.Cell>
                            </>
                          )}
                        </Table.Row>
                      );
                    }
                  )}
              </Table.Body>
            </Table>
          </DrawerBody>
          <DrawerFooter justifyContent="flex-start">
            <Icon
              as={isOpen ? FaChevronRight : FaChevronLeft}
              size="35px"
              onClick={onClose}
              cursor="pointer"
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StudentList;
