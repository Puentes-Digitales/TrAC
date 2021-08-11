import DataLoader from "dataloader";
import { defaultsDeep, Dictionary, keyBy, toInteger } from "lodash";

import { LRUMap } from "lru_map";

import {
  IProgram,
  ExternalEvaluationStructureTable,
  ExternalEvaluationGroupedStatsTable,
  ProgramTable,
  StudentProgramTable,
  GroupedComplementaryInformationTable,
  StudentGroupedEmployedTable,
  CourseGroupedStatsTable,
  ProgramStructureTable,
} from "../db/tables";

import type { Curriculum } from "../entities/data/program";
import { getColorBands } from "../utils/colorBands";
export const ProgramDataLoader = new DataLoader(
  async (ids: readonly string[]) => {
    const dataDict: Dictionary<IProgram | undefined> = keyBy(
      await ProgramTable().select("*").whereIn("id", ids),
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

export const StudentProgramDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    return await Promise.all(
      student_ids.map((student_id) => {
        return StudentProgramTable()
          .distinct("program_id", "curriculum", "start_year")
          .where({
            student_id,
          })
          .orderBy("start_year", "desc");
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const ProgramDataByStudentDataLoader = new DataLoader(
  async (keys: readonly { student_id: string; program_id: string }[]) => {
    return await Promise.all(
      keys.map(({ student_id, program_id }) => {
        return ProgramTable()
          .select("id", "name", "desc", "active")
          .where({
            id: program_id,
          })
          .whereIn(
            "id",
            StudentProgramTable().distinct("program_id").where({
              student_id,
            })
          )
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

export const StudentProgramCurriculumsDataLoader = new DataLoader(
  async (student_ids: readonly string[]) => {
    return await Promise.all(
      student_ids.map((student_id) => {
        return StudentProgramTable()
          .distinct("curriculum", "start_year")
          .where({
            student_id,
          })
          .orderBy("start_year", "desc");
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const CurriculumsDataLoader = new DataLoader(
  async (
    keys: readonly { program_id: string; curriculumsIds: Curriculum[] }[]
  ) => {
    return await Promise.all(
      keys.map(async ({ program_id, curriculumsIds }) => {
        const [data, data2] = await Promise.all([
          curriculumsIds
            ? ProgramStructureTable()
                .select("id", "curriculum", "semester", "course_id")
                .where({ program_id })
                .whereIn(
                  "curriculum",
                  curriculumsIds.map(({ id }) => id)
                )
            : ProgramStructureTable()
                .select("id", "curriculum", "semester", "course_id")
                .where({ program_id }),
          curriculumsIds
            ? ExternalEvaluationStructureTable()
                .select(
                  "id",
                  "curriculum",
                  "semester",
                  "external_evaluation_id"
                )
                .where({ program_id })
                .whereIn(
                  "curriculum",
                  curriculumsIds.map(({ id }) => id)
                )
            : ExternalEvaluationStructureTable()
                .select(
                  "id",
                  "curriculum",
                  "semester",
                  "external_evaluation_id"
                )
                .where({ program_id }),
        ]);

        const curriculums = data.reduce<
          Record<
            string /*Curriculum id (program_structure => curriculum)*/,
            {
              id: string /*Curriculum id (program_structure => curriculum)*/;
              semesters: Record<
                number /*Semester id (program_structure => semester) (1-12)*/,
                {
                  id: number /*Semester id (program_structure => semester)*/;
                  courses: {
                    id: number /* Course-semester-curriculum id (program_structure => id) */;
                    code: string /* Course id (program_structure => course_id) */;
                  }[];
                  externalEvaluations: {
                    id: number;
                    code: string;
                  }[];
                }
              >;
            }
          >
        >((acum, { curriculum, semester, course_id, id }) => {
          defaultsDeep(acum, {
            [curriculum]: {
              id: curriculum,
              semesters: {
                [semester]: {
                  id: semester,
                  courses: [],
                  externalEvaluations: [],
                },
              },
            },
          });

          if (acum[curriculum] && acum[curriculum]!.semesters[semester])
            acum[curriculum]!.semesters[semester]!.courses.push({
              id,
              code: course_id,
            });
          return acum;
        }, {});

        for (const curr of Object.values(curriculums)) {
          for (const semester of Object.values(curr.semesters)) {
            for (let index = 0; index < data2.length; ++index) {
              const val = data2[index]!;
              if (val.curriculum === curr.id && val.semester === semester.id) {
                semester.externalEvaluations.push({
                  id: val.id,
                  code: val.external_evaluation_id,
                });
                data2.splice(index, 1);
                index--;
              } else if (val.semester === 0) {
                /* TODO: generalize, reorder for's  */
                Object.assign(curr.semesters, {
                  0: {
                    id: 0,
                    courses: [],
                    externalEvaluations: [
                      {
                        id: val.id,
                        code: val.external_evaluation_id,
                      },
                    ],
                  },
                });
                data2.splice(index, 1);
                index--;
              }
            }
          }
        }

        return Object.values(curriculums).map(({ id, semesters }) => {
          return {
            id,
            semesters: Object.values(semesters).map(
              ({ id, courses, externalEvaluations }) => {
                return {
                  id,
                  courses,
                  externalEvaluations,
                };
              }
            ),
          };
        });
      })
    );
  },
  {
    cacheKeyFn: ({ program_id, curriculumsIds }) => {
      return (
        program_id +
          curriculumsIds
            ?.map(({ id }) => {
              return id;
            })
            .join("") ?? ""
      );
    },
    cacheMap: new LRUMap(50),
  }
);

export const StudentGroupedComplementaryDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id }) => {
        return GroupedComplementaryInformationTable().where({
          program_id: program_id,
        });
      })
    );
  },
  {
    cacheKeyFn: ({ program_id }) => {
      return program_id;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const StudentGroupedEmployedDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id }) => {
        return StudentGroupedEmployedTable().where({
          program_id: program_id,
        });
      })
    );
  },
  {
    cacheKeyFn: ({ program_id }) => {
      return program_id;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const CourseGroupedStatsDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(async ({ program_id }) => {
        const data = await CourseGroupedStatsTable().where({
          program_id: program_id,
        });

        const groupedData = data.map(
          ({ histogram, histogram_labels, color_bands, ...rest }) => {
            const histogramValues = histogram.split(",").map(toInteger);
            const histogramLabels = histogram_labels.split(",");
            const dist = histogramValues.map((value, key) => {
              return {
                label: histogramLabels[key] ?? `${key}`,
                value,
              };
            });
            const colorbands = getColorBands(color_bands);

            return {
              ...rest,
              distribution: dist,
              color_bands: colorbands,
            };
          }
        );
        return groupedData;
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const ExternalEvaluationGroupedStatsDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(async ({ program_id }) => {
        const data = await ExternalEvaluationGroupedStatsTable().where({
          program_id: program_id,
        });

        const groupedData = data.map(
          ({ histogram, histogram_labels, color_bands, ...rest }) => {
            const histogramValues = histogram.split(",").map(toInteger);
            const histogramLabels = histogram_labels.split(",");
            const dist = histogramValues.map((value, key) => {
              return {
                label: histogramLabels[key] ?? `${key}`,
                value,
              };
            });
            const colorbands = getColorBands(color_bands);

            return {
              ...rest,
              distribution: dist,
              color_bands: colorbands,
            };
          }
        );
        return groupedData;
      })
    );
  },
  {
    cacheKeyFn: ({ program_id }) => {
      return program_id;
    },
    cacheMap: new LRUMap(1000),
  }
);
