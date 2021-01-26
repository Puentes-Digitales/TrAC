import { Field, Int, ObjectType, registerEnumType } from "type-graphql";

import { StateCourse } from "../../../client/constants";
import { BandColor, DistributionValue } from "./distribution";

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

  // student_external_evaluation => registration
  @Field()
  registration: string;

  // student_external_evaluation => grade
  @Field()
  grade: number;

  // student_external_evaluation => state
  @Field(() => StateCourse)
  state: StateCourse;

  // student_external_evaluation => p_group
  @Field(() => Int)
  parallelGroup: number;

  // external_evaluation_stats => histogram , histogram_labels
  @Field(() => [DistributionValue])
  currentDistribution: DistributionValue[];

  // LOGIC, CHOOSE ACCORDINGLY => external_evaluation_stats => color_bands
  @Field(() => [BandColor])
  bandColors: BandColor[];
}
