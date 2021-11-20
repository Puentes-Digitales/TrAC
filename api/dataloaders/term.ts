import DataLoader from "dataloader";
import { Dictionary, keyBy } from "lodash";
import { LRUMap } from "lru_map";

import {
  IStudentTerm,
  ProgramTable,
  StudentCourseTable,
  StudentTermTable,
  StudentExternalEvaluationTable,
  IProgramStructure,
  PROGRAM_STRUCTURE_TABLE,
  STUDENT_COURSE_TABLE,
} from "../db/tables";
import { StudentViaProgramsDataLoader } from "../dataloaders/student";
export const TermDataLoader = new DataLoader(
  async (ids: readonly number[]) => {
    const dataDict: Dictionary<IStudentTerm | undefined> = keyBy(
      await StudentTermTable().select("*").whereIn("id", ids),
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

export const ProgramGradeDataLoader = new DataLoader(
  async (ids: readonly number[]) => {
    return await Promise.all(
      ids.map(async (id) => {
        return (
          await ProgramTable()
            .select("last_gpa")
            .where(
              "id",
              StudentTermTable().select("program_id").where({ id }).first()
            )
            .first()
        )?.last_gpa;
      })
    );
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const TakenCoursesDataLoader = new DataLoader(
  async (
    ids: readonly {
      year: number;
      term: number;
      student_id: string;
      mention: string;
    }[]
  ) => {
    return await Promise.all(
      ids.map(async ({ year, term, student_id, mention }) => {
        const studentData = await StudentViaProgramsDataLoader.load(student_id);
        let mentionStudent: string = studentData?.mention ?? "";
        let currriculumStudent: string = studentData?.curriculum ?? "";
        if (mentionStudent != "") {
          const takenCoursesData = await StudentCourseTable()
            .select(
              `${STUDENT_COURSE_TABLE}.id`,
              "course_taken",
              "course_equiv",
              "elect_equiv",
              "mention"
            )
            .innerJoin<IProgramStructure>(PROGRAM_STRUCTURE_TABLE, function () {
              this.on(
                `${PROGRAM_STRUCTURE_TABLE}.course_id`,
                `${STUDENT_COURSE_TABLE}.course_taken`
              );
              this.orOn(
                `${PROGRAM_STRUCTURE_TABLE}.course_id`,
                `${STUDENT_COURSE_TABLE}.elect_equiv`
              );
              this.orOn(
                `${PROGRAM_STRUCTURE_TABLE}.course_id`,
                `${STUDENT_COURSE_TABLE}.course_equiv`
              );
            })
            .where({
              year,
              term,
              student_id,
              mention: mentionStudent,
              curriculum: currriculumStudent,
            })
            .orWhere({
              year,
              term,
              student_id,
              mention: "",
              curriculum: currriculumStudent,
            })
            .orderBy([
              { column: "course_taken", order: "desc" },
              { column: "year", order: "desc" },
              { column: "term", order: "desc" },
              { column: "state", order: "asc" },
            ]);
          return takenCoursesData;
        } else {
          const takenCoursesData = await StudentCourseTable()
            .select("id", "course_taken", "course_equiv", "elect_equiv")
            .where({
              year,
              term,
              student_id,
            })

            .orderBy([
              { column: "course_taken", order: "desc" },
              { column: "year", order: "desc" },
              { column: "term", order: "desc" },
              { column: "state", order: "asc" },
            ]);
          return takenCoursesData;
        }
      })
    );
  },
  {
    cacheKeyFn: ({ year, term, student_id }) => {
      return year + student_id + term;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const TakenExternalEvaluationDataLoader = new DataLoader(
  async (
    ids: readonly { year: number; term: number; student_id: string }[]
  ) => {
    return await Promise.all(
      ids.map(async ({ year, term, student_id }) => {
        const takenExternalEvaluationsData = await StudentExternalEvaluationTable()
          .select("id", "external_evaluation_taken")
          .where({
            year,
            term,
            student_id,
          })
          .orderBy([
            { column: "external_evaluation_taken", order: "desc" },
            { column: "year", order: "desc" },
            { column: "term", order: "desc" },
            { column: "state", order: "asc" },
          ]);
        return takenExternalEvaluationsData;
      })
    );
  },
  {
    cacheKeyFn: ({ year, term, student_id }) => {
      return year + student_id + term;
    },
    cacheMap: new LRUMap(1000),
  }
);
