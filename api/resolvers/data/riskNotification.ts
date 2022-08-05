import { Resolver, Query, Authorized, Arg } from "type-graphql";
import { RiskNotificationTable } from "../../db/tables";

import { riskNotification } from "../../entities/data/riskNotification";
import { anonService } from "../../services/anonymization";

@Resolver(() => riskNotification)
export class riskNotificationResolver {
  @Authorized()
  @Query(() => [riskNotification])
  async riskNotification(
    @Arg("program_id") program_id: string,
    @Arg("risk_type") risk_type: string
  ) {
    var riskQuery = await RiskNotificationTable()
      .select("*")
      .where({
        program_id: program_id,
        risk_type: risk_type,
      })
      .orderBy("student_id", "asc");
    if (
      risk_type === "high_drop_rate" ||
      risk_type === "low_passing_rate_courses"
    ) {
      return riskQuery;
    } else {
      var anonID = riskQuery?.map((student) => student.student_id);
      var objAnonID = { Listado: anonID };
      var stObjAnonID = JSON.stringify(objAnonID);
      var listRut = await anonService.getInfoSessionIdResult(stObjAnonID);
      if (listRut === stObjAnonID) {
        return riskQuery;
      } else {
        let strListRut = JSON.stringify(listRut); // stringify listRut before parse
        //console.log("riskNotification strListRut", strListRut); // see stringified list
        let desListRut = JSON.parse(strListRut); //warning if is undefiend
        riskQuery.forEach(function (std, index) {
          // auxDetail = std.details.length > 0 ? std.details : "{}";
          //let objDetails = JSON.parse(auxDetail);
          // = "new"; toDo put the data in details => BD without [] cannot append data in multi arguments
          // std.details = "{rut:" + desListRut[index].Rut + "}";
          console.log("std pre asign", std);
          //std.details = '{"rut":' + desListRut[index % 4].Rut + "}";
          //std.details=""
          if (std.details.length > 0) {
            try {
              var aux = JSON.parse(std.details);
              aux.rut = "" + desListRut[index].Rut;
              std.details = JSON.stringify(aux);
            } catch (error) {
              std.details = '{"rut":"' + desListRut[index].Rut + '"}';
            }
            console.log(std.details);
          } else {
            std.details = '{"rut":"' + desListRut[index].Rut + '"}';
          }
          console.log("std post asign", std);
        });
        return riskQuery;
      }
    }
  }
}
