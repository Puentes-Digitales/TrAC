import { some } from "lodash";
import React from "react";

import { IExternalEvaluation } from "../../../../../interfaces";
import { CurrentTakenData } from "../CourseBox/CourseBox";
import { Histogram } from "./Histogram";

export function HistogramEvaluation({
  currentDistribution,
  term,
  year,
  topic,
  taken,
  grade,
  bandColors,
}: Pick<IExternalEvaluation, "taken" | "bandColors" | "topic"> &
  Pick<CurrentTakenData, "currentDistribution" | "term" | "year" | "grade">) {
  return (
    (currentDistribution &&
      some(currentDistribution, ({ value }) => value) &&
      term &&
      year && (
        <Histogram
          key="now"
          label={topic}
          distribution={currentDistribution}
          grade={grade}
          bandColors={taken?.[0]?.bandColors ?? bandColors}
        />
      )) ||
    null
  );
}
