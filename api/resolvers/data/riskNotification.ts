import { Resolver, Query, Authorized, Arg } from "type-graphql";
import { RiskNotificationTable } from "../../db/tables";

import { riskNotification } from "../../entities/data/riskNotification";

@Resolver(() => riskNotification)
export class riskNotificationResolver {
  @Authorized()
  @Query(() => [riskNotification])
  async riskNotification(
    @Arg("program_id") program_id: string,
    @Arg("risk_type") risk_type: string
  ) {
    var riskQuery = await RiskNotificationTable().select("*").where({
      program_id: program_id,
      risk_type: risk_type,
    });
    return riskQuery;
  }
}
