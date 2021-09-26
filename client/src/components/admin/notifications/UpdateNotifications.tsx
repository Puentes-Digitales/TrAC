import React, { cloneElement, FC, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Grid, Icon, Label, Modal } from "semantic-ui-react";
import { Confirm } from "../../../components/Confirm";
import { isEqual } from "lodash";
import { useColorMode } from "@chakra-ui/react";

import { useNotificationsDataAdminQuery } from "../../../graphql";

export const UpdateNotifications: FC<{
  notification: { id: number; email: string; content: string; date: Date };
  children: JSX.Element;
}> = ({ children, notification }) => {
  const [open, setOpen] = useState(false);
  const { data: allNotifications } = useNotificationsDataAdminQuery();
  console.log(allNotifications);

  const [selectedNotifications, setSelectedNotifications] = useState(
    notification.id
  );
  console.log(selectedNotifications, setSelectedNotifications);

  useEffect(() => {
    setSelectedNotifications(notification.id);
  }, [notification.id]);

  const didNotChange = useMemo(() => {
    return isEqual(selectedNotifications, notification.id);
  }, [selectedNotifications, notification]);
  const isDark = useColorMode().colorMode === "dark";

  return (
    <Modal
      trigger={cloneElement(children, {
        onClick: () => setOpen(true),
      })}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
    >
      <Modal.Header>
        {notification.id}
        {notification.email}
        {notification.content}
        {notification.date}
      </Modal.Header>
      <Modal.Content>
        <Grid centered>
          <Grid.Row>
            <Confirm
              header="Are you sure you want to reset all the form fields?"
              content="Any changes in those fields will be lost"
            >
              <Button
                inverted={isDark}
                circular
                icon
                secondary
                disabled={didNotChange}
                onClick={() => {
                  setSelectedNotifications(notification.id);
                }}
              >
                <Icon circular name="redo" />
              </Button>
            </Confirm>
          </Grid.Row>
          <Grid.Row>
            <Label size="big">{notification.email}</Label>
          </Grid.Row>
          <Grid.Row>
            <Label size="big">Programs</Label>
            <Dropdown
              placeholder="Add programs"
              fluid
              selection
              multiple
              search
              options={
                allNotifications?.NotificationsData.map(({ id: value }) => ({
                  text: value,
                  value,
                })) ?? []
              }
              onChange={(_, { value }) => console.log("useless 3")}
              value={selectedNotifications}
            />
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          icon
          labelPosition="left"
          primary
          onClick={() => {
            console.log("useless");
          }}
          disabled={didNotChange}
        >
          <Icon name="save outline" />
          Save
        </Button>

        <Confirm header="Are you sure you want to remove all the programs of this user?">
          <Button
            type="button"
            icon
            labelPosition="left"
            color="red"
            onClick={() => {
              console.log("useless_2");
              setOpen(false);
            }}
          >
            <Icon name="remove circle" />
            Remove
          </Button>
        </Confirm>
      </Modal.Actions>
    </Modal>
  );
};
