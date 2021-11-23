import { AnimatePresence, motion } from "framer-motion";
import { some, truncate, sortBy } from "lodash";
import dynamic from "next/dynamic";
import { Badge } from "@chakra-ui/react";

import React, { FC, memo, useContext, useMemo } from "react";

import { Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";

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
import { width100percent } from "../../../utils/cssConstants";
import { useUser } from "../../../utils/useUser";
import { PredictState } from "../../foreplan/courseBox/PredictState";
import { HistogramEvaluation, HistogramsComponent } from "../Histogram";

import type {
  ITakenExternalEvaluation,
  IExternalEvaluation,
  ITakenSemester,
} from "../../../../../interfaces";

const ForeplanCourseStats = dynamic(
  () => import("../../foreplan/courseBox/Stats")
);

export type CurrentTakenData = Partial<ITakenExternalEvaluation>;

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
  Pick<IExternalEvaluation, "code" | "taken"> & {
    isOpen: boolean;
    borderColor: string;
    semestersTaken: ITakenSemester[];
  } & {
    isFutureCourseFulfilled: boolean;
  }
> = memo(
  ({
    children,
    code,
    semestersTaken,
    taken,
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

    let takenSize = 0;
    taken.map(({ currentDistribution }) => {
      if (some(currentDistribution, ({ value }) => value)) {
        takenSize = takenSize + 1;
      }
    });

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
        if (takenSize > 0) {
          width = 350;
          height = 220 + (takenSize - 1) * 130;
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
    }, [isOpen, takenSize]);

    const borderWidth =
      activeCourse || isFutureCourseFulfilled
        ? config.EXTERNAL_EVALUATION_BOX_BORDER_WIDTH_ACTIVE
        : config.EXTERNAL_EVALUATION_BOX_BORDER_WIDTH_INACTIVE;

    const boxShadow = `0px 0px 0px ${borderWidth} ${borderColor}`;

    const color = useColorModeValue(
      config.EXTERNAL_EVALUATION_BOX_TEXT_COLOR,
      "white"
    );
    return (
      <Flex
        m={1}
        color={color}
        width={width}
        height={height}
        borderRadius={5}
        opacity={opacity}
        boxShadow={boxShadow}
        transition={config.EXTERNAL_EVALUATION_BOX_ALL_TRANSITION_DURATION}
        className="unselectable courseBox"
        padding={0}
        overflow="hidden"
      >
        {children}
      </Flex>
    );
  }
);

const MainBlockOuter: FC<Pick<IExternalEvaluation, "code">> = memo(
  ({ children, code }) => {
    const config = useContext(ConfigContext);
    const bg = useColorModeValue(
      config.EXTERNAL_EVALUATION_BOX_BACKGROUND_COLOR,
      "#1A202C"
    );
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
            track({
              action: "click",
              target: `course-box-${code}`,
              effect: `${wasOpen ? "close" : "open"}-course-box`,
            });
          });
        }}
      >
        {children}
      </Flex>
    );
  }
);

const NameComponent: FC<
  Pick<IExternalEvaluation, "code" | "name"> & {
    isOpen: boolean;
  }
> = memo(({ code, name, isOpen }) => {
  return (
    <Stack spacing={1}>
      <Flex alignItems="center">
        <Text m={0} whiteSpace="nowrap">
          <b>{code}</b>
        </Text>
      </Flex>

      <Text fontSize={9} maxWidth="150px" pr={1}>
        {truncate(name, { length: isOpen ? 60 : 35 })}
      </Text>
    </Stack>
  );
});

const SecondaryBlockOuter: FC<
  Pick<CurrentTakenData, "state"> & {
    borderColor: string;
  }
> = memo(({ children, borderColor, state }) => {
  const config = useContext(ConfigContext);

  const stateColor = config.STATE_COURSE_DEFAULT_COLOR_EXTERNAL_EVALUATION;

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

export function ExternalEvaluationBox({
  code,
  name,
  taken,
}: IExternalEvaluation) {
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

  const { state, registration } = useMemo<
    Partial<ITakenExternalEvaluation>
  >(() => {
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
      return config.ACTIVE_EXTERNAL_EVALUATION_BOX_COLOR;
    }

    if (isFutureCourseFulfilled) {
      return config.FOREPLAN_COURSE_FUTURE_PLANIFICATION_FULFILLED_BORDER_COLOR;
    }

    if (activeFlow) {
      return config.FLOW_EXTERNAL_EVALUATION_BOX_COLOR;
    }
    if (activeRequisites) {
      return config.REQUISITE_EXTERNAL_EVALUATION_BOX_COLOR;
    }
    if (explicitSemester) {
      return config.EXPLICIT_SEMESTER_EXTERNAL_EVALUATION_BOX_COLOR;
    }
    return config.INACTIVE_EXTERNAL_EVALUATION_BOX_COLOR;
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
  }, [isForeplanActive, code, taken, user]);
  console.log("external evaluation", "taken", taken);
  return (
    <OuterCourseBox
      code={code}
      taken={taken}
      isOpen={isOpen}
      semestersTaken={semestersTaken}
      borderColor={borderColor}
      isFutureCourseFulfilled={isFutureCourseFulfilled}
    >
      <MainBlockOuter code={code}>
        <NameComponent code={code} name={name} isOpen={isOpen} />

        <AnimatePresence>
          {registration && isOpen && (
            <RegistrationComponent
              key="registration"
              registration={registration}
            />
          )}

          {isOpen && (
            <HistogramsComponent
              key="histogramsComponent"
              code={code}
              state={taken[0]?.state}
            >
              {taken.length > 0 ? (
                sortBy(
                  taken,
                  ({ topic }) => topic
                ).map(({ currentDistribution, topic, grade, bandColors }) => (
                  <HistogramEvaluation
                    bandColors={bandColors}
                    currentDistribution={currentDistribution ?? []}
                    grade={grade}
                    topic={topic ?? ""}
                  />
                ))
              ) : (
                <Badge>{config.NO_HISTORIC_DATA}</Badge>
              )}
            </HistogramsComponent>
          )}
          {isPossibleToTakeForeplan && user?.config.FOREPLAN_COURSE_STATS && (
            <ForeplanCourseStats key="foreplanCourseStats" code={code} />
          )}
        </AnimatePresence>
      </MainBlockOuter>
      <SecondaryBlockOuter borderColor={borderColor} state={state}>
        {shouldPredictCourseState && (
          <PredictState code={code} isCourseOpen={isOpen} />
        )}
      </SecondaryBlockOuter>
    </OuterCourseBox>
  );
}
