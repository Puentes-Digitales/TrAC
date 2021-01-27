import { Field, ObjectType } from "type-graphql";
import { BandColor } from "./distribution";

@ObjectType()
export class CourseGroupedStats {
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

  @Field()
  histogram: string;

  @Field()
  histogram_labels: string;

  @Field(() => [BandColor])
  color_bands: BandColor[];
}
