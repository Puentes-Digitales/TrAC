import { Field, Int, ObjectType } from "type-graphql";

import { Course } from "./course";
import { DiagnosticTest } from "./diagnosticTest";

@ObjectType({ simpleResolvers: true })
export class Semester {
  // program_structure => semester
  @Field(() => Int)
  id: number;

  // program_structure => course_id
  @Field(() => [Course])
  courses: Course[];

  // program_structure => Diagnostic_test_id
  @Field(() => [DiagnosticTest])
  diagnostictests: DiagnosticTest[];
}

@ObjectType({ simpleResolvers: true })
export class Curriculum {
  // program_structure => curriculum
  @Field()
  id: string;

  // program_structure => semester
  @Field(() => [Semester])
  semesters: Semester[];
}
@ObjectType({ simpleResolvers: true })
export class Program {
  // program => id
  @Field()
  id: string;

  // program => name
  @Field()
  name: string;

  // program => desc
  @Field()
  desc: string;

  // program => active
  @Field()
  active: boolean;

  // program => last_gpa
  @Field()
  lastGPA: number;

  // program_structure => curriculum
  @Field(() => [Curriculum])
  curriculums: Curriculum[];
}
