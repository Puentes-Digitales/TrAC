import { some } from "lodash";
import React from "react";

import {
  IExternalEvaluation,
  IGroupedExternalEvaluation,
} from "../../../../../interfaces";
import { CurrentTakenData } from "../CourseBox/ExternalEvaluationBox";
import { HistogramExternalEvaluation } from "./HistogramExternalEvaluation";

export function HistogramEvaluation({
  currentDistribution,
  topic,
  grade,
  bandColors,
}: Pick<IExternalEvaluation, "topic"> &
  Pick<IGroupedExternalEvaluation, "bandColors"> &
  Pick<CurrentTakenData, "currentDistribution" | "grade">) {
  const valueLabel = topic + " " + (grade ? grade.toString() : "");
  return (
    (currentDistribution && some(currentDistribution, ({ value }) => value) && (
      <HistogramExternalEvaluation
        key="now"
        label={valueLabel}
        distribution={currentDistribution}
        grade={grade}
        bandColors={bandColors}
      />
    )) ||
    null
  );
}
