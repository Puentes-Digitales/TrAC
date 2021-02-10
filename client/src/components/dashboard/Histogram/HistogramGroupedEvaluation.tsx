import { some } from "lodash";
import React, { useContext } from "react";

import { Badge } from "@chakra-ui/react";
import { ConfigContext } from "../../../context/Config";
import { Histogram } from "./Histogram";
import {
  IGroupedCourse,
  ITopicExternalEvaluation,
} from "../../../../../interfaces";

export function HistogramGroupedEvaluation({
  agroupedDistribution,
  bandColors,
  topic,
}: Pick<IGroupedCourse, "agroupedDistribution" | "bandColors"> &
  Pick<ITopicExternalEvaluation, "topic">) {
  const config = useContext(ConfigContext);

  return agroupedDistribution &&
    some(agroupedDistribution, ({ value }) => value) ? (
    <Histogram
      key="grouped"
      label={topic}
      distribution={agroupedDistribution}
      bandColors={bandColors}
    />
  ) : (
    <Badge>{config.NO_HISTORIC_DATA}</Badge>
  );
}
