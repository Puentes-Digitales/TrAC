/*import { useContext } from "react";*/
import { Arg, Mutation, Resolver, Query, Authorized } from "type-graphql";
import {
  NotificationsDataTable,
  UserTable,
  /*ParameterTable,
  MessageContentTable,*/
} from "../../db/tables";
import { GraphQLJSONObject } from "graphql-type-json";
import { ADMIN } from "../../constants";
import { NotificationMail } from "../../services/mail";
import { sendMail } from "../../services/mail";
import { Notifications } from "../../entities/auth/notifications";

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
    @Arg("parameters") parameters: string
  ): Promise<Record<string, any>> {
    const users = await UserTable().select("email");
    const NotificationMailResults: Record<string, any>[] = [];
    for (const { email } of users) {
      const emailParameters = await NotificationsDataTable()
        .select("parameters")
        .where({ email: email })
        .first()
        .orderBy("id", "desc");
      if (!(emailParameters?.parameters === parameters)) {
        const param = JSON.parse(parameters);
        const externalDate: string = param[3].loading_date;
        const academicDate: string = param[2].loading_date;
        const groupedDate: string = param[0].loading_date;
        const empleabilityDate: string = param[1].loading_date;
        const msg = NotificationMail({
          email: email,
          header: header,
          footer: footer,
          subject: subject,
          body: body,
          closing: closing,
          farewell: farewell,
          external: externalDate,
          academic: academicDate,
          grouped: groupedDate,
          empleability: empleabilityDate,
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
          parameters: parameters,
          counter: counter,
        });
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
    @Arg("counter") counter: number
  ): Promise<Record<string, any>> {
    const data = JSON.parse(content);
    const parameteresDate = JSON.parse(parameters);

    const msg = NotificationMail({
      email: email,
      header: data.header,
      footer: data.footer,
      subject: data.subject,
      body: data.body,
      closing: data.closing,
      farewell: data.farewell,
      external: parameteresDate[3].loading_date,
      academic: parameteresDate[2].loading_date,
      grouped: parameteresDate[0].loading_date,
      empleability: parameteresDate[1].loading_date,
    });

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
