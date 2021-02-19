import { Field, ObjectType } from "type-graphql";
import { DistributionValue, BandColor } from "./distribution";

@ObjectType()
export class CourseGroupedStats {
  @Field()
  id: number;

  @Field()
  course_id: string;

  @Field()
  program_id: string;

  @Field()
  curriculum: string;

  @Field()
  type_admission: string;

  @Field()
  cohort: string;

  @Field()
  year: number;

  @Field()
  term: number;

  @Field()
  n_students: number;

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
