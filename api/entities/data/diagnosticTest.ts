import { Field, Int, ObjectType } from "type-graphql";

import { BandColor, DistributionValue } from "./distribution";

@ObjectType({ simpleResolvers: true })
export class DiagnosticTest {
  // program_structure => id
  @Field(() => Int, {
    description: "DiagnosticTest-Semester-Curriculum-Program ID ",
  })
  id: number;

  // diagnostic_test => id, program_structure => diagnostic_test_id
  @Field()
  code: string;

  // diagnostic_test => name
  @Field()
  name: string;

  // program_structure => mention
  @Field()
  mention: string;

  // diagnostic_test_stats => histogram , histogram_labels
  @Field(() => [DistributionValue])
  historicalDistribution: DistributionValue[];

  // LOGIC, CHOOSE ACCORDINGLY => diagnostic_test_stats => color_bands
  @Field(() => [BandColor])
  bandColors: BandColor[];
}
