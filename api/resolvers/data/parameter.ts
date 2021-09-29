import { Resolver, Query, Authorized } from "type-graphql";
import { ParameterTable } from "../../db/tables";

import { Parameter } from "../../entities/data/parameter";

@Resolver(() => Parameter)
export class ParameterResolver {
  @Authorized()
  @Query(() => [Parameter])
  async parameters() {
    return await ParameterTable().select("*");
  }
}
