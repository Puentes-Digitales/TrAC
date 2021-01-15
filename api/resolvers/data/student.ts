import { uniq } from "lodash";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import {
  defaultUserType,
  PROGRAM_NOT_FOUND,
  STUDENT_LIST_UNAUTHORIZED,
  STUDENT_NOT_FOUND,
  UserType,
} from "../../../client/constants";
import {
  StudentAdmissionDataLoader,
  StudentDropoutDataLoader,
  StudentEmployedDataLoader,
  StudentLastProgramDataLoader,
  StudentListDataLoader,
  StudentProgramsDataLoader,
  StudentTermsDataLoader,
  StudentViaProgramsDataLoader,
} from "../../dataloaders/student";

import { AllCoursesOfProgramCurriculumDataLoader } from "../../dataloaders/foreplan";
import {
  StudentBachillerCourseDataLoader,
  StudentBachillerApprovedCourseDataLoader,
  StudentLicentiateApprovedCourseDataLoader,
  StudentLicentiateCourseDataLoader,
} from "../../dataloaders/studentCycle";
import { StudentProgramTable, UserProgramsTable } from "../../db/tables";
import { Student } from "../../entities/data/student";
import { anonService } from "../../services/anonymization";
import { assertIsDefined } from "../../utils/assert";

import type { $PropertyType } from "utility-types";

import type { IContext } from "../../interfaces";
import type { Dropout } from "../../entities/data/dropout";
import type { Admission } from "../../entities/data/admission";
import type { Employed } from "../../entities/data/employed";
import type { PartialProgram } from "./program";
import type { PartialTerm } from "./term";

export type PartialStudent = Pick<Student, "id" | "name" | "state"> & {
  programs?: PartialProgram[];
  curriculums?: string;
  program?: string;
};
@Resolver(() => Student)
export class StudentResolver {
  @Authorized()
  @Mutation(() => Student, { nullable: true })
  async student(
    @Ctx() { user }: IContext,
    @Arg("student_id", { nullable: true })
    student_id?: string,
    @Arg("program_id", { nullable: true })
    program_id?: string
  ): Promise<PartialStudent | null> {
    assertIsDefined(user, `Error on authorization context`);

    const hola = await StudentBachillerCourseDataLoader.load({
      program_id: "1708",
      curriculum: "2017",
    });

    console.log(
      await StudentBachillerApprovedCourseDataLoader.load({
        program_id: "1708",
        curriculum: "2015",
        student_id: "6fdb8a7f5bbaf0c68dbca0f5462e866a",
      })
    );

    console.log(hola[0]["count"]);

    if (defaultUserType(user.type) === UserType.Student) {
      const student_id = await anonService.getAnonymousIdOrGetItBack(
        user.student_id
      );

      const studentData = await StudentViaProgramsDataLoader.load(student_id);
      console.log(
        "hola2",
        await AllCoursesOfProgramCurriculumDataLoader.load({
          program_id: "1708",
          curriculum: "2017",
        })
      );

      assertIsDefined(studentData, STUDENT_NOT_FOUND);

      return {
        id: student_id,
        name: studentData.name,
        state: studentData.state,
        programs: [{ id: studentData.program_id }],
        curriculums: studentData.curriculum,
        program: studentData.program_id,
      };
    } else {
      assertIsDefined(student_id, STUDENT_NOT_FOUND);
      assertIsDefined(program_id, PROGRAM_NOT_FOUND);

      if (student_id === "") {
        return null;
      }

      student_id = await anonService.getAnonymousIdOrGetItBack(student_id);

      const AuthenticatedUserPrograms = await UserProgramsTable()
        .select("program")
        .where({
          email: user.email,
          program: program_id,
        });

      const IsAuthorized = await StudentProgramTable()
        .select("program_id")
        .where({ student_id })
        .whereIn(
          "program_id",
          AuthenticatedUserPrograms.map(({ program }) => program)
        )
        .first();

      assertIsDefined(IsAuthorized, STUDENT_NOT_FOUND);

      const studentData = await StudentViaProgramsDataLoader.load(student_id);

      assertIsDefined(studentData, STUDENT_NOT_FOUND);

      return {
        id: student_id,
        name: studentData.name,
        state: studentData.state,
        programs: [{ id: program_id }],
        curriculums: studentData.curriculum,
        program: studentData.program_id,
      };
    }
  }

  @Authorized()
  @Query(() => [Student])
  async students(
    @Ctx() { user }: IContext,
    @Arg("program_id") program_id: string,
    @Arg("last_n_years", () => Int, { defaultValue: 2 }) last_n_years: number
  ): Promise<PartialStudent[]> {
    assertIsDefined(user, `Error on authorization context`);

    const IsAuthorized = await UserProgramsTable()
      .select("program")
      .where({
        email: user.email,
        program: program_id,
      })
      .first();

    assertIsDefined(IsAuthorized, STUDENT_LIST_UNAUTHORIZED);

    const studentList = await StudentListDataLoader.load(program_id);

    const sinceNYear = new Date().getFullYear() - last_n_years;
    const filteredStudentList = studentList.filter(({ last_term }) => {
      return (last_term / 10 || 0) >= sinceNYear;
    });

    return filteredStudentList;
  }

  @FieldResolver()
  async programs(
    @Root() { id, programs }: PartialStudent
  ): Promise<PartialProgram[]> {
    if (programs) {
      return programs;
    }

    return (await StudentProgramsDataLoader.load(id)).map(({ program_id }) => {
      return {
        id: program_id,
      };
    });
  }

  @FieldResolver()
  async curriculums(
    @Root() { id, programs }: PartialStudent
  ): Promise<$PropertyType<Student, "curriculums">> {
    return uniq(
      (await StudentTermsDataLoader.load({ student_id: id, programs })).map(
        ({ curriculum }) => curriculum
      )
    );
  }

  @FieldResolver()
  async start_year(
    @Root() { id }: PartialStudent
  ): Promise<$PropertyType<Student, "start_year">> {
    return (await StudentLastProgramDataLoader.load(id))?.start_year ?? 0;
  }

  @FieldResolver()
  async mention(
    @Root() { id }: PartialStudent
  ): Promise<$PropertyType<Student, "mention">> {
    return (await StudentLastProgramDataLoader.load(id))?.mention ?? "";
  }

  @FieldResolver()
  async progress(
    @Root() { id }: PartialStudent
  ): Promise<$PropertyType<Student, "progress">> {
    return (await StudentLastProgramDataLoader.load(id))?.completion ?? -1;
  }

  @FieldResolver()
  async terms(
    @Root() { id, programs }: PartialStudent
  ): Promise<PartialTerm[]> {
    assertIsDefined(
      id,
      `student id needs to be available for Student field resolvers`
    );

    return await StudentTermsDataLoader.load({ student_id: id, programs });
  }

  @FieldResolver()
  async dropout(@Root() { id }: PartialStudent): Promise<Dropout | undefined> {
    assertIsDefined(
      id,
      `student id needs to be available for Student field resolvers`
    );

    return await StudentDropoutDataLoader.load(id);
  }

  @FieldResolver()
  async admission(
    @Root() { id }: PartialStudent
  ): Promise<Admission | undefined> {
    assertIsDefined(
      id,
      `student id needs to be available for Student field resolvers`
    );

    return await StudentAdmissionDataLoader.load(id);
  }

  @FieldResolver()
  async employed(
    @Root() { id }: PartialStudent
  ): Promise<Employed | undefined> {
    assertIsDefined(
      id,
      `student id needs to be available for Student field resolvers`
    );

    return await StudentEmployedDataLoader.load(id);
  }

  @FieldResolver()
  async n_courses_bachelor(
    @Root() { id, programs, curriculums }: PartialStudent
  ): Promise<$PropertyType<Student, "n_courses_bachelor">> {
    const n_courses = await StudentBachillerCourseDataLoader.load({
      program_id: programs![0]["id"],
      curriculum: curriculums!,
    });
    return Number(n_courses[0]["count"]);
  }

  @FieldResolver()
  async n_passed_courses_bachelor(
    @Root() { id, programs, curriculums }: PartialStudent
  ): Promise<$PropertyType<Student, "n_courses_bachelor">> {
    const n_passed = await StudentBachillerApprovedCourseDataLoader.load({
      program_id: programs![0]["id"],
      curriculum: curriculums!,
      student_id: id,
    });
    return Number(n_passed[0]["count"]);
  }

  @FieldResolver()
  async n_courses_licentiate(
    @Root() { id, programs, curriculums }: PartialStudent
  ): Promise<$PropertyType<Student, "n_courses_bachelor">> {
    const nlicentiate = await StudentLicentiateCourseDataLoader.load({
      program_id: programs![0]["id"],
      curriculum: curriculums!,
    });
    return Number(nlicentiate[0]["count"]);
  }

  @FieldResolver()
  async n_passed_courses_licentiate(
    @Root() { id, programs, curriculums }: PartialStudent
  ): Promise<$PropertyType<Student, "n_courses_bachelor">> {
    const nlicentiateapproved = await StudentLicentiateApprovedCourseDataLoader.load(
      {
        program_id: programs![0]["id"],
        curriculum: curriculums!,
        student_id: id,
      }
    );
    return Number(nlicentiateapproved[0]["count"]);
  }
}
