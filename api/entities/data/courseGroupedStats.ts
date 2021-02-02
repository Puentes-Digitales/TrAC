import { Field, ObjectType } from "type-graphql";
import { DistributionValue, BandColor } from "./distribution";

@ObjectType()
export class CourseGroupedStats {
  @Field()
  id: string;

  @Field()
  program_id: string;

  @Field()
  curriculum: string;

  @Field()
  type_admission: string;

  @Field()
  cohort: string;

  @Field()
  n_total: number;

  @Field()
  n_finished: number;

  @Field()
  n_pass: number;

  @Field()
  n_fail: number;

  @Field()
  n_drop: number;

  @Field(() => [DistributionValue])
  distribution: DistributionValue[];

  @Field(() => [BandColor])
  color_bands: BandColor[];
}
