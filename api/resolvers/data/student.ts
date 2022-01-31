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
  StudentListFilterDataLoader,
  StudentTermsDataLoader,
  StudentViaProgramsDataLoader,
  StudentViaProgramsDataLoader2,
} from "../../dataloaders/student";
import {
  StudentListCyclesDataLoader,
  StudentCourseListDataLoader,
  StudentCycleApprovedCourseDataLoader,
} from "../../dataloaders/studentCycle";
import {
  CourseGroupedStatsTable,
  StudentProgramTable,
  UserProgramsTable,
} from "../../db/tables";
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

    if (defaultUserType(user.type) === UserType.Student) {
      const student_id = await anonService.getAnonymousIdOrGetItBack(
        user.student_id
      );

      const studentData = await StudentViaProgramsDataLoader.load(student_id);

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

      const studentData = await StudentViaProgramsDataLoader2.load({
        student_id: student_id,
        program_id: program_id,
      });

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
    //console.log(filteredStudentList);

    var anonID = filteredStudentList?.map((student) => student.id);
    var objAnonID = { Listado: anonID };
    var stObjAnonID = JSON.stringify(objAnonID);
    console.log("stObjAnonID", stObjAnonID);
    var listRut = await anonService.getInfoSessionIdResult(stObjAnonID);
    console.log("listRurAsString", listRut);
    console.log("Arriba como string, a continuacion listRut as object");
    console.log(listRut);

    if (listRut === stObjAnonID) {
      return filteredStudentList;
    } else {
      /*  //mock way
      var mock = [{ Orden: 0, Rut: "19223242-4",},{ Orden: 1,Rut: "19994523-0",},{Orden: 2,Rut: "16492338-8",},{Orden: 3,Rut: "21234543-8",}];
      filteredStudentList.forEach(function (std, index) {
        std.name = mock[index % 4]?.Rut || "";
      });
      */
      let strListRut = JSON.stringify(listRut);
      console.log("strListRut", strListRut);
      let desListRut = JSON.parse(strListRut); //warning if is undefiend
      console.log("desListRut", desListRut);

      filteredStudentList.forEach(function (std, index) {
        //toDo change name to rut
        console.log("std", std);
        console.log("index", index);

        std.name = desListRut[index].Rut;
        console.log("std.name", std.name);
      });
      console.log("filteredStudentList", filteredStudentList);
      return filteredStudentList;
    }
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
  async n_cycles(
    @Root() { program, curriculums }: PartialStudent
  ): Promise<$PropertyType<Student, "n_cycles">> {
    assertIsDefined(
      program,
      `programs id needs to be available for Student field resolvers`
    );
    assertIsDefined(
      curriculums,
      `curriculums id needs to be available for Student field resolvers`
    );

    const total_cycles = await StudentListCyclesDataLoader.load({
      program_id: program,
      curriculum: curriculums,
    });
    const list_cycle = total_cycles.map((d) => d.course_cat);

    return list_cycle;
  }
  @FieldResolver()
  async n_courses_cycles(
    @Root() { program, curriculums, id }: PartialStudent
  ): Promise<$PropertyType<Student, "n_courses_cycles">> {
    assertIsDefined(
      program,
      `programs id needs to be available for Student field resolvers`
    );
    assertIsDefined(
      curriculums,
      `curriculums id needs to be available for Student field resolvers`
    );
    assertIsDefined(
      id,
      ` id needs to be available for Student field resolvers`
    );
    const total_cycles = await StudentListCyclesDataLoader.load({
      program_id: program,
      curriculum: curriculums,
    });

    const list_cycle = total_cycles.map((d) => d.course_cat);
    const studentData = await StudentViaProgramsDataLoader2.load({
      student_id: id,
      program_id: program,
    });

    let mentionStudent: string = studentData?.mention ?? "";
    const dataCycleStudent = [];

    for (const cycle of list_cycle) {
      const [n_courses, n_approved_courses] = await Promise.all([
        StudentCourseListDataLoader.load({
          program_id: program,
          curriculum: curriculums,
          course_cat: cycle,
          mention: mentionStudent,
        }),
        StudentCycleApprovedCourseDataLoader.load({
          program_id: program,
          curriculum: curriculums,
          student_id: id,
          course_cat: cycle,
          mention: mentionStudent,
        }),
      ]);
      if (n_courses[0]) dataCycleStudent.push(Number(n_courses[0]["count"]));
      if (n_approved_courses[0])
        dataCycleStudent.push(Number(n_approved_courses[0]["count"]));
    }
    return dataCycleStudent;
  }

  @Authorized()
  @Query(() => [Student])
  async students_filter(
    @Ctx() { user }: IContext,
    @Arg("program_id") program_id: string,
    @Arg("curriculum") curriculum: string,
    @Arg("grouped") grouped: boolean
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

    const studentList = await StudentListFilterDataLoader.load({
      program_id: program_id,
      curriculum: curriculum,
      grouped: grouped,
    });

    return studentList;
  }

  //hard-code , to do: refactoring
  @Query(() => String)
  async groupedSpecialTypesAdmission(): Promise<string | null> {
    let notGroupedEspecialTypesAdmission: string = "";
    const notGroupedEspecialTypesAdmissionQuery = await CourseGroupedStatsTable()
      .distinct("type_admission")
      .where("type_admission", "like", "%ESPECIAL%");
    notGroupedEspecialTypesAdmissionQuery.map((aux) => {
      notGroupedEspecialTypesAdmission =
        notGroupedEspecialTypesAdmission + aux.type_admission;
    });
    const TypeAdmissions = await StudentProgramTable()
      .distinct("type_admission")
      .where("type_admission", "like", "%ESPECIAL%");
    var gropuedEspecialAdmissions: string = "";
    for (const { type_admission } of TypeAdmissions) {
      if (!notGroupedEspecialTypesAdmission?.includes(type_admission)) {
        gropuedEspecialAdmissions = gropuedEspecialAdmissions + type_admission;
      }
    }
    return gropuedEspecialAdmissions;
  }
}
