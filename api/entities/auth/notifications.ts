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

@ObjectType()
export class Risk {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;

  @Field()
  content: string;
}

@ObjectType()
export class RiskMessageContent {
  @Field(() => Int)
  id: number;

  @Field(() => [String])
  names: string[];
}
