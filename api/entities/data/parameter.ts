import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Parameter {
  @Field(() => Int)
  id: number;

  @Field()
  loading_type: string;

  @Field()
  loading_date: Date;
}
