import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class GroupedEmployed {
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

  @Field()
  employed_rate: number;

  @Field()
  average_time_job_finding: number;

  @Field()
  employed_rate_educational_system?: number;
}
