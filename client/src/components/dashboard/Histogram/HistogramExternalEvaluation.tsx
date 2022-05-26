import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import { toInteger, truncate } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";

import { useColorModeValue } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { AxisBottom, AxisLeft, AxisScale } from "@vx/axis";

import { IDistribution } from "../../../../../interfaces";
import { ConfigContext } from "../../../context/Config";
import {
  averageTwo,
  scaleEvaluationAxisX,
  scaleColorX,
} from "./HistogramHelpers";

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
  return (
    <AxisBottom
      scale={scaleEvaluationAxisX as AxisScale}
      left={5}
      top={80}
      hideAxisLine={false}
      hideTicks={true}
      tickLength={2}
      numTicks={5}
      tickFormat={(n) => {
        return (n.valueOf() ?? n).toString();
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
        const previousMax: number | undefined = bandColors[key - 1]?.max;

        let x = scaleColorX(averageTwo(previousMax, min)) / 20;

        return (
          <rect
            key={key}
            x={8 + (x ?? 0)}
            y={80}
            width={90}
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

export function HistogramExternalEvaluation({
  distribution,
  label,
  grade,
  bandColors,
}: {
  distribution: IDistribution[];
  label?: string;
  grade?: number;
  bandColors: { min: number; max: number; color: string }[];
}) {
  const { GRADE_STUDENT_LABEL } = useContext(ConfigContext);

  const barsScale = useCallback(
    scaleLinear()
      .domain([0, Math.max(...distribution.map(({ value }) => value))])
      .range([0, 70]),
    [distribution]
  );
  const axisLeftScale = useCallback(
    scaleLinear()
      .range([0, 70])
      .domain([Math.max(...distribution.map(({ value }) => value)), 0]),
    [distribution]
  );
  //slice value
  const newLine =
    label?.length! > 20
      ? label?.slice(20, label?.length!)?.indexOf(" ")! + 20
      : 0;
  const greyN = useMemo(() => {
    if (grade !== undefined) {
      return distribution.findIndex(({ label }, key: number) => {
        const [min, max] = label.split("-").map(toInteger); // TODO: Adapt to pass/fail histogram type
        if (
          min != undefined &&
          max != undefined &&
          grade >= min &&
          grade <= max
        ) {
          if (grade === max && distribution[key + 1]) {
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
        {label?.length! > 25 ? (
          <>
            <text y={10} x={30} fontWeight="bold" fill={textColor}>
              {truncate(label?.slice(0, newLine)!, {
                length: label?.length!,
              }) ?? "Undefined"}
            </text>
            <text y={25} x={30} fontWeight="bold" fill={textColor}>
              {truncate(label?.slice(newLine, label?.length!)!, {
                length: label?.length!,
              }) ?? "Undefined"}
            </text>
          </>
        ) : (
          <text y={20} x={30} fontWeight="bold" fill={textColor}>
            {truncate(label, { length: 45 }) ?? "Undefined"}
          </text>
        )}
        {grade != undefined && (
          <text y={40} x={30} fontWeight="bold" fill={textColor}>
            {GRADE_STUDENT_LABEL}:{Math.round(grade)}%
          </text>
        )}

        <svg x={-15} y={20}>
          <AxisLeft
            left={40}
            top={10}
            scale={axisLeftScale as AxisScale}
            hideAxisLine={true}
            tickLength={4}
            numTicks={
              Math.max(...distribution.map(({ value }) => value)) < 4
                ? Math.max(...distribution.map(({ value }) => value))
                : 4
            }
            stroke={textColor}
            tickStroke={textColor}
            labelProps={{ fill: textColor }}
            tickFormat={(n) => {
              return n.toString();
            }}
          />
        </svg>
      </svg>
    </svg>
  );
}
