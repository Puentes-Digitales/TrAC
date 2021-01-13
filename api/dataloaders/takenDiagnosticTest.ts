import DataLoader from "dataloader";
import { Dictionary, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  DiagnosticTestStatsTable,
  IDiagnosticTestStats,
  IStudentDiagnosticTest,
  StudentDiagnosticTestTable,
} from "../db/tables";

export const StudentCourseDataLoader = new DataLoader(
  async (ids: readonly number[]) => {
    const dataDict: Dictionary<IStudentDiagnosticTest | undefined> = keyBy(
      await StudentDiagnosticTestTable().select("*").whereIn("id", ids),
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

export const DiagnosticStatsByStateDataLoader = new DataLoader(
  async (
    keys: readonly {
      diagnostic_test_taken: string;
      year: number;
      term: number;
      p_group: number;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ diagnostic_test_taken, year, term, p_group }) => {
        return DiagnosticTestStatsTable()
          .select("histogram", "histogram_labels", "color_bands")
          .where({
            diagnostic_test_taken,
            year,
            term,
            p_group,
          })
          .first();
      })
    );
  },
  {
    cacheKeyFn: ({ diagnostic_test_taken, year, term, p_group }) => {
      return `${diagnostic_test_taken}${year}${term}${p_group}`;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const DiagnosticTestStatsByDiagnosticTestTakenDataLoader = new DataLoader(
  async (codes: readonly string[]) => {
    const dataDict: Dictionary<
      | Pick<IDiagnosticTestStats, "diagnostic_test_taken" | "color_bands">
      | undefined
    > = keyBy(
      await DiagnosticTestStatsTable()
        .select("color_bands", "diagnostic_test_taken")
        .whereIn("diagnostic_test_taken", codes),
      "diagnostic_test_taken"
    );

    return codes.map((diagnostic_test_taken) => {
      return dataDict[diagnostic_test_taken];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);
