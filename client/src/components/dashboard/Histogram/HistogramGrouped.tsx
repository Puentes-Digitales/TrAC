import { some } from "lodash";
import React, { useContext } from "react";

import { Badge } from "@chakra-ui/react";
import { ConfigContext } from "../../../context/Config";
import { Histogram } from "./Histogram";
import { IGroupedCourse } from "../../../../../interfaces";

export function HistogramGrouped({
  agroupedDistribution,
  bandColors,
}: Pick<IGroupedCourse, "agroupedDistribution" | "bandColors">) {
  const config = useContext(ConfigContext);

  return agroupedDistribution &&
    some(agroupedDistribution, ({ value }) => value) ? (
    <Histogram
      key="grouped"
      label={config.GROUPED_GRADES}
      distribution={agroupedDistribution}
      bandColors={bandColors}
    />
  ) : (
    <Badge>{config.NO_HISTORIC_DATA}</Badge>
  );
}
