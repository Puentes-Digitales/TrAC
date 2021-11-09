import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class GroupedComplementary {
  @Field()
  program_id: string;

  @Field()
  curriculum: string;

  @Field()
  type_admission: string;

  @Field()
  cohort: string;

  @Field()
  total_students: number;

  @Field({ nullable: true })
  university_degree_rate: number;

  @Field()
  retention_rate: number;

  @Field({ nullable: true })
  average_time_university_degree?: number;

  @Field({ nullable: true })
  timely_university_degree_rate: number;

  @Field({ nullable: true })
  inactive_time_rate: number;
}
