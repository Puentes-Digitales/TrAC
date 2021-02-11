import React, { FC, memo, useContext, useMemo } from "react";
import { css } from "@emotion/react";

import {
  Badge,
  BadgeProps,
  Box,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { motion } from "framer-motion";

import { termTypeToNumber } from "../../../constants";
import { ConfigContext } from "../../context/Config";
import { CoursesDashboardStore } from "../../context/CoursesDashboard";

function SingleBar({ height }: { height?: number }) {
  const { GROUPED_HISTOGRAM_BAR } = useContext(ConfigContext);
  const fill = GROUPED_HISTOGRAM_BAR;

  return (
    <motion.rect
      className="ignore_dark_mode"
      width={40}
      height={height}
      animate={{ fill }}
      transition={{ duration: 1 }}
      fill={fill}
    />
  );
}

export const GroupedTakenSemesterBox: FC<{
  year: number;
  term: string;
  n_students: number;
  comments?: string;
}> = memo(({ year, term, n_students, comments }) => {
  const config = useContext(ConfigContext);

  const borderColor = useMemo(() => {
    return config.TAKEN_SEMESTER_BOX_INACTIVE;
  }, [term, year, n_students, config]);

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

  const textColor = useColorModeValue("black", "white");
  const badgeBgColor = useColorModeValue(undefined, "#202020");
  const svgCSS = css`
    tspan {
      fill: ${textColor};
    }
  `;
  return (
    <Stack ml={config.TAKEN_SEMESTER_BOX_MARGIN_SIDES}>
      <svg width={80} height={150} css={svgCSS}>
        <svg x={20} y={30}>
          <g
            css={{
              transform: "rotate(180deg) translate(1%,21%) scaleX(-1)",
              transformOrigin: "50% 50%",
            }}
          >
            {<SingleBar height={n_students} />}
          </g>
        </svg>
      </svg>

      {
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
      }
    </Stack>
  );
});
