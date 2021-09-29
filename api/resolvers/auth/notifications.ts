/*import { useContext } from "react";*/
import { Arg, Mutation, Resolver, Query, Authorized } from "type-graphql";
import {
  NotificationsDataTable,
  UserTable,
  /*MessageContentTable,*/
} from "../../db/tables";
import { GraphQLJSONObject } from "graphql-type-json";
import { ADMIN } from "../../constants";
import { NotificationMail } from "../../services/mail";
import { sendMail } from "../../services/mail";

import { Notifications } from "../../entities/auth/notifications";
/*import { ConfigContext } from "../../../client/src/context/Config";*/

@Resolver(() => Notifications)
export class NotificationsResolver {
  @Authorized([ADMIN])
  @Mutation(() => [GraphQLJSONObject])
  async NotificateUsers(
    @Arg("header") header: string,
    @Arg("footer") footer: string,
    @Arg("subject") subject: string,
    @Arg("body") body: string
  ): Promise<Record<string, any>> {
    const users = await UserTable().select("email");
    const NotificationMailResults: Record<string, any>[] = [];
    for (const { email } of users) {
      const msg = NotificationMail({
        email: email,
        header: header,
        footer: footer,
        subject: subject,
        body: body,
      });
      const result = await sendMail({
        to: email,
        message: msg,
        subject: subject,
      });
      NotificationMailResults.push(result);
      await NotificationsDataTable().insert({
        email,
        content: msg,
        date: new Date(),
      });
    }
    return NotificationMailResults;
  }

  @Authorized([ADMIN])
  @Mutation(() => [GraphQLJSONObject])
  async ReNotificateUsers(
    @Arg("email") email: string,
    @Arg("content") content: string
  ): Promise<Record<string, any>> {
    const ReNotificationMailResults: Record<string, any>[] = [];
    const result = await sendMail({
      to: email,
      message: content,
      subject: "Novedades en TrAC-FID",
    });
    ReNotificationMailResults.push(result);
    return ReNotificationMailResults;
  }

  @Authorized([ADMIN])
  @Query(() => [Notifications])
  async NotificationsData() {
    return await NotificationsDataTable().select("*");
  }
}
