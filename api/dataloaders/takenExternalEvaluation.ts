import DataLoader from "dataloader";
import { Dictionary, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  ExternalEvaluationStatsTable,
  IExternalEvaluationStats,
  IStudentExternalEvaluation,
  StudentExternalEvaluationTable,
} from "../db/tables";

export const StudentExternalEvaluationDataLoader = new DataLoader(
  async (ids: readonly number[]) => {
    const dataDict: Dictionary<IStudentExternalEvaluation | undefined> = keyBy(
      await StudentExternalEvaluationTable().select("*").whereIn("id", ids),
      "id"
    );

    return ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const ExternalEvaluationStatsByStateDataLoader = new DataLoader(
  async (
    keys: readonly {
      external_evaluation_taken: string;
      year: number;
      term: number;
      p_group: number;
      topic: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(
        async ({ external_evaluation_taken, year, term, p_group, topic }) => {
          const data = await ExternalEvaluationStatsTable()
            .select("histogram", "histogram_labels", "color_bands")
            .where({
              topic,
              external_evaluation_taken,
              year,
              term,
              p_group,
            });

          return data;
        }
      )
    );
  },
  {
    cacheKeyFn: ({ external_evaluation_taken, year, term, p_group, topic }) => {
      return `${external_evaluation_taken}${year}${term}${p_group}${topic}`;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const ExternalEvaluationStatsByExternalEvaluationTakenDataLoader = new DataLoader(
  async (codes: readonly string[]) => {
    const dataDict: Dictionary<
      | Pick<
          IExternalEvaluationStats,
          "external_evaluation_taken" | "color_bands"
        >
      | undefined
    > = keyBy(
      await ExternalEvaluationStatsTable()
        .select("color_bands", "external_evaluation_taken")
        .whereIn("external_evaluation_taken", codes),
      "external_evaluation_taken"
    );

    return codes.map((external_evaluation_taken) => {
      return dataDict[external_evaluation_taken];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);
