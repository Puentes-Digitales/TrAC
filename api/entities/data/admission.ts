import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Admission {
  @Field()
  active: boolean;

  @Field()
  type_admission: string;

  @Field({ nullable: true })
  initial_evaluation: number;

  @Field({ nullable: true })
  final_evaluation?: number;
}
