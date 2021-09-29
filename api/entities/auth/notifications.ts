import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Notifications {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  content: string;

  @Field()
  date: string;
}
