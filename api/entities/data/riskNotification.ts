import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class riskNotification {
  @Field()
  student_id: string;

  @Field()
  course_id: string;

  @Field()
  program_id: string;

  @Field()
  curriculum: string;

  @Field()
  risk_type: string;

  @Field()
  details: string;

  @Field()
  notified: boolean;
}
