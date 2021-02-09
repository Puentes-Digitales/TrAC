import DataLoader from "dataloader";
import { Dictionary, groupBy, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  ExternalEvaluationStatsTable,
  ExternalEvaluationTable,
  IExternalEvaluation,
  ExternalEvaluationStructureTable,
} from "../db/tables";
import { clearErrorArray } from "../utils/clearErrorArray";

export const ExternalEvaluationDataLoader = new DataLoader(
  async (ids: readonly string[]) => {
    const dataDict: Dictionary<IExternalEvaluation | undefined> = keyBy(
      await ExternalEvaluationTable().select("*").whereIn("id", ids),
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

export const ExternalEvaluationStructureDataLoader = new DataLoader(
  async (keys: readonly { id: number; code: string }[]) => {
    const [
      ExternalEvaluationTableData,
      externalEvaluationStructureData,
    ] = await Promise.all([
      ExternalEvaluationDataLoader.loadMany(keys.map(({ code }) => code)),

      ExternalEvaluationStructureTable()
        .select("*")
        .whereIn(
          "id",
          keys.map(({ id }) => id)
        ),
    ]);

    const hashExternalEvaluationTableData = keyBy(
      clearErrorArray(ExternalEvaluationTableData),
      "id"
    );
    const hashExternalEvaluationStructureData = keyBy(
      externalEvaluationStructureData,
      "id"
    );

    return keys.map((key) => {
      return {
        externalEvaluationTable: hashExternalEvaluationTableData[key.code],
        externalEvaluationtructureTable:
          hashExternalEvaluationStructureData[key.id],
      };
    });
  },
  {
    cacheKeyFn: (key) => {
      return key.id + key.code;
    },
    cacheMap: new LRUMap(5000),
  }
);

export const ExternalEvaluationStatsDataLoader = new DataLoader(
  async (codes: readonly string[]) => {
    const groupedData = groupBy(
      await ExternalEvaluationStatsTable()
        .select("*")
        .whereIn("external_evaluation_taken", codes),
      "external_evaluation_taken"
    );

    return codes.map((code) => {
      return groupedData[code] ?? [];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);
