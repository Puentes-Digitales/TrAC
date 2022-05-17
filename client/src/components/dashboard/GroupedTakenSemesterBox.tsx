import React, { FC, memo, useContext, useMemo } from "react";

import {
  Badge,
  BadgeProps,
  Box,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { termTypeToNumber } from "../../../constants";
import { ConfigContext } from "../../context/Config";
import { CoursesDashboardStore } from "../../context/CoursesDashboard";
/*
function SingleBar({ height }: { height: number }) {
  const fill = GROUPED_HISTOGRAM_BAR;
  const textColor = useColorModeValue("black", "white");
  const heightBar = Math.sqrt(height) * 4 > 50 ? 50 : Math.sqrt(height) * 4;
  const textPosY =
    50 - (Math.sqrt(height) * 4 > 50 ? 50 : Math.sqrt(height) * 4);

  const textPosX = 20 - height.toString().length * 4;
  return (
    <>
      <rect
        className="ignore_dark_mode"
        width={40}
        height={heightBar}
        fill={fill}
      />
      <g
        css={{
          transform: "rotate(180deg) translate(1%,65%) scaleX(-1)",
          transformOrigin: "0% 65%",
        }}
      >
        <text
          x={textPosX}
          y={textPosY}
          fontWeight="bold"
          fontSize="15"
          fill={textColor}
        >
          {height}
        </text>
      </g>
    </>
  );
}*/

function OpportuneGraduationBar({
  height,
  semester,
  timely,
}: {
  height: number;
  semester: number;
  timely: number;
}) {
  const {
    GROUPED_HISTOGRAM_BAR,
    GROUPED_TIMELY_HISTOGRAM_BAR,
    GROUPED_OPPORTUNE_HISTOGRAM_BAR,
    GROUPED_NOT_OPPORTUNE_HISTOGRAM_BAR,
    GROUPED_OPPORTUNE_EXTRA_TERMS,
  } = useContext(ConfigContext);
  if (semester < timely) {
    var fill = GROUPED_HISTOGRAM_BAR;
  } else if (semester === timely) {
    var fill = GROUPED_TIMELY_HISTOGRAM_BAR;
  } else if (semester <= timely + GROUPED_OPPORTUNE_EXTRA_TERMS) {
    var fill = GROUPED_OPPORTUNE_HISTOGRAM_BAR;
  } else {
    var fill = GROUPED_NOT_OPPORTUNE_HISTOGRAM_BAR;
  }
  const textColor = useColorModeValue("black", "white");
  const heightBar = Math.sqrt(height) * 4 > 50 ? 50 : Math.sqrt(height) * 4;
  const textPosY =
    50 - (Math.sqrt(height) * 4 > 50 ? 50 : Math.sqrt(height) * 4);

  const textPosX = 20 - height.toString().length * 4;
  return (
    <>
      <rect
        className="ignore_dark_mode"
        width={40}
        height={heightBar}
        fill={fill}
      />
      <g
        css={{
          transform: "rotate(180deg) translate(1%,65%) scaleX(-1)",
          transformOrigin: "0% 65%",
        }}
      >
        <text
          x={textPosX}
          y={textPosY}
          fontWeight="bold"
          fontSize="15"
          fill={textColor}
        >
          {height}
        </text>
      </g>
    </>
  );
}

export const GroupedTakenSemesterBox: FC<{
  year: number;
  term: string;
  n_students: number;
  comments?: string;
  semesterNumber: number;
  timely: number;
}> = memo(({ year, term, n_students, comments, semesterNumber, timely }) => {
  const config = useContext(ConfigContext);
  const semestersTaken = CoursesDashboardStore.hooks.useActiveSemestersTaken();

  const explicitSemester = CoursesDashboardStore.hooks.useExplicitSemester();

  const isExplicitSemester = CoursesDashboardStore.hooks.useCheckExplicitSemester(
    { term, year },
    [term, year]
  );

  const borderColor = useMemo(() => {
    if (
      isExplicitSemester ||
      (explicitSemester === undefined &&
        semestersTaken?.find((v) => year === v.year && term == v.term))
    ) {
      return config.TAKEN_SEMESTER_BOX_ACTIVE;
    }
    return config.TAKEN_SEMESTER_BOX_INACTIVE;
  }, [explicitSemester, term, year, isExplicitSemester, n_students, config]);

  const badgeProps = useMemo<BadgeProps>(() => {
    if (!comments) {
      return {};
    }
    switch (comments.toUpperCase()) {
      case "ELIM-REINC":
      case "REINCORP":
        return {
          colorScheme: "orange",
        };
      case "ELIMINADO":
        return {
          colorScheme: "red",
        };
      case "EGRESADO": {
        return {
          colorScheme: "blue",
        };
      }
      case "PENDIENTE":
        return {
          colorScheme: "purple",
        };
    }
    return {
      backgroundColor: "black",
      color: "white",
    };
  }, [comments]);

  const badgeBgColor = useColorModeValue(undefined, "#202020");
  return termTypeToNumber(term) < 3 ? (
    <Stack ml={config.TAKEN_SEMESTER_BOX_MARGIN_SIDES}>
      <svg width={80} height={80}>
        <svg x={20} y={10}>
          <g
            css={{
              transform: "rotate(180deg) translate(0%,85%) scaleX(-1)",
              transformOrigin: "0% 85%",
            }}
          >
            <OpportuneGraduationBar
              height={n_students}
              semester={semesterNumber}
              timely={timely}
            />
          </g>
        </svg>
      </svg>
      <Box
        textAlign="center"
        border={config.TAKEN_SEMESTER_BOX_BORDER}
        fontFamily="Lato"
        borderColor={borderColor}
        borderRadius={config.TAKEN_SEMESTER_BOX_BORDER_RADIUS}
        backgroundColor={config.TAKEN_SEMESTER_BOX_BACKGROUND_COLOR}
        p={config.TAKEN_SEMESTER_BOX_PADDING}
        ml={config.TAKEN_SEMESTER_BOX_MARGIN_SIDES}
        mr={config.TAKEN_SEMESTER_BOX_MARGIN_SIDES}
        fontSize={config.TAKEN_SEMESTER_BOX_FONT_SIZE}
        cursor="pointer"
        className="unselectable"
        transition={config.TAKEN_SEMESTER_BOX_TRANSITION}
        whiteSpace="nowrap"
        alignItems="center"
        display="flex"
        onClick={() => {
          CoursesDashboardStore.actions.toggleExplicitSemester({
            term,
            year,
          });
        }}
        color={config.TAKEN_SEMESTER_BOX_TEXT_COLOR}
        height={config.TAKEN_SEMESTER_BOX_HEIGHT}
      >
        {comments ? (
          <Stack spacing={0}>
            <Box>
              <b>{`${termTypeToNumber(term)}S ${year}`}</b>
            </Box>
            <Box>
              <Badge
                bg={badgeBgColor}
                borderRadius="4px"
                fontSize="0.5em"
                {...badgeProps}
              >
                {comments}
              </Badge>
            </Box>
          </Stack>
        ) : (
          <b>{`${termTypeToNumber(term)}S ${year}`}</b>
        )}
      </Box>
    </Stack>
  ) : null;
});
