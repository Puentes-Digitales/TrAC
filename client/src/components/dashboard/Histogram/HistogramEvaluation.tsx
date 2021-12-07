import { some } from "lodash";
import React, { useContext } from "react";
import { Badge } from "@chakra-ui/react";
import { ConfigContext } from "../../../context/Config";
import { IExternalEvaluation } from "../../../../../interfaces";
import { CurrentTakenData } from "../CourseBox/ExternalEvaluationBox";
import { HistogramExternalEvaluation } from "./HistogramExternalEvaluation";
import { HistogramGradesLetter } from "./HistogramGradesLetter";

export function HistogramEvaluation({
  currentDistribution,
  topic,
  grade,
  bandColors,
}: Pick<IExternalEvaluation, "topic" | "bandColors"> &
  Pick<CurrentTakenData, "currentDistribution" | "grade">) {
  const config = useContext(ConfigContext);

  return currentDistribution ? (
    some(currentDistribution, ({ value }) => value) ? (
      currentDistribution.length <= 4 ? (
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
          grade={grade ? grade : undefined}
          bandColors={bandColors ? bandColors : []}
        />
      )
    ) : (
      <Badge>{config.NO_HISTORIC_DATA}</Badge>
    )
  ) : (
    <Badge>{config.NO_HISTORIC_DATA}</Badge>
  );
}
