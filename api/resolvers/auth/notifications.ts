/*import { useContext } from "react";*/
import { Arg, Mutation, Resolver, Query, Authorized } from "type-graphql";
import {
  NotificationsDataTable,
  UserTable,
  ParameterTable,
  /*MessageContentTable,*/
} from "../../db/tables";
import { GraphQLJSONObject } from "graphql-type-json";
import { ADMIN } from "../../constants";
import { NotificationMail } from "../../services/mail";
import { sendMail } from "../../services/mail";
import { Notifications } from "../../entities/auth/notifications";

import { format } from "date-fns-tz";

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
    @Arg("body") body: string
  ): Promise<Record<string, any>> {
    const users = await UserTable().select("*");
    const NotificationMailResults: Record<string, any>[] = [];

    const parametersDate = await ParameterTable().distinctOn("loading_type");

    const dateFormatStringTemplate = "dd-MM-yyyy";

    const dates = parametersDate.map(({ id, loading_type, loading_date }) => {
      const date = format(new Date(loading_date), dateFormatStringTemplate, {
        timeZone: "America/Santiago",
      });
      return { id, loading_type, date };
    });

    const parametersInfo = JSON.stringify(dates);

    for (const { email, type } of users) {
      const emailParameters = await NotificationsDataTable()
        .select("parameters")
        .where({ email: email })
        .first()
        .orderBy("id", "desc");
      if (
        !(emailParameters?.parameters === parametersInfo) &&
        type === "Director"
      ) {
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

    const msg = NotificationMail({
      email: email,
      header: data.header,
      footer: data.footer,
      subject: data.subject,
      body: data.body,
      closing: data.closing,
      farewell: data.farewell,
      parameters: parameters,
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
