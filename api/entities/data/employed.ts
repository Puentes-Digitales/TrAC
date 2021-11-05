import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Employed {
  @Field({ nullable: true })
  employed: boolean;

  @Field({ nullable: true })
  institution: string;

  @Field({ nullable: true })
  educational_system: boolean;

  @Field({ nullable: true })
  months_to_first_job: number;

  @Field({ nullable: true })
  description: string;
}
