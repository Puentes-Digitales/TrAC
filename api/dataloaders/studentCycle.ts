import DataLoader from "dataloader";
import { LRUMap } from "lru_map";

import {
  IStudentCourse,
  ProgramStructureTable,
  PROGRAM_STRUCTURE_TABLE,
  STUDENT_COURSE_TABLE,
} from "../db/tables";
export const StudentBachillerCourseDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum }) => {
        return ProgramStructureTable().count("course_id").where({
          program_id: program_id,
          curriculum: curriculum,
          course_cat: "bachillerato",
        });
      })
    );
  },

  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentLicentiateCourseDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum }) => {
        return ProgramStructureTable().count("course_id").where({
          program_id: program_id,
          curriculum: curriculum,
          course_cat: "licenciatura",
        });
      })
    );
  },

  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentBachillerApprovedCourseDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
      student_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum, student_id }) => {
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
          })
          .where({
            program_id: program_id,
            curriculum: curriculum,
            course_cat: "bachillerato",
            state: "A",
            student_id: student_id,
          });
      })
    );
  },

  {
    cacheMap: new LRUMap(1000),
  }
);

export const StudentLicentiateApprovedCourseDataLoader = new DataLoader(
  async (
    keys: readonly {
      program_id: string;
      curriculum: string;
      student_id: string;
    }[]
  ) => {
    return await Promise.all(
      keys.map(({ program_id, curriculum, student_id }) => {
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
          })
          .where({
            program_id: program_id,
            curriculum: curriculum,
            course_cat: "licenciatura",
            state: "A",
            student_id: student_id,
          });
      })
    );
  },

  {
    cacheMap: new LRUMap(1000),
  }
);

/*
  select course_id from program_structure WHERE program_id='1708' and curriculum='2015' 
and course_cat='bachillerato';
 */

/* select count(course_id) from program_structure as A join student_course as B on A.course_id=B.course_taken 
and B.state='A' and A.program_id='1708' and A.curriculum='2015' and course_cat='bachillerato' and student_id='6fdb8a7f5bbaf0c68dbca0f5462e866a'
*/
