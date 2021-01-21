import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Employed {
  @Field()
  employed: boolean;

  @Field({ nullable: true })
  institution: string;

  @Field({ nullable: true })
  educational_system: string;

  @Field({ nullable: true })
  months_to_first_job: number;

  @Field({ nullable: true })
  description: string;
}
