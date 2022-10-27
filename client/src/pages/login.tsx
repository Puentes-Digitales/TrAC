import sha1 from "crypto-js/sha1";
import { ValidationErrors } from "final-form";
import Cookies from "js-cookie";
import Router from "next/router";
import React, { FC, useContext, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useUpdateEffect } from "react-use";
import {
  Button,
  Form as FormSemantic,
  Grid,
  Icon,
  Input,
  Message,
  Segment,
} from "semantic-ui-react";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

import {
  Flex,
  FormLabel,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  LOCKED_USER,
  STUDENT_DATA_NOT_FOUND,
  WRONG_INFO,
} from "../../constants";
import { ToggleDarkMode } from "../components/DarkMode";
import { LoadingPage } from "../components/Loading";
import { ConfigContext } from "../context/Config";
import {
  CurrentUserDocument,
  useLoginMutation,
  useAnonHelpdeskUrlMutation,
} from "../graphql";
import { useUser } from "../utils/useUser";
const Login: FC = () => {
  const [session, setSession] = useState(() =>
    Cookies.get("remember") ? true : false
  );

  const [
    anonHelpdeskUrl,
    { loading: anonHelpdeskUrloading },
  ] = useAnonHelpdeskUrlMutation();

  const callHelpdeskUrl = async () => {
    const datahd = await anonHelpdeskUrl();
    console.log("data:", datahd?.data?.readAnonUrl);
    if (datahd?.data?.readAnonUrl) {
      window.open(datahd?.data?.readAnonUrl);
    }
  };

  useUpdateEffect(() => {
    if (session) {
      Cookies.set("remember", "1", { expires: 30 });
    } else {
      Cookies.remove("remember");
    }
  }, [session]);

  const [login, { data, loading, error: errorMutation }] = useLoginMutation({
    update: (cache, { data }) => {
      if (data?.login.user) {
        cache.writeQuery({
          query: CurrentUserDocument,
          data: {
            currentUser: data.login,
          },
        });
      }
    },
  });

  const {
    LOGIN_HEADER,
    LOGIN_FOOTER,
    LOGIN_WRONG_INFO_MESSAGE,
    LOGIN_LOCKED_USER_MESSAGE,
    LOGIN_PUT_VALID_EMAIL,
    LOGIN_PUT_VALID_PASSWORD_LENGTH,
    LOGIN_EMAIL_LABEL,
    LOGIN_EMAIL_PLACEHOLDER,
    LOGIN_PASSWORD_LABEL,
    LOGIN_PASSWORD_PLACEHOLDER,
    LOGIN_REMEMBER_SESSION,
    LOGIN_BUTTON,
    LOGIN_HELP_TO_LOGIN_MESSAGE,
    LOGIN_ERROR_TITLE,
    ERROR_STUDENT_ACCOUNT_NO_DATA_MESSAGE,
    LOGIN_SHOW_HELP_TO_LOGIN_MESSAGE,
  } = useContext(ConfigContext);

  const labelColor = useColorModeValue("black", "white !important");

  return (
    <>
      <Grid centered padded>
        <Grid.Row>
          <Text
            fontSize="2.3em"
            fontFamily="sans-serif"
            fontWeight="bold"
            color={labelColor}
            className="horizontalText"
            as="label"
            textShadow="0.5px 0.5px 0px #a1a1a1"
          >
            {LOGIN_HEADER}
          </Text>
        </Grid.Row>

        {!loading && (data?.login?.error || errorMutation) && (
          <Grid.Row>
            <Message negative>
              <Message.Header>{LOGIN_ERROR_TITLE}</Message.Header>
              {(() => {
                switch (data?.login?.error) {
                  case STUDENT_DATA_NOT_FOUND:
                    return ERROR_STUDENT_ACCOUNT_NO_DATA_MESSAGE;
                  case WRONG_INFO:
                    return LOGIN_WRONG_INFO_MESSAGE;
                  case LOCKED_USER:
                    return LOGIN_LOCKED_USER_MESSAGE;
                  default:
                    if (errorMutation) {
                      return errorMutation.message;
                    }
                    return data?.login.error;
                }
              })()}
            </Message>
          </Grid.Row>
        )}

        <Form
          onSubmit={async (
            {
              email,
              password,
            }: {
              email: string;
              password: string;
            },
            { reset }
          ) => {
            const { data } = await login({
              variables: {
                email,
                password: sha1(password).toString(),
              },
            });
            if (data?.login.error) {
              setTimeout(
                () =>
                  reset({
                    email,
                    password: "",
                  }),
                0
              );
            }
          }}
          validate={({ email, password }) => {
            const errors: ValidationErrors = {};

            if (!email || !isEmail(email)) {
              errors.email = LOGIN_PUT_VALID_EMAIL;
            }
            if (!password || !isLength(password, { min: 3, max: 100 })) {
              errors.password = LOGIN_PUT_VALID_PASSWORD_LENGTH;
            }
            return errors;
          }}
        >
          {({ handleSubmit, pristine, invalid }) => {
            return (
              <FormSemantic
                size="big"
                onSubmit={handleSubmit}
                color={labelColor}
              >
                <Segment size="big" basic>
                  <Field name="email" type="email" initialValue="">
                    {({ input, meta: { touched, error } }) => (
                      <FormSemantic.Field
                        error={error && touched}
                        disabled={loading}
                      >
                        <Text color={labelColor} as="label">
                          {LOGIN_EMAIL_LABEL}
                        </Text>
                        <Input
                          {...input}
                          placeholder={LOGIN_EMAIL_PLACEHOLDER}
                        />
                        <Text color={labelColor} as="label">
                          {touched && error}
                        </Text>
                      </FormSemantic.Field>
                    )}
                  </Field>

                  <Field name="password" initialValue="" type="password">
                    {({ input, meta: { touched, error } }) => (
                      <FormSemantic.Field
                        error={error && touched}
                        disabled={loading}
                      >
                        <Text color={labelColor} as="label">
                          {LOGIN_PASSWORD_LABEL}
                        </Text>
                        <Input
                          {...input}
                          placeholder={LOGIN_PASSWORD_PLACEHOLDER}
                        />
                        {
                          <Text color={labelColor} as="label">
                            {touched && error}
                          </Text>
                        }
                      </FormSemantic.Field>
                    )}
                  </Field>
                </Segment>
                <Flex justify="center" align="center">
                  <FormLabel htmlFor="remember">
                    {LOGIN_REMEMBER_SESSION}
                  </FormLabel>
                  <Switch
                    id="remember"
                    isChecked={session}
                    isDisabled={loading}
                    onChange={() => setSession((sess) => !sess)}
                  />
                </Flex>

                <Segment basic>
                  <Button
                    as="button"
                    type="submit"
                    size="big"
                    color="blue"
                    disabled={pristine || invalid || loading}
                    icon
                    labelPosition="left"
                    loading={loading}
                  >
                    <Icon name="sign-in" />
                    {LOGIN_BUTTON}
                  </Button>
                </Segment>

                {LOGIN_SHOW_HELP_TO_LOGIN_MESSAGE && (
                  <Segment basic>
                    <Button
                      size="medium"
                      loading={anonHelpdeskUrloading}
                      disable={anonHelpdeskUrloading}
                      labelPosition="left"
                      onClick={() => {
                        callHelpdeskUrl();
                      }}
                    >
                      <Text color={labelColor}>
                        {LOGIN_HELP_TO_LOGIN_MESSAGE}
                      </Text>
                    </Button>
                  </Segment>
                )}
              </FormSemantic>
            );
          }}
        </Form>
        <Grid.Row>
          <ToggleDarkMode />
        </Grid.Row>
        <Grid.Row>
          <Stack
            bottom="0em"
            //borderColor="white"
            //borderWidth="0.05em"
            position="fixed"
            alignItems="center"
          >
            <Text
              fontSize="1.2em"
              fontFamily="monospace"
              fontWeight="bold"
              color={labelColor}
              //className="horizontalText"
              as="label"
            >
              {LOGIN_FOOTER}
            </Text>
          </Stack>
        </Grid.Row>
      </Grid>
    </>
  );
};

const LoginPage = () => {
  const { loading, user } = useUser();

  useEffect(() => {
    if (!loading && user?.email) {
      Router.push("/");
    }
  }, [loading, user]);

  if (loading) {
    return <LoadingPage />;
  }
  return <Login />;
};

export default LoginPage;
