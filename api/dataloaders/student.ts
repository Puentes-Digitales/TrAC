import DataLoader from "dataloader";
import { Dictionary, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  IProgram,
  IStudent,
  IStudentDropout,
  //IStudentProgram,
  IStudentAdmission,
  IStudentEmployed,
  STUDENT_PROGRAM_TABLE,
  STUDENT_TABLE,
  StudentAdmissionTable,
  StudentDropoutTable,
  //STUDENT_ADMISSION_TABLE,
  //STUDENT_DROPOUT_TABLE,
  StudentEmployedTable,
  StudentProgramTable,
  StudentTable,
  StudentTermTable,
  RiskNotificationTable,
  //IStudentProgram,
} from "../db/tables";
import { TermDataLoader } from "./term";

export const StudentDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    const dataDict: Dictionary<IStudent | undefined> = keyBy(
      await StudentTable().select("*").whereIn("id", student_ids),
      "id"
    );

    return student_ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentViaProgramsDataLoader2 = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ student_id, program_id }) => {
        return StudentProgramTable()
          .select("program_id", "name", "state", "curriculum", "mention")
          .innerJoin<IStudent>(
            STUDENT_TABLE,
            `${STUDENT_TABLE}.id`,
            `${STUDENT_PROGRAM_TABLE}.student_id`
          )
          .orderBy("last_term", "desc")
          .where({ student_id, program_id })
          .first();
      })
    );
  },
  {
    cacheKeyFn: ({ student_id, program_id }) => {
      return student_id + program_id;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const StudentViaProgramsDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    return await Promise.all(
      student_ids.map((student_id) => {
        return StudentProgramTable()
          .select("program_id", "name", "state", "curriculum", "mention")
          .innerJoin<IStudent>(
            STUDENT_TABLE,
            `${STUDENT_TABLE}.id`,
            `${STUDENT_PROGRAM_TABLE}.student_id`
          )
          .orderBy("last_term", "desc")
          .where({ student_id })
          .first();
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentLastProgramDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    return await Promise.all(
      student_ids.map((student_id) => {
        return StudentProgramTable()
          .select("*")
          .orderBy("last_term", "desc")
          .where({
            student_id,
          })
          .first();
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentProgramsDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    return await Promise.all(
      student_ids.map((student_id) => {
        return StudentProgramTable().distinct("program_id").where({
          student_id,
        });
      })
    );
  },
  {
    cacheMap: new LRUMap(5000),
  }
);

export const StudentTermsDataLoader = new DataLoader(
  async (
    student_ids: readonly {
      student_id: string;
      programs?: Pick<IProgram, "id">[];
    }[]
  ) => {
    return await Promise.all(
      student_ids.map(async ({ student_id, programs }) => {
        if (!programs) {
          programs = (await StudentProgramsDataLoader.load(student_id)).map(
            ({ program_id }) => {
              return { id: program_id };
            }
          );
        }

        const studentTermData = await StudentTermTable()
          .select("*")
          .where({ student_id })
          .whereIn(
            "program_id",
            programs.map(({ id }) => id)
          )
          .orderBy([
            { column: "year", order: "desc" },
            { column: "term", order: "desc" },
          ]);
        for (const studentTerm of studentTermData) {
          TermDataLoader.prime(studentTerm.id, studentTerm);
        }
        return studentTermData;
      })
    );
  },
  {
    cacheKeyFn: ({ student_id, programs }) => {
      return programs ? student_id + programs[0]?.id : student_id;
    },
    cacheMap: new LRUMap(1000),
  }
);

/*New dataLoader that receive program_id and student_id as parameters */
export const StudentStartYearDataLoader = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ student_id, program_id }) => {
        return StudentProgramTable()
          .select("*")
          .orderBy("last_term", "desc")
          .where({
            student_id,
            program_id,
          })
          .first();
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentGraduationTermDataloader = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ student_id, program_id }) => {
        return StudentProgramTable()
          .select("graduation_term")
          .where({
            student_id,
            program_id,
          })
          .first();
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentCreditsPassedDataloader = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ student_id, program_id }) => {
        return StudentProgramTable()
          .select("credits_passed")
          .where({
            student_id,
            program_id,
          })
          .first();
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const GroupedAdmissionDataLoader = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(async ({ student_id, program_id }) => {
        const dataDict: Dictionary<IStudentAdmission | undefined> = keyBy(
          await StudentAdmissionTable()
            .where("student_id", student_id)
            .where("program_id", program_id),
          "student_id"
        );
        return dataDict[student_id];
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentAdmissionDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    const dataDict: Dictionary<IStudentAdmission | undefined> = keyBy(
      await StudentAdmissionTable().whereIn("student_id", student_ids),
      "student_id"
    );
    return student_ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentDropoutDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    const dataDict: Dictionary<IStudentDropout | undefined> = keyBy(
      await StudentDropoutTable().whereIn("student_id", student_ids),
      "student_id"
    );
    return student_ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentEmployedDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    const dataDict: Dictionary<IStudentEmployed | undefined> = keyBy(
      await StudentEmployedTable().whereIn("student_id", student_ids),
      "student_id"
    );
    return student_ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentListDataLoader = new DataLoader(
  async (program_ids: readonly string[]) => {
    return await Promise.all(
      program_ids.map((program_id) => {
        return StudentProgramTable()
          .select("id", "name", "state", "last_term")
          .rightJoin<IStudent>(
            STUDENT_TABLE,
            `${STUDENT_PROGRAM_TABLE}.student_id`,
            `${STUDENT_TABLE}.id`
          )
          .where({
            program_id,
          });
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentListFilterDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
      grouped: boolean;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum, grouped }) => {
        if (curriculum === "" && grouped) {
          //To do refactoring, number students complementary info match semesters
          return StudentProgramTable()
            .select("*")
            .join<IStudent>(
              STUDENT_TABLE,
              `${STUDENT_PROGRAM_TABLE}.student_id`,
              `${STUDENT_TABLE}.id`
            )
            .where({
              program_id,
            });
        } else {
          return StudentProgramTable()
            .select("*")
            .join<IStudent>(
              STUDENT_TABLE,
              `${STUDENT_PROGRAM_TABLE}.student_id`,
              `${STUDENT_TABLE}.id`
            )
            .where({
              program_id,
              curriculum,
            });
        }
      })
    );
  },
  {
    cacheKeyFn: ({ program_id, curriculum }) => {
      return program_id + curriculum;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const RiskNotificationDataLoader = new DataLoader(
  async (
    keys: readonly {
      student_id: string;
      risk_type: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ student_id, risk_type }) => {
        return RiskNotificationTable().select("*").where({
          student_id,
          risk_type,
        });
      })
    );
  },
  {
    cacheKeyFn: ({ student_id, risk_type }) => {
      return student_id + risk_type;
    },
    cacheMap: new LRUMap(1000),
  }
);
