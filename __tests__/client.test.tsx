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
          educational_system="Publico"
          institution="Escuela"
          months_to_first_job={6}
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
  const type_admission = "PSU";
  const educational_system = "Publico";
  const institution = "Escuela";
  const months_to_first_job = 6;

  await act(async () => {
    const { getByText, getByTestId } = render(
      <ComplementaryInfo
        type_admission={type_admission}
        educational_system={educational_system}
        institution={institution}
        months_to_first_job={months_to_first_job}
      />
    );
    await waitForExpect(() => {
      fireEvent.click(getByTestId("BoxContainer"));
      expect(getByText("Tipo de ingreso: PSU".trim())).toBeInTheDocument();
      expect(
        getByText("Sistema educacional: Publico".trim())
      ).toBeInTheDocument();
    });
  });
});

test("test null props complementary component", async () => {
  const type_admission = null;
  const educational_system = "Publico";
  const institution = null;
  const months_to_first_job = null;

  await act(async () => {
    const { getByTestId, queryAllByText } = render(
      <ComplementaryInfo
        type_admission={type_admission}
        educational_system={educational_system}
        institution={institution}
        months_to_first_job={months_to_first_job}
      ></ComplementaryInfo>
    );
    await waitForExpect(() => {
      fireEvent.click(getByTestId("BoxContainer"));
      const inst_value = queryAllByText("Tipo de ingreso:");
      expect(inst_value).toHaveLength(0);
      const education_system_value = queryAllByText(
        "Sistema educacional: Publico".trim()
      );
      expect(education_system_value).toHaveLength(1);
    });
  });
});

describe("indicatorTooltip", () => {
  test("render correctly", async () => {
    await act(async () => {
      const { getByTestId } = render(<IndicatorTooltip tooltipShow="any" />);
      await waitForExpect(() => {
        fireEvent.mouseEnter(getByTestId("test-tooltip"));
        expect(getByTestId("test-tooltip")).toBeInTheDocument();
      });
    });
  });
});

export {};
