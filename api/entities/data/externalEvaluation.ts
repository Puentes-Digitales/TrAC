import { Field, Int, ObjectType } from "type-graphql";

import { BandColor, DistributionValue } from "./distribution";

@ObjectType({ simpleResolvers: true })
export class ExternalEvaluation {
  // external_evaluation_structure => id
  @Field(() => Int, {
    description: "ExternalEvaluation-Semester-Curriculum-Program ID ",
  })
  id: number;

  // external_evaluation => id, external_evaluation_structure => external_evaluation_id
  @Field()
  code: string;

  // external_evaluation => name
  @Field()
  name: string;

  // external_evaluation_structure => mention
  @Field()
  mention: string;

  // external_evaluation_stats => histogram , histogram_labels
  @Field(() => [DistributionValue])
  historicalDistribution: DistributionValue[];

  // LOGIC, CHOOSE ACCORDINGLY => external_evaluation_stats => color_bands
  @Field(() => [BandColor])
  bandColors: BandColor[];
}
