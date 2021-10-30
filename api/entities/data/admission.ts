import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Admission {
  //  @Field()
  // active: boolean;

  @Field()
  type_admission: string;
}
