import { some } from "lodash";
import React from "react";

import { IExternalEvaluation } from "../../../../../interfaces";
import { CurrentTakenData } from "../CourseBox/ExternalEvaluationBox";
import { HistogramExternalEvaluation } from "./HistogramExternalEvaluation";
import { HistogramGradesLetter } from "./HistogramGradesLetter";

export function HistogramEvaluation({
  currentDistribution,
  topic,
  grade,
  bandColors,
}: Pick<IExternalEvaluation, "topic"> &
  Pick<CurrentTakenData, "currentDistribution" | "grade" | "bandColors">) {
  return (
    (currentDistribution &&
      some(currentDistribution, ({ value }) => value) &&
      (currentDistribution.length <= 4 ? (
        <HistogramGradesLetter
          key="now"
          label={topic}
          distribution={currentDistribution}
          grade={grade}
          bandColors={bandColors ? bandColors : []}
        />
      ) : (
        <HistogramExternalEvaluation
          key="now"
          label={topic}
          distribution={currentDistribution}
          grade={grade ? parseInt(grade) : undefined}
          bandColors={bandColors ? bandColors : []}
        />
      ))) ||
    null
  );
}
