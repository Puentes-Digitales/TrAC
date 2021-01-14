import DataLoader from "dataloader";
import { Dictionary, groupBy, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  DiagnosticTestStatsTable,
  DiagnosticTestTable,
  IDiagnosticTest,
  ProgramStructureTable,
} from "../db/tables";
import { clearErrorArray } from "../utils/clearErrorArray";

export const DiagnosticTestDataLoader = new DataLoader(
  async (ids: readonly string[]) => {
    const dataDict: Dictionary<IDiagnosticTest | undefined> = keyBy(
      await DiagnosticTestTable().select("*").whereIn("id", ids),
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

export const DiagnosticTestAndStructureDataLoader = new DataLoader(
  async (keys: readonly { id: number; code: string }[]) => {
    const [DiagnosticTestTableData, programStructureData] = await Promise.all([
      DiagnosticTestDataLoader.loadMany(keys.map(({ code }) => code)),

      ProgramStructureTable()
        .select("*")
        .whereIn(
          "id",
          keys.map(({ id }) => id)
        ),
    ]);

    const hashDiagnosticTestTableData = keyBy(
      clearErrorArray(DiagnosticTestTableData),
      "id"
    );
    const hashProgramStructureData = keyBy(programStructureData, "id");

    return keys.map((key) => {
      return {
        diagnosticTestTable: hashDiagnosticTestTableData[key.code],
        programStructureTable: hashProgramStructureData[key.id],
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

export const DiagnosticTestStatsDataLoader = new DataLoader(
  async (codes: readonly string[]) => {
    const groupedData = groupBy(
      await DiagnosticTestStatsTable()
        .select("*")
        .whereIn("diagnostic_test_taken", codes),
      "diagnostic_test_taken"
    );

    return codes.map((code) => {
      return groupedData[code] ?? [];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);
