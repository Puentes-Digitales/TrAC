import React, { FC, useEffect, useMemo } from "react";
import { Message } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import { Stack, useColorMode } from "@chakra-ui/react";
import { IS_NOT_TEST } from "../../constants";
import { AdminConfig } from "../components/admin/BaseConfig";
import { AdminData } from "../components/admin/data/index";
import { AdminFeedback } from "../components/admin/feedback";
import { AdminMenu } from "../components/admin/Menu";
import { Programs } from "../components/admin/programs";
import { AdminTrack } from "../components/admin/track";
import { AdminNotifications } from "../components/admin/notifications";
import { Users } from "../components/admin/users";
import { LoadingPage } from "../components/Loading";
import { useAllUsersAdminQuery } from "../graphql";
import { useUser } from "../utils/useUser";
import { useNotificationsDataAdminQuery } from "../graphql";

export enum AdminMenuTypes {
  users = "users",
  programs = "programs",
  baseConfig = "baseConfig",
  data = "data",
  feedback = "feedback",
  track = "track",
  notifications = "notifications",
}

const Admin: FC = () => {
  const [active, setActive] = useRememberState<AdminMenuTypes>(
    "admin_menu_tab",
    AdminMenuTypes.users
  );

  const { data, loading, error, refetch } = useAllUsersAdminQuery({
    notifyOnNetworkStatusChange: true,
  });

  const { data: NotificationsQueryData } = useNotificationsDataAdminQuery();

  /*const NotificationsQueryData = useMemo(() => {
    return useNotificationsDataAdminQuery();
  }, [studentListChunks, pageSelected, statusProgress]);*/

  useEffect(() => {
    if (IS_NOT_TEST && data) {
      console.log("data_all_users_admin", data);
    }
  }, [data]);

  const ActiveTab = useMemo(() => {
    switch (active) {
      case AdminMenuTypes.users:
        return (
          <Users
            users={data?.users ?? []}
            refetch={refetch}
            loading={loading}
          />
        );
      case AdminMenuTypes.programs:
        return (
          <Programs
            programs={
              data?.users.map(({ email, programs }) => {
                return { email, programs: programs.map(({ id }) => id) };
              }) || []
            }
          />
        );
      case AdminMenuTypes.baseConfig:
        return <AdminConfig />;
      case AdminMenuTypes.data:
        return <AdminData />;
      case AdminMenuTypes.feedback:
        return <AdminFeedback />;
      case AdminMenuTypes.track:
        return <AdminTrack />;
      case AdminMenuTypes.notifications:
        return (
          <AdminNotifications
            notifications={
              NotificationsQueryData?.NotificationsData.map(
                ({ id, email, content, date }) => {
                  return { id, email, content, date };
                }
              ) || []
            }
          />
        );
      default:
        return null;
    }
  }, [active, data, loading, NotificationsQueryData]);

  if (error) {
    console.error(JSON.stringify(error, null, 2));
    return (
      <Message error>
        <Message.Content>{error.message}</Message.Content>
      </Message>
    );
  }

  const { colorMode, toggleColorMode } = useColorMode();

  console.log(888, colorMode);

  useEffect(() => {
    if (colorMode === "dark") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <>
      <Stack alignItems="center" spacing="1em" padding="5px">
        <AdminMenu active={active} setActive={setActive} />
      </Stack>
      {ActiveTab}
    </>
  );
};

const AdminPage = () => {
  const { loading, user } = useUser({
    requireAuth: true,
    requireAdmin: true,
  });

  if (loading && !user) {
    return <LoadingPage />;
  }

  return <Admin />;
};

export default AdminPage;
