import { Field, Int, ObjectType } from "type-graphql";

import { Course } from "./course";
import { ExternalEvaluation } from "./externalEvaluation";

@ObjectType({ simpleResolvers: true })
export class Semester {
  // external_evaluation_structure => semester
  @Field(() => Int)
  id: number;

  // external_evaluation_structure => course_id
  @Field(() => [Course])
  courses: Course[];

  // external_evaluation_structure => external_evaluation_id
  @Field(() => [ExternalEvaluation])
  externalEvaluations: ExternalEvaluation[];
}

@ObjectType({ simpleResolvers: true })
export class Curriculum {
  // external_evaluation_structure => curriculum
  @Field()
  id: string;

  // external_evaluation_structure => semester
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

  // external_evaluation_structure => curriculum
  @Field(() => [Curriculum])
  curriculums: Curriculum[];
}
