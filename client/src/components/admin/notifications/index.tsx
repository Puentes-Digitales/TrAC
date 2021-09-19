import React, { FC, useState } from "react";
import { Button, Icon, Message, MessageHeader } from "semantic-ui-react";
import { useNotificateUsersAdminMutation } from "../../../graphql";
import { Stack } from "@chakra-ui/react";
import { Confirm } from "../../Confirm";
import { whiteSpacePreLine, width50percent } from "../../../utils/cssConstants";

export const AdminNotifications: FC = () => {
  const [openMailMessage, setOpenMailMessage] = useState(false);

  const [
    mailNotificationUsers,
    {
      data: dataNotificationUsers,
      error: errorNotificationUsers,
      loading: loadingNotificationUsers,
    },
  ] = useNotificateUsersAdminMutation();

  return (
    <Stack alignItems="center" spacing="1pm">
      <Stack mt="10px">
        <Confirm
          header="Are you sure you want to send a Notification email to all users"
          content="It will be sent a Notification about new updates in TrAC-FID data "
        >
          <Button
            color="orange"
            onClick={async () => {
              try {
                mailNotificationUsers();
              } catch (err) {
                console.error(JSON.stringify(err, null, 2));
              }
              setOpenMailMessage(true);
            }}
            loading={loadingNotificationUsers}
            disabled={loadingNotificationUsers}
          >
            <Icon name="mail" />
            Send notification
          </Button>
        </Confirm>
      </Stack>
      {openMailMessage && (
        <Stack>
          <Message
            success={!errorNotificationUsers ? true : undefined}
            error={!!errorNotificationUsers ? true : undefined}
            icon
            compact
            size="small"
            css={whiteSpacePreLine}
          >
            <Icon name="close" onClick={() => setOpenMailMessage(false)} />
            <Message.Content>
              {errorNotificationUsers && (
                <Message.Header>Error!</Message.Header>
              )}
              {errorNotificationUsers && errorNotificationUsers.message}
              {dataNotificationUsers &&
              dataNotificationUsers.NotificateUsers.length > 0 ? (
                <Message.List>Done</Message.List>
              ) : (
                "Notificating"
              )}
            </Message.Content>
          </Message>
        </Stack>
      )}
    </Stack>
  );
};
