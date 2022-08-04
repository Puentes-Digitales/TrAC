import { AnimatePresence, motion } from "framer-motion";
import { some, truncate } from "lodash";
import dynamic from "next/dynamic";
import React, { FC, memo, useContext, useMemo } from "react";

import {
  Badge,
  Box,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { StateCourse } from "../../../../constants";
import { ConfigContext } from "../../../context/Config";
import {
  CoursesDashboardStore,
  pairTermYear,
  toggleOpenCourse,
} from "../../../context/CoursesDashboard";
import {
  ForeplanActiveStore,
  ForeplanHelperStore,
} from "../../../context/ForeplanContext";
import { track } from "../../../context/Tracking";
import {
  TEXT_WHITE_SHADOW,
  width100percent,
} from "../../../utils/cssConstants";
import { useUser } from "../../../utils/useUser";
import { PredictState } from "../../foreplan/courseBox/PredictState";
import {
  HistogramHistoric,
  HistogramNow,
  HistogramsComponent,
} from "../Histogram";
import { HistoricalCirclesComponent } from "../HistoricalCirclesComponent";

import type {
  ICourse,
  ITakenCourse,
  ITakenSemester,
} from "../../../../../interfaces";
const ForeplanCourseCheckbox = dynamic(
  () => import("../../foreplan/courseBox/Checkbox")
);

const ForeplanCourseStats = dynamic(
  () => import("../../foreplan/courseBox/Stats")
);

export type CurrentTakenData = Partial<ITakenCourse>;

const useIsCourseFuturePlanificationFulfilled = ({
  state,
  code,
}: {
  state?: StateCourse;
  code: string;
}) => {
  const { user } = useUser({
    fetchPolicy: "cache-only",
  });
  const isForeplanActive = ForeplanActiveStore.hooks.useIsForeplanActive();
  const isPossibleToTakeForeplan = ForeplanActiveStore.hooks.useIsPossibleToTakeForeplan(
    { state, course: code },
    [state, code]
  );
  const isDirectTake = ForeplanHelperStore.hooks.useForeplanIsDirectTake(code);
  const isPredictedDirectTake = ForeplanActiveStore.hooks.useIsDirectTakePredicted(
    code
  );
  const isFutureCourseRequisitesFulfilled = ForeplanActiveStore.hooks.useForeplanIsFutureCourseRequisitesFulfilled(
    code
  );

  if (!user?.config.FOREPLAN_FUTURE_COURSE_PLANIFICATION) {
    return false;
  }

  if (!isForeplanActive) {
    return false;
  }

  if (isPossibleToTakeForeplan) {
    if (isDirectTake || isPredictedDirectTake) {
      return true;
    }
    if (isFutureCourseRequisitesFulfilled) {
      return true;
    }
  }

  return false;
};

const OuterCourseBox: FC<
  Pick<ICourse, "code" | "historicDistribution"> & {
    isOpen: boolean;
    borderColor: string;
    semestersTaken: ITakenSemester[];
  } & Pick<CurrentTakenData, "currentDistribution"> & {
      isFutureCourseFulfilled: boolean;
    }
> = memo(
  ({
    children,
    code,
    currentDistribution,
    historicDistribution,
    semestersTaken,
    borderColor,
    isOpen,
    isFutureCourseFulfilled,
  }) => {
    const config = useContext(ConfigContext);

    const activeCourse = CoursesDashboardStore.hooks.useActiveCourse(code);
    const explicitSemester = CoursesDashboardStore.hooks.useExplicitSemester();

    const isExplicitSemester = CoursesDashboardStore.hooks.useCheckExplicitSemester(
      semestersTaken
    );

    const opacity = useMemo(() => {
      if (activeCourse) {
        return 1;
      }
      if (explicitSemester) {
        if (isExplicitSemester) {
          return 1;
        }
        return 0.5;
      }
      return 1;
    }, [code, activeCourse, explicitSemester, isExplicitSemester]);

    const { height, width } = useMemo(() => {
      let height: number | undefined = undefined;
      let width: number | undefined = undefined;
      if (isOpen) {
        if (
          currentDistribution &&
          some(currentDistribution, ({ value }) => value)
        ) {
          width = 350;
          if (
            historicDistribution &&
            some(historicDistribution, ({ value }) => value)
          ) {
            height = 350;
          } else {
            height = 350 - 130;
          }
        } else if (
          historicDistribution &&
          some(historicDistribution, ({ value }) => value)
        ) {
          width = 350;
          height = 350 - 130;
        }
      } else {
        width = 180;
        height = 120;
      }
      if (!width) {
        width = 220;
      }
      if (!height) {
        height = 140;
      }

      return { height, width };
    }, [isOpen, historicDistribution, currentDistribution]);

    const borderWidth =
      activeCourse || isFutureCourseFulfilled
        ? config.COURSE_BOX_BORDER_WIDTH_ACTIVE
        : config.COURSE_BOX_BORDER_WIDTH_INACTIVE;

    const boxShadow = `0px 0px 0px ${borderWidth} ${borderColor}`;

    const color = useColorModeValue(config.COURSE_BOX_TEXT_COLOR, "white");
    return (
      <Flex
        m={1}
        color={color}
        width={width}
        height={height}
        borderRadius={5}
        opacity={opacity}
        boxShadow={boxShadow}
        transition={config.COURSE_BOX_ALL_TRANSITION_DURATION}
        className="unselectable courseBox"
        padding={0}
        overflow="hidden"
      >
        {children}
      </Flex>
    );
  }
);

const MainBlockOuter: FC<
  Pick<ICourse, "code" | "flow" | "requisites" | "taken"> & {
    semestersTaken: ITakenSemester[];
  }
> = memo(({ children, code, flow, requisites, taken, semestersTaken }) => {
  const config = useContext(ConfigContext);
  const bg = useColorModeValue(config.COURSE_BOX_BACKGROUND_COLOR, "#1A202C");
  return (
    <Flex
      w="100%"
      h="100%"
      pt={2}
      pl={2}
      pos="relative"
      className="mainBlock"
      cursor="pointer"
      borderRadius="5px 0px 0x 5px"
      bg={bg}
      onClick={() => {
        toggleOpenCourse(code, (wasOpen) => {
          if (!wasOpen) {
            CoursesDashboardStore.actions.addCourse({
              course: code,
              flow,
              requisites,
              semestersTaken,
            });
          } else {
            CoursesDashboardStore.actions.removeCourse(code);
          }

          track({
            action: "click",
            target: `course-box-${taken[0]?.equiv || code}`,
            effect: `${wasOpen ? "close" : "open"}-course-box`,
          });
        });
      }}
    >
      {children}
    </Flex>
  );
});

const NameComponent: FC<
  Pick<ICourse, "code" | "taken" | "name"> & {
    isOpen: boolean;
  } & Pick<CurrentTakenData, "parallelGroup">
> = memo(({ code, name, taken, parallelGroup, isOpen }) => {
  const config = useContext(ConfigContext);
  return (
    <Stack spacing={1}>
      <Flex alignItems="center">
        <Text m={0} whiteSpace="nowrap">
          <b>{taken?.find(({ equiv }) => equiv)?.equiv || code}</b>
        </Text>
        {!!parallelGroup && (
          <Badge
            ml={2}
            backgroundColor={config.PARALLEL_GROUP_BACKGROUND_COLOR}
            color={config.PARALLEL_GROUP_LABEL_COLOR}
          >
            {config.PARALLEL_GROUP_LABEL}: {parallelGroup}
          </Badge>
        )}
      </Flex>
      {taken?.find(({ equiv }) => equiv)?.equiv ? (
        <Text fontSize={9} m={0} whiteSpace="nowrap">
          <b>{config.EQUIVALENT_ELECTIVE + code}</b>
        </Text>
      ) : null}

      <Text fontSize={9} maxWidth="150px" pr={1}>
        {truncate(name, { length: isOpen ? 60 : 35 })}
      </Text>
    </Stack>
  );
});

const SecondaryBlockOuter: FC<
  Pick<ICourse, "taken" | "bandColors"> &
    Pick<CurrentTakenData, "grade" | "state"> & {
      borderColor: string;
    }
> = memo(({ children, taken, bandColors, borderColor, state, grade }) => {
  const config = useContext(ConfigContext);

  const { colorMode } = useColorMode();

  const stateColor = useMemo(() => {
    const bandColorsCourse = taken?.[0]?.bandColors ?? bandColors;

    switch (state) {
      case StateCourse.Passed: {
        const gradeToCompare = grade ?? config.MAX_GRADE;

        return (
          bandColorsCourse.find(({ min, max }) => {
            return gradeToCompare <= max && gradeToCompare >= min;
          })?.color ??
          bandColorsCourse[bandColorsCourse.length - 1]?.color ??
          config.STATE_COLOR_PASS_FALLBACK
        );
      }
      case StateCourse.Failed: {
        const gradeToCompare = grade ?? config.MIN_GRADE;
        return (
          bandColorsCourse.find(({ min, max }) => {
            return gradeToCompare <= max && gradeToCompare >= min;
          })?.color ??
          bandColorsCourse[0]?.color ??
          config.STATE_COLOR_FAIL_FALLBACK
        );
      }
      case StateCourse.Current: {
        return config.STATE_COURSE_CURRENT_COLOR;
      }
      case StateCourse.Canceled: {
        return config.STATE_COURSE_CANCELED_COLOR;
      }
      case StateCourse.Pending: {
        return config.STATE_COURSE_PENDING_COLOR;
      }
      default: {
        return colorMode === "light"
          ? config.COURSE_BOX_BACKGROUND_COLOR
          : config.STATE_COURSE_DEFAULT_DARK_COLOR;
      }
    }
  }, [state, colorMode, grade, bandColors, taken, config]);

  return (
    <Flex
      width="100px"
      maxW="32px"
      overflow="visible"
      h="100%"
      bg={stateColor}
      direction="column"
      alignItems="center"
      transition="all 0.4s ease-in-out"
      borderLeft="1px solid"
      borderColor={borderColor}
      className="secondaryBlock"
    >
      {children}
    </Flex>
  );
});

const RegistrationComponent: FC<Pick<CurrentTakenData, "registration">> = memo(
  ({ registration }) => {
    return (
      <motion.div
        key="status"
        initial={{
          opacity: 0,
          position: "static",
        }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          position: "absolute",
        }}
        css={width100percent}
      >
        <Text fontSize="9px" mr={2} textAlign="end">
          <b>{registration}</b>
        </Text>
      </motion.div>
    );
  }
);

const CreditsComponent: FC<Pick<ICourse, "credits">> = memo(({ credits }) => {
  return (
    <motion.div
      key="credits"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box pos="absolute" bottom="10px" left="10px">
        {credits.map(({ label, value }, key) => {
          return (
            value !== -1 && (
              <Text fontSize="9px" key={key}>
                <b>{`${label}: ${value}`}</b>
              </Text>
            )
          );
        })}
      </Box>
    </motion.div>
  );
});

export const ReqCircleComponent: FC<Pick<ICourse, "code">> = memo(
  ({ code }) => {
    const config = useContext(ConfigContext);
    const activeRequisites = CoursesDashboardStore.hooks.useActiveRequisites(
      code
    );
    const activeFlow = CoursesDashboardStore.hooks.useActiveFlow(code);

    return (
      ((activeFlow || activeRequisites) && (
        <motion.div
          key="req_circle"
          initial={{
            opacity: 0,
            position: "static",
          }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            position: "absolute",
          }}
        >
          <Box mt="-15px" pos="absolute" right="8px" top="80px">
            <svg width={32} height={32}>
              <circle
                r={15}
                cx={16}
                cy={16}
                stroke={
                  activeFlow
                    ? config.FLOW_CIRCLE_COLOR
                    : config.REQ_CIRCLE_COLOR
                }
                fill="transparent"
              />
              <text
                x={4}
                y={21}
                fontWeight="bold"
                fill={
                  activeFlow
                    ? config.FLOW_CIRCLE_COLOR
                    : config.REQ_CIRCLE_COLOR
                }
              >
                {activeFlow
                  ? config.FLOW_CIRCLE_LABEL
                  : config.REQ_CIRCLE_LABEL}
              </text>
            </svg>
          </Box>
        </motion.div>
      )) ||
      null
    );
  }
);

export const ModeComponent: FC<Pick<ICourse, "mode">> = memo(() => {
  const config = useContext(ConfigContext);
  const textColor = useColorModeValue("black", "white");
  return (
    (
      <motion.div
        key="req_circle"
        initial={{
          opacity: 0,
          position: "static",
        }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          position: "absolute",
        }}
      >
        <Box mt="-15px" pos="absolute" right="40px" top="80px">
          <svg width={32} height={32}>
            <circle
              r={15}
              cx={16}
              cy={16}
              stroke={textColor}
              fill="transparent"
            />
            <text
              x={3}
              y={19}
              fontSize="0.6rem"
              fontWeight="bold"
              fill={textColor}
            >
              {config.MODE_CIRCLE_LABEL}
            </text>
          </svg>
        </Box>
      </motion.div>
    ) || null
  );
});

const GradeComponent: FC<Pick<CurrentTakenData, "state" | "grade">> = memo(
  ({ grade, state }) => {
    const config = useContext(ConfigContext);

    return (
      <Text
        mb={2}
        pt={1}
        textShadow={TEXT_WHITE_SHADOW}
        color="black"
        fontWeight="bold"
      >
        {(() => {
          if (grade && grade != -1) {
            return grade.toFixed(1);
          }
          switch (state) {
            case StateCourse.Passed:
              return config.STATE_PASSED_LABEL_MINI;
            case StateCourse.Failed:
              return config.STATE_FAILED_LABEL_MINI;
            case StateCourse.Canceled:
              return config.STATE_CANCELED_LABEL_MINI;
            case StateCourse.Pending:
              return config.STATE_PENDING_LABEL_MINI;
            case StateCourse.Current:
              return config.STATE_CURRENT_LABEL_MINI;
            default:
              return "BUGasd";
          }
        })()}
      </Text>
    );
  }
);

export const currentDistributionLabel = ({
  term,
  year,
  label,
}: {
  term: string | number;
  year: number;
  label: string;
}) => {
  return `${label} ${term} ${year}`;
};

export function CourseBox({
  code,
  name,
  credits,
  historicDistribution,
  taken,
  bandColors,
  requisites,
  flow,
  mode,
}: ICourse) {
  const config = useContext(ConfigContext);

  const semestersTaken = useMemo(() => {
    const semestersTaken = taken.map(({ term, year }) => {
      return { term, year };
    });

    return semestersTaken;
  }, [taken]);

  const activeCourse = CoursesDashboardStore.hooks.useActiveCourse(code);
  const activeFlow = CoursesDashboardStore.hooks.useActiveFlow(code);
  const activeRequisites = CoursesDashboardStore.hooks.useActiveRequisites(
    code
  );
  const explicitSemester = CoursesDashboardStore.hooks.useCheckExplicitSemester(
    semestersTaken
  );

  const { user } = useUser({
    fetchPolicy: "cache-only",
  });

  const {
    state,
    grade,
    registration,
    currentDistribution,
    term,
    year,
    parallelGroup,
  } = useMemo<Partial<ITakenCourse>>(() => {
    if (explicitSemester) {
      const foundData = taken.find(({ term, year }) => {
        return pairTermYear(term, year) === explicitSemester;
      });
      return foundData || {};
    }
    return taken[0] || {};
  }, [semestersTaken, explicitSemester, taken]);

  const isOpen = CoursesDashboardStore.hooks.useDashboardIsCourseOpen(code);

  const isFutureCourseFulfilled = useIsCourseFuturePlanificationFulfilled({
    state: taken[0]?.state,
    code,
  });

  const isForeplanActive = ForeplanActiveStore.hooks.useIsForeplanActive();

  const isPossibleToTakeForeplan = ForeplanActiveStore.hooks.useIsPossibleToTakeForeplan(
    { state: taken[0]?.state, course: code },
    [taken, code]
  );

  const borderColor = (() => {
    if (activeCourse) {
      return config.ACTIVE_COURSE_BOX_COLOR;
    }

    if (isFutureCourseFulfilled) {
      return config.FOREPLAN_COURSE_FUTURE_PLANIFICATION_FULFILLED_BORDER_COLOR;
    }

    if (activeFlow) {
      return config.FLOW_COURSE_BOX_COLOR;
    }
    if (activeRequisites) {
      return config.REQUISITE_COURSE_BOX_COLOR;
    }
    if (explicitSemester) {
      return config.EXPLICIT_SEMESTER_COURSE_BOX_COLOR;
    }
    return config.INACTIVE_COURSE_BOX_COLOR;
  })();

  const shouldPredictCourseState = useMemo(() => {
    if (
      !isForeplanActive ||
      !user?.config.FOREPLAN_PREDICT_CURRENT_COURSE ||
      (taken[0]?.state !== StateCourse.Current &&
        taken[0]?.state !== StateCourse.Pending)
    ) {
      return false;
    }

    return true;
  }, [isForeplanActive, code, requisites, taken, user]);

  return (
    <OuterCourseBox
      code={code}
      currentDistribution={currentDistribution}
      historicDistribution={
        historicDistribution.length > 0
          ? historicDistribution
          : taken[0]?.historicalDistribution || []
      }
      isOpen={isOpen}
      semestersTaken={semestersTaken}
      borderColor={borderColor}
      isFutureCourseFulfilled={isFutureCourseFulfilled}
    >
      <MainBlockOuter
        flow={flow}
        requisites={requisites}
        code={code}
        taken={taken!}
        semestersTaken={semestersTaken}
      >
        <NameComponent
          code={code}
          taken={taken}
          name={name}
          isOpen={isOpen}
          parallelGroup={parallelGroup}
        />

        <AnimatePresence>
          {registration && isOpen && (
            <RegistrationComponent
              key="registration"
              registration={registration}
            />
          )}
          {!isOpen && <CreditsComponent key="credits" credits={credits} />}

          <ReqCircleComponent key="reqCircle" code={code} />
          {mode === config.COURSE_MODE_ANUAL_VALUE && (
            <ModeComponent key={"Mode"} mode={mode}></ModeComponent>
          )}

          {isOpen && (
            <HistogramsComponent
              key="histogramsComponent"
              code={code}
              state={taken[0]?.state}
            >
              <HistogramNow
                taken={taken}
                bandColors={bandColors}
                currentDistribution={currentDistribution}
                term={term}
                year={year}
                grade={grade}
              />
              <HistogramHistoric
                historicDistribution={
                  historicDistribution.length > 0
                    ? historicDistribution
                    : taken[0]?.historicalDistribution || []
                }
                bandColors={
                  bandColors.length > 0
                    ? bandColors
                    : taken[0]?.bandColors || []
                }
                grade={grade}
              />
            </HistogramsComponent>
          )}
          {isPossibleToTakeForeplan && user?.config.FOREPLAN_COURSE_STATS && (
            <ForeplanCourseStats key="foreplanCourseStats" code={code} />
          )}
        </AnimatePresence>
      </MainBlockOuter>
      <SecondaryBlockOuter
        taken={taken}
        bandColors={bandColors}
        borderColor={borderColor}
        grade={grade}
        state={state}
      >
        {grade !== undefined && <GradeComponent grade={grade} state={state} />}

        {taken.length > 1 && (
          <HistoricalCirclesComponent taken={taken} isOpen={isOpen} />
        )}
        {shouldPredictCourseState && (
          <PredictState code={code} isCourseOpen={isOpen} />
        )}
        <AnimatePresence>
          {isPossibleToTakeForeplan && user?.config.FOREPLAN && (
            <ForeplanCourseCheckbox
              key="foreplanCourseCheckbox"
              code={code}
              credits={credits}
              name={name}
            />
          )}
        </AnimatePresence>
      </SecondaryBlockOuter>
    </OuterCourseBox>
  );
}
