import "@testing-library/jest-dom/extend-expect";

import React from "react";
import waitForExpect from "wait-for-expect";

import { MockedProvider } from "@apollo/react-testing";
import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { UserType } from "../client/constants";
import { baseConfig } from "../client/constants/baseConfig";
import { baseUserConfig } from "../client/constants/userConfig";
import {
  AllUsersAdminDocument,
  CheckUnlockDocument,
  CurrentUserDocument,
} from "../client/src/graphql";
import AdminPage from "../client/src/pages/admin";
import LoginPage from "../client/src/pages/login";
import UnlockPage from "../client/src/pages/unlock/[email]/[unlockKey]";
import ComplementaryInfo from "../client/src/components/dashboard/ComplementaryInfo";
import { IndicatorTooltip } from "../client/src/components/IndicatorTooltip";
import { Popover } from "@chakra-ui/react";
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

afterEach(async () => {
  await cleanup();
});

describe("unlock", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: null,
                  },
                },
              },
            },
            {
              request: {
                query: CheckUnlockDocument,
                variables: {
                  email: "asd@gmail.com",
                  unlockKey: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
                },
              },
              result: {
                data: {
                  checkUnlockKey: null,
                },
              },
            },
          ]}
          addTypename={false}
        >
          <UnlockPage
            email="asd@gmail.com"
            unlockKey="XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT"
          />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const NewPasswordFieldLabel = getByText(
          baseConfig.UNLOCK_NEW_PASSWORD_LABEL
        );

        expect(NewPasswordFieldLabel).toBeTruthy();
      });
    });
  });
});

describe("login", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: null,
                  },
                },
              },
            },
          ]}
          addTypename={false}
        >
          <LoginPage />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const LoginButton = getByText(baseConfig.LOGIN_BUTTON);

        expect(LoginButton).toBeTruthy();
        expect(LoginButton).toHaveAttribute("disabled");
      });
    });
  });
});

describe("admin", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: {
                      email: "asd@gmail.com",
                      name: "name",
                      admin: true,
                      type: UserType.Director,
                      config: baseUserConfig,
                      student_id: "",
                      __typename: "User",
                    },
                    __typename: "AuthResult",
                  },
                },
              },
            },
            {
              request: {
                query: AllUsersAdminDocument,
              },
              result: {
                data: {
                  users: [],
                },
              },
            },
          ]}
          addTypename={true}
        >
          <AdminPage />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const UsersMenu = getByText("Users");

        expect(UsersMenu).toBeTruthy();
        expect(UsersMenu).toHaveClass("active");
      });
    });
  });
});

describe("Test <AdmissionDropout />", () => {
  test("Test Snapshot", async () => {
    await act(async () => {
      const { getByTestId } = render(
        <ComplementaryInfo
          type_admission="PSU"
          educational_system={true}
          institution="Escuela"
          months_to_first_job={6}
          graduation_term="2020-2"
        />
      );

      await waitForExpect(() => {
        fireEvent.click(getByTestId("BoxContainer"));
        expect(getByTestId("BoxContainer")).toMatchSnapshot();
      });
    });
  });
});

test("test props en <AdmissionDropout />", async () => {
  const employed = true;
  const type_admission = "PSU";
  const educational_system = true;
  const institution = "Escuela";
  const months_to_first_job = 6;
  const graduation_term = "2022-2";

  await act(async () => {
    const { getByText, getByTestId } = render(
      <ComplementaryInfo
        employed={employed}
        type_admission={type_admission}
        educational_system={educational_system}
        institution={institution}
        months_to_first_job={months_to_first_job}
        graduation_term={graduation_term}
      />
    );
    await waitForExpect(() => {
      fireEvent.click(getByTestId("BoxContainer"));
      expect(getByText("Tipo de ingreso: PSU".trim())).toBeInTheDocument();
      expect(getByText("Sistema educacional: Si".trim())).toBeInTheDocument();
    });
  });
});

test("test null props complementary component", async () => {
  const employed = true;
  const type_admission = null;
  const educational_system = true;
  const institution = null;
  const months_to_first_job = null;
  const graduation_term = null;

  await act(async () => {
    const { getByTestId, queryAllByText } = render(
      <ComplementaryInfo
        employed={employed}
        type_admission={type_admission}
        educational_system={educational_system}
        institution={institution}
        months_to_first_job={months_to_first_job}
        graduation_term={graduation_term}
      ></ComplementaryInfo>
    );
    await waitForExpect(() => {
      fireEvent.click(getByTestId("BoxContainer"));
      const inst_value = queryAllByText("Tipo de ingreso:");
      expect(inst_value).toHaveLength(0);
      const education_system_value = queryAllByText(
        "Sistema educacional: Si".trim()
      );
      expect(education_system_value).toHaveLength(1);
    });
  });
});

describe("indicatorTooltip", () => {
  test("render correctly", async () => {
    await act(async () => {
      const { getByTestId, getByText } = render(
        <IndicatorTooltip tooltipShow="any" />
      );
      await waitForExpect(() => {
        fireEvent.mouseEnter(getByTestId("test-tooltip"));
        expect(getByText("any")).toBeInTheDocument();
      });
    });
  });
});

export {};
