import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class GroupedComplementary {
  @Field()
  total_students: number;

  @Field()
  university_degree_rate: number;

  @Field()
  retention_rate: number;

  @Field()
  average_time_university_degree?: number;

  @Field()
  timely_university_degree_rate?: number;
}
