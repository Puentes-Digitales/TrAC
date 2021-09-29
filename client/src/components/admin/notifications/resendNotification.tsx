import React, { cloneElement, FC, useState } from "react";
import { Icon, Button, Grid, Modal, Message } from "semantic-ui-react";
import { Confirm } from "../../../components/Confirm";
import { useReNotificateUsersAdminMutation } from "../../../graphql";
import { Stack } from "@chakra-ui/react";
import { whiteSpacePreLine } from "../../../utils/cssConstants";

export const ResendNotification: FC<{
  notification: { email: string; content: string };
  children: JSX.Element;
}> = ({ children, notification }) => {
  const [open, setOpen] = useState(false);

  const [
    reMailNotificationUsers,
    {
      data: dataNotificationUsers,
      error: errorNotificationUsers,
      loading: loadingNotificationUsers,
    },
  ] = useReNotificateUsersAdminMutation();

  const [openMailMessage, setOpenMailMessage] = useState(false);

  return (
    <Modal
      trigger={cloneElement(children, {
        onClick: () => setOpen(true),
      })}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
    >
      <Modal.Header>Resend Notification</Modal.Header>
      <Modal.Content>
        <Grid centered>
          <Grid.Row>
            <Stack mt="10px">
              <Confirm
                header="Are you sure you want to resend this Notification email "
                content="It will be sent this Notification "
              >
                <Button
                  color="orange"
                  onClick={async () => {
                    try {
                      reMailNotificationUsers({
                        variables: {
                          content: notification.content,
                          email: notification.email,
                        },
                      });
                    } catch (err) {
                      console.error(JSON.stringify(err, null, 2));
                    }
                    setOpenMailMessage(true);
                  }}
                  loading={loadingNotificationUsers}
                  disabled={loadingNotificationUsers}
                >
                  <Icon name="mail" />
                  ReSend notification
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
                  <Icon
                    name="close"
                    onClick={() => setOpenMailMessage(false)}
                  />
                  <Message.Content>
                    {errorNotificationUsers && (
                      <Message.Header>Error!</Message.Header>
                    )}
                    {errorNotificationUsers && errorNotificationUsers.message}
                    {dataNotificationUsers &&
                    dataNotificationUsers.ReNotificateUsers.length > 0 ? (
                      <Message.List>Done</Message.List>
                    ) : (
                      "Notificating"
                    )}
                  </Message.Content>
                </Message>
              </Stack>
            )}
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions></Modal.Actions>
    </Modal>
  );
};
