import { Field, Int, ObjectType } from "type-graphql";

import { Course } from "./course";
import { CourseGroupedStats } from "./courseGroupedStats";
import { ExternalEvaluation } from "./externalEvaluation";
import { ExternalEvaluationGroupedStats } from "./externalEvaluationGroupedStats";

import { GroupedComplementary } from "./groupedComplementary";
import { GroupedEmployed } from "./groupedEmployed";

@ObjectType({ simpleResolvers: true })
export class Semester {
  // program_structure => semester
  @Field(() => Int)
  id: number;

  // program_structure => course_id
  @Field(() => [Course])
  courses: Course[];

  // program_structure => external_evaluation_id
  @Field(() => [ExternalEvaluation])
  externalEvaluations: ExternalEvaluation[];
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

  @Field()
  type_admission: string;

  // program_structure => curriculum
  @Field(() => [Curriculum])
  curriculums: Curriculum[];

  @Field(() => [GroupedComplementary])
  groupedComplementary: GroupedComplementary[];

  @Field(() => [CourseGroupedStats])
  courseGroupedStats: CourseGroupedStats[];

  @Field(() => [GroupedEmployed])
  groupedEmployed: GroupedEmployed[];

  @Field(() => [ExternalEvaluationGroupedStats])
  externalEvaluationGroupedStats: ExternalEvaluationGroupedStats[];
}
