import { AnimatePresence, motion } from "framer-motion";
import { some, truncate } from "lodash";
import React, { FC, memo, useContext, useMemo } from "react";

import {
  Box,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { ConfigContext } from "../../../context/Config";
import {
  CoursesDashboardStore,
  toggleOpenCourse,
} from "../../../context/CoursesDashboard";
import { track } from "../../../context/Tracking";
import {
  HistogramHistoric,
  HistogramsComponent,
  HistogramGrouped,
} from "../Histogram";

import type {
  ICourse,
  IGroupedCourse,
  ITakenCourse,
} from "../../../../../interfaces";

export type CurrentTakenData = Partial<ITakenCourse>;

const OuterCourseBox: FC<
  Pick<ICourse, "code" | "historicDistribution"> & {
    isOpen: boolean;
    borderColor: string;
  } & Pick<IGroupedCourse, "agroupedDistribution">
> = memo(
  ({
    children,
    code,
    historicDistribution,
    borderColor,
    isOpen,
    agroupedDistribution,
  }) => {
    const config = useContext(ConfigContext);

    const activeCourse = CoursesDashboardStore.hooks.useActiveCourse(code);

    const { height, width } = useMemo(() => {
      let height: number | undefined = undefined;
      let width: number | undefined = undefined;
      if (isOpen) {
        if (
          agroupedDistribution &&
          some(agroupedDistribution, ({ value }) => value)
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
    }, [isOpen, historicDistribution, agroupedDistribution]);

    const borderWidth = activeCourse
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

const MainBlockOuter: FC<Pick<ICourse, "code" | "flow" | "requisites">> = memo(
  ({ children, code, flow, requisites }) => {
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
              });
            } else {
              CoursesDashboardStore.actions.removeCourse(code);
            }

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
  Pick<ICourse, "code" | "name"> & {
    isOpen: boolean;
  }
> = memo(({ code, name, isOpen }) => {
  return (
    <Stack spacing={1}>
      <Flex alignItems="center"></Flex>
      <Text m={0} whiteSpace="nowrap">
        <b>{code}</b>
      </Text>
      <Text fontSize={9} maxWidth="150px" pr={1}>
        {truncate(name, { length: isOpen ? 60 : 35 })}
      </Text>
    </Stack>
  );
});

const SecondaryBlockOuter: FC<
  Pick<ICourse, "bandColors"> & {
    n_total: number;
    n_passed: number;
    borderColor: string;
  }
> = memo(({ children, borderColor, n_total, n_passed }) => {
  const config = useContext(ConfigContext);

  const { colorMode } = useColorMode();

  const grouped_box = config.GROPUED_COURSE_BOX_COLORS;

  const stateColor = useMemo(() => {
    if (grouped_box[0] && n_passed == grouped_box[0].val) {
      return grouped_box[0].color;
    } else if (grouped_box[1] && n_passed < n_total * grouped_box[1].val) {
      return grouped_box[1].color;
    } else if (grouped_box[2] && n_passed < n_total * grouped_box[2].val) {
      return grouped_box[2]?.color;
    } else if (grouped_box[3] && n_passed < n_total * grouped_box[3]?.val) {
      return grouped_box[3]?.color;
    } else {
      return grouped_box[4]?.color;
    }
  }, [colorMode, config, n_total, n_passed]);

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

export function GroupedCourseBox({
  code,
  n_total,
  n_passed,
  name,
  credits,
  historicDistribution,
  agroupedDistribution,
  bandColors,
  requisites,
  agroupedBandColors,
  flow,
}: IGroupedCourse) {
  const config = useContext(ConfigContext);

  const activeCourse = CoursesDashboardStore.hooks.useActiveCourse(code);
  const activeFlow = CoursesDashboardStore.hooks.useActiveFlow(code);
  const activeRequisites = CoursesDashboardStore.hooks.useActiveRequisites(
    code
  );

  const isOpen = CoursesDashboardStore.hooks.useDashboardIsCourseOpen(code);

  const borderColor = (() => {
    if (activeCourse) {
      return config.ACTIVE_COURSE_BOX_COLOR;
    }

    if (activeFlow) {
      return config.FLOW_COURSE_BOX_COLOR;
    }
    if (activeRequisites) {
      return config.REQUISITE_COURSE_BOX_COLOR;
    }
    return config.INACTIVE_COURSE_BOX_COLOR;
  })();

  return (
    <OuterCourseBox
      code={code}
      historicDistribution={historicDistribution}
      isOpen={isOpen}
      borderColor={borderColor}
      agroupedDistribution={agroupedDistribution}
    >
      <MainBlockOuter flow={flow} requisites={requisites} code={code}>
        <NameComponent code={code} name={name} isOpen={isOpen} />

        <AnimatePresence>
          {!isOpen && <CreditsComponent key="credits" credits={credits} />}

          <ReqCircleComponent key="reqCircle" code={code} />

          {isOpen && (
            <HistogramsComponent key="histogramsComponent" code={code}>
              <HistogramGrouped
                agroupedDistribution={agroupedDistribution}
                bandColors={agroupedBandColors}
              />
              <HistogramHistoric
                historicDistribution={historicDistribution}
                bandColors={bandColors}
              />
            </HistogramsComponent>
          )}
        </AnimatePresence>
      </MainBlockOuter>
      <SecondaryBlockOuter
        bandColors={bandColors}
        n_passed={n_passed}
        n_total={n_total}
        borderColor={borderColor}
      ></SecondaryBlockOuter>
    </OuterCourseBox>
  );
}
