import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import { toInteger, truncate } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";

import { useColorModeValue } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { AxisBottom, AxisLeft, AxisScale } from "@vx/axis";

import { IDistribution } from "../../../../../interfaces";
import { ConfigContext } from "../../../context/Config";
import { scaleEvaluationGradeAxisX } from "./HistogramHelpers";

function SingleBar({
  grey,
  height,
  x,
}: {
  grey?: boolean;
  x?: number;
  height?: number;
}) {
  const { HISTOGRAM_BAR_ACTIVE, HISTOGRAM_BAR_INACTIVE } = useContext(
    ConfigContext
  );
  const fill = grey ? HISTOGRAM_BAR_ACTIVE : HISTOGRAM_BAR_INACTIVE;

  return (
    <motion.rect
      className="ignore_dark_mode"
      width={40}
      x={x}
      height={height}
      animate={{ fill }}
      transition={{ duration: 1 }}
      fill={fill}
    />
  );
}

const AxisNumbers = (() => {
  const format = ["D", "C", "B", "A"];
  return (
    <AxisBottom
      scale={scaleEvaluationGradeAxisX as AxisScale}
      left={-10}
      top={80}
      hideAxisLine={true}
      hideTicks={true}
      tickLength={2}
      numTicks={3}
      tickFormat={(n) => {
        return format[n / 10 - 1];
      }}
    />
  );
})();

function XAxis({
  bandColors,
}: {
  bandColors: { min: number; max: number; color: string }[];
}) {
  const AxisColor = useMemo(
    () =>
      bandColors.map(({ min, color }, key) => {
        let x = key * 42;

        return (
          <rect
            key={key}
            x={5 + (x ?? 0)}
            y={80}
            width={42}
            height={7}
            fill={color}
          />
        );
      }),
    [bandColors]
  );
  return (
    <>
      {AxisColor}
      {AxisNumbers}
    </>
  );
}

export function HistogramGradesLetter({
  distribution,
  label,
  grade,
  bandColors,
}: {
  distribution: IDistribution[];
  label?: string;
  grade?: string;
  bandColors: { min: number; max: number; color: string }[];
}) {
  const barsScale = useCallback(
    scaleLinear()
      .domain([0, Math.max(...distribution.map(({ value }) => value))])
      .range([0, 50]),
    [distribution]
  );
  const axisLeftScale = useCallback(
    scaleLinear()
      .range([0, 70])
      .domain([Math.max(...distribution.map(({ value }) => value)), 0]),
    [distribution]
  );

  const greyN = useMemo(() => {
    if (grade !== undefined) {
      return distribution.findIndex(({ label }, key: number) => {
        let value = -1;
        switch (grade) {
          case "A":
            value = 100;
            break;
          case "B":
            value = 74;
            break;
          case "C":
            value = 49;
            break;
          case "D":
            value = 1;
        }
        const [min, max] = label.split("-").map(toInteger); // TODO: Adapt to pass/fail histogram type
        if (
          min != undefined &&
          max != undefined &&
          value >= min &&
          value <= max
        ) {
          if (value === max && distribution[key + 1]) {
            return false;
          }
          return true;
        }
        return false;
      });
    }

    return -1;
  }, [grade, distribution]);

  const textColor = useColorModeValue("black", "white");

  const svgCSS = css`
    tspan {
      fill: ${textColor};
    }
  `;

  return (
    <svg width={300} height={130} css={svgCSS}>
      <svg x={35} y={23}>
        <XAxis bandColors={bandColors} />
        <g
          css={{
            transform: "rotate(180deg) translate(1%,41%) scaleX(-1)",
            transformOrigin: "50% 50%",
          }}
        >
          {distribution.map(({ value }, key) => {
            return (
              <SingleBar
                x={5 + 21 * key}
                key={key}
                grey={key === greyN}
                height={barsScale(value)}
              />
            );
          })}
        </g>
      </svg>

      <svg x={0}>
        <text y={20} x={30} fontWeight="bold" fill={textColor}>
          {truncate(label, { length: 35 }) ?? "Undefined"}
        </text>
        {grade}
        {grade && (
          <text y={40} x={30} fontWeight="bold" fill={textColor}>
            Nota: {grade}
          </text>
        )}

        <svg x={-15} y={20}>
          <AxisLeft
            left={40}
            top={10}
            scale={axisLeftScale as AxisScale}
            hideAxisLine={true}
            tickLength={4}
            numTicks={4}
            stroke={textColor}
            tickStroke={textColor}
            labelProps={{ fill: textColor }}
          />
        </svg>
      </svg>
    </svg>
  );
}
