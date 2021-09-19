import React, { FC } from "react";
import { Button, Icon } from "semantic-ui-react";
import { useNotificateUsersAdminMutation } from "../../../graphql";
import { Stack } from "@chakra-ui/react";

export const AdminNotifications: FC<{
  loading_date: { id: string; notified: string; loading_date: string[] }[];
}> = ({ loading_date }) => {
  const [
    mailNotificationUsers,
    {
      data: dataNotificationUsers,
      error: errorNotificationUserss,
      loading: loadingNotificationUsers,
    },
  ] = useNotificateUsersAdminMutation();

  return (
    <Stack alignItems="center" spacing="1em">
      <Stack mt="10px">
        <Button
          color="red"
          icon
          labelPosition="left"
          onClick={() => {
            mailNotificationUsers();
            console.log(errorNotificationUserss?.message);
            console.log(dataNotificationUsers);
          }}
          loading={loadingNotificationUsers}
          disabled={loadingNotificationUsers}
        >
          <Icon name="mail" />
          Send notification
        </Button>
      </Stack>
    </Stack>
  );
};
