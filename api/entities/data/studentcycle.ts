import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class StudentCycle {
  @Field()
  n_courses_bachelor: number;

  @Field()
  n_passed_courses_bachelor: number;

  @Field()
  n_courses_licentiate: number;

  @Field()
  n_passed_courses_licentiate: number;
}
