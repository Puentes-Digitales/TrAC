/*import { useContext } from "react";*/
import { Arg, Mutation, Resolver, Query, Authorized } from "type-graphql";
import {
  NotificationsDataTable,
  UserTable,
  ParameterTable,
  UserProgramsTable,
  RiskNotificationTable,
  ProgramTable,
  /*MessageContentTable,*/
} from "../../db/tables";
import { GraphQLJSONObject } from "graphql-type-json";
import { ADMIN } from "../../constants";
import { NotificationMail, RiskNotificationMail } from "../../services/mail";
import { sendMail } from "../../services/mail";
import { Notifications } from "../../entities/auth/notifications";
import { format } from "date-fns-tz";
/*mport { RiskNotificationMailTest } from "../../services/mail/mail";*/

@Resolver(() => Notifications)
export class NotificationsResolver {
  @Authorized([ADMIN])
  @Mutation(() => [GraphQLJSONObject])
  async NotificateUsers(
    @Arg("header") header: string,
    @Arg("footer") footer: string,
    @Arg("closing") closing: string,
    @Arg("farewell") farewell: string,
    @Arg("subject") subject: string,
    @Arg("body") body: string,
    @Arg("riskTitle") riskTitle: string,
    @Arg("riskBody") riskBody: string,
    @Arg("riskGif") riskGif: string,
    @Arg("riskFooter") riskFooter: string,
    @Arg("riskJSON") riskJSON: string
  ): Promise<Record<string, any>> {
    const users = await UserTable()
      .select("email", "type", "locked")
      .distinctOn("email");
    const NotificationMailResults: Record<string, any>[] = [];
    const parametersDate = await ParameterTable().distinctOn("loading_type");
    const carrerasFID = [
      "1757",
      "1774",
      "1784",
      "1785",
      "1806",
      "1808",
      "1811",
      "1816",
      "1823",
      "1824",
      "1840",
      "1842",
      "1844",
      "4050",
      "4061",
    ];

    const dateFormatStringTemplate = "dd-MM-yyyy";
    const dates = parametersDate.map(({ id, loading_type, loading_date }) => {
      const date = format(new Date(loading_date), dateFormatStringTemplate, {
        timeZone: "America/Santiago",
      });
      return { id, loading_type, date };
    });

    const parametersInfo = JSON.stringify(dates);
    for (const { email, type, locked } of users) {
      var sendNotification = false;
      /*######  Programas del usuario #####*/
      const user_programs = await UserProgramsTable()
        .select("program")
        .where({ email: email });

      var risk_and_programs = [];

      for (const { program } of user_programs) {
        if (carrerasFID.includes(program)) {
          /* ######## contar situaciones de riesgo y tipo por programa######## */
          const risk_types = await RiskNotificationTable()
            .select("risk_type")
            .count("*")
            .where({ program_id: program })
            .andWhere({ notified: false })
            .groupBy("risk_type");
          sendNotification = true;
          if (risk_types != null && risk_types.length) {
            const program_name = await ProgramTable()
              .select("name")
              .where({ id: program });
            risk_and_programs.push({
              program: program_name?.map(({ name }) => {
                return name;
              }),
              risks: risk_types,
            });
          }
          await RiskNotificationTable()
            .where({ program_id: program })
            .update({ notified: false });
        }
      }

      const emailParameters = await NotificationsDataTable()
        .select("parameters")
        .where({ email: email })
        .first()
        .orderBy("id", "desc");

      const risksData = await NotificationsDataTable()
        .select("risks")
        .where({ email: email })
        .first()
        .orderBy("id", "desc");
      const risks_en_JSON = JSON.stringify(risk_and_programs);
      /**######## envio de notificaciones ######## */
      if (
        !(
          emailParameters?.parameters === parametersInfo &&
          (risksData?.risks === risks_en_JSON || risksData?.risks == null)
        ) &&
        type === "Director" &&
        locked === false &&
        sendNotification
      ) {
        if (risk_and_programs.length === 0) {
          const msg = NotificationMail({
            email: email,
            header: header,
            footer: footer,
            subject: subject,
            body: body,
            closing: closing,
            farewell: farewell,
            parameters: parametersInfo,
          });
          const messageContent = {
            header: header,
            footer: footer,
            subject: subject,
            body: body,
            closing: closing,
            farewell: farewell,
          };
          const result = await sendMail({
            to: email,
            message: msg,
            subject: subject,
          });
          NotificationMailResults.push(result);
          const counter = 1;
          await NotificationsDataTable().insert({
            email,
            content: messageContent,
            date: new Date(),
            parameters: parametersInfo,
            counter: counter,
          });
        } else {
          const risks_array = JSON.stringify(risk_and_programs);
          const msg = RiskNotificationMail({
            email: email,
            header: header,
            footer: footer,
            subject: subject,
            body: body,
            closing: closing,
            farewell: farewell,
            parameters: parametersInfo,
            risk_types: risks_array,
            risk_body: riskBody,
            risk_gif: riskGif,
            risk_header: riskTitle,
            risk_footer: riskFooter,
            risk_json: riskJSON,
          });

          const messageContent = {
            header: header,
            footer: footer,
            subject: subject,
            body: body,
            closing: closing,
            farewell: farewell,
            riskBody: riskBody,
            riskTitle: riskTitle,
            riskGif: riskGif,
            riskFooter: riskFooter,
          };
          const result = await sendMail({
            to: email,
            message: msg,
            subject: subject,
          });

          NotificationMailResults.push(result);
          const counter = 1;
          await NotificationsDataTable().insert({
            email,
            content: messageContent,
            date: new Date(),
            parameters: parametersInfo,
            counter: counter,
            risks: risks_array,
          });
        }
      }
    }
    return NotificationMailResults;
  }

  @Authorized([ADMIN])
  @Mutation(() => [GraphQLJSONObject])
  async ReNotificateUsers(
    @Arg("id") id: number,
    @Arg("email") email: string,
    @Arg("content") content: string,
    @Arg("parameters") parameters: string,
    @Arg("counter") counter: number,
    @Arg("risksJSON") risksJSON: string,
    @Arg("risks", { nullable: true }) risks?: string
  ): Promise<Record<string, any>> {
    const data = JSON.parse(content);
    if (risks != "null") {
      var msg = RiskNotificationMail({
        email: email,
        header: data.header,
        footer: data.footer,
        subject: data.subject,
        body: data.body,
        closing: data.closing,
        farewell: data.farewell,
        parameters: parameters,
        risk_types: risks ?? "",
        risk_body: data.riskBody,
        risk_footer: data.riskFooter,
        risk_gif: data.riskGif,
        risk_header: data.riskTitle,
        risk_json: risksJSON,
      });
    } else {
      var msg = NotificationMail({
        email: email,
        header: data.header,
        footer: data.footer,
        subject: data.subject,
        body: data.body,
        closing: data.closing,
        farewell: data.farewell,
        parameters: parameters,
      });
    }
    const ReNotificationMailResults: Record<string, any>[] = [];
    const result = await sendMail({
      to: email,
      message: msg,
      subject: data.subject,
    });

    await NotificationsDataTable()
      .update({ counter: counter + 1 })
      .where({ id: id });

    ReNotificationMailResults.push(result);
    return ReNotificationMailResults;
  }

  @Authorized([ADMIN])
  @Query(() => [Notifications])
  async NotificationsData() {
    return await NotificationsDataTable().select("*");
  }
}
