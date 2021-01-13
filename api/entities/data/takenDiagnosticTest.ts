import { Field, Int, ObjectType, registerEnumType } from "type-graphql";

import { StateCourse } from "../../../client/constants";
import { BandColor, DistributionValue } from "./distribution";

import type { DiagnosticTest } from "./diagnosticTest";
registerEnumType(StateCourse, {
  name: "StateCourse",
  description: "Possible states of a taken course",
});

@ObjectType({ simpleResolvers: true })
export class TakenDiagnosticTest
  implements Pick<DiagnosticTest, "code" | "name"> {
  // student_diagnostic_test => id
  @Field(() => Int)
  id: number;

  // student_diagnostic_test => diagnostic_test_taken
  @Field()
  code: string;

  // course => name | helper field, probably isn't needed
  @Field()
  name: string;

  // student_diagnostic_test => registration
  @Field()
  registration: string;

  // student_diagnostic_test => grade
  @Field()
  grade: number;

  // student_diagnostic_test => state
  @Field(() => StateCourse)
  state: StateCourse;

  // student_diagnostic_test => p_group
  @Field(() => Int)
  parallelGroup: number;

  // diagnostic_test_stats => histogram , histogram_labels
  @Field(() => [DistributionValue])
  currentDistribution: DistributionValue[];

  // LOGIC, CHOOSE ACCORDINGLY => diagnostic_test_stats => color_bands
  @Field(() => [BandColor])
  bandColors: BandColor[];
}
