import DataLoader from "dataloader";
import { LRUMap } from "lru_map";

import {
  IStudentCourse,
  ProgramStructureTable,
  PROGRAM_STRUCTURE_TABLE,
  STUDENT_COURSE_TABLE,
} from "../db/tables";

export const StudentListCyclesDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum }) => {
        return ProgramStructureTable()
          .distinct("course_cat")
          .whereNot("course_cat", "")
          .whereNot("course_cat", " ")
          .where({
            program_id: program_id,
            curriculum: curriculum,
          })
          .groupBy("course_cat");
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

export const StudentCourseListDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
      course_cat: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum, course_cat }) => {
        return ProgramStructureTable().count("course_id").where({
          program_id: program_id,
          curriculum: curriculum,
          course_cat: course_cat,
        });
      })
    );
  },
  {
    cacheKeyFn: ({ program_id, curriculum, course_cat }) => {
      return program_id + curriculum + course_cat;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const StudentCycleApprovedCourseDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
      student_id: string;
      course_cat: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum, student_id, course_cat }) => {
        return ProgramStructureTable()
          .count("course_id")
          .innerJoin<IStudentCourse>(STUDENT_COURSE_TABLE, function () {
            this.on(
              `${PROGRAM_STRUCTURE_TABLE}.course_id`,
              `${STUDENT_COURSE_TABLE}.course_taken`
            );
            this.orOn(
              `${PROGRAM_STRUCTURE_TABLE}.course_id`,
              `${STUDENT_COURSE_TABLE}.course_equiv`
            );
            this.orOn(
              `${PROGRAM_STRUCTURE_TABLE}.course_id`,
              `${STUDENT_COURSE_TABLE}.elect_equiv`
            );
          })
          .where({
            program_id: program_id,
            curriculum: curriculum,
            course_cat: course_cat,
            state: "A",
            student_id: student_id,
          });
      })
    );
  },
  {
    cacheKeyFn: ({ program_id, curriculum, student_id, course_cat }) => {
      return program_id + curriculum + student_id + course_cat;
    },
    cacheMap: new LRUMap(1000),
  }
);
