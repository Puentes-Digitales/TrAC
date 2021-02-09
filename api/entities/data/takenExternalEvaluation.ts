import { Field, Int, ObjectType } from "type-graphql";

import { StateCourse } from "../../../client/constants";

import type { ExternalEvaluation } from "./externalEvaluation";

@ObjectType({ simpleResolvers: true })
export class TakenExternalEvaluation
  implements Pick<ExternalEvaluation, "code" | "name"> {
  // student_external_evaluation => id
  @Field(() => Int)
  id: number;

  // student_external_evaluation => external_evaluation_taken
  @Field()
  code: string;

  // external_evaluation => name | helper field, probably isn't needed
  @Field()
  name: string;

  @Field()
  topic: string;

  // student_external_evaluation => registration
  @Field()
  registration: string;

  // student_external_evaluation => state
  @Field(() => StateCourse)
  state: StateCourse;

  @Field()
  grade: number;
}
