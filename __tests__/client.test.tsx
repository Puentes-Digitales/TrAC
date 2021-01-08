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
  test("Test Snapshot", () => {
    const tree = render(
      <ComplementaryInfo
        type_admission="PSU"
        initial_test={10}
        final_test={20}
        educational_system="Publico"
        institution="Escuela"
        months_to_first_job={6}
      />
    );
    fireEvent.click(screen.getByTestId("BoxContainer"));
    expect(tree).toMatchSnapshot();
  });
});

test("test props en <AdmissionDropout />", () => {
  const type_admission = "PSU";
  const initial_test = 10;
  const final_test = 20;
  const educational_system = "Publico";
  const institution = "Escuela";
  const months_to_first_job = 6;

  const { getByText, getByTestId } = render(
    <ComplementaryInfo
      type_admission={type_admission}
      initial_test={initial_test}
      final_test={final_test}
      educational_system={educational_system}
      institution={institution}
      months_to_first_job={months_to_first_job}
    />
  );
  fireEvent.click(getByTestId("BoxContainer"));
  expect(getByText("Tipo de ingreso: PSU".trim())).toBeInTheDocument();
  expect(getByText("Sistema educacional: Publico".trim())).toBeInTheDocument();
  expect(
    getByText("Evaluación nacional diagnostica: 20".trim())
  ).toBeInTheDocument();
});

test("test null props complementary component", () => {
  const type_admission = null;
  const initial_test = null;
  const final_test = null;
  const educational_system = "Publico";
  const institution = null;
  const months_to_first_job = null;

  const { getByText, getByTestId, queryAllByText } = render(
    <ComplementaryInfo
      type_admission={type_admission}
      initial_test={initial_test}
      final_test={final_test}
      educational_system={educational_system}
      institution={institution}
      months_to_first_job={months_to_first_job}
    />
  );

  fireEvent.click(getByTestId("BoxContainer"));
  const inst_value = queryAllByText("Tipo de ingreso:");
  expect(inst_value).toHaveLength(0);
  const education_system_value = queryAllByText(
    "Sistema educacional: Publico".trim()
  );
  expect(education_system_value).toHaveLength(1);
});

export {};
