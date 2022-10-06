//import axios from "axios";
/*
export async function sendCredentials(
  email: string,
  username: string,
  admin: boolean
) {
  const {
    HELPDESK_URL,
    HELPDESK_ADMIN_EMAIL,
    HELPDESK_ADMIN_PASSWORD,
  } = requireEnv(
    "HELPDESK_URL",
    "HELPDESK_ADMIN_EMAIL",
    "HELPDESK_ADMIN_PASSWORD"
  );

  type helpdeskURLS = {
    memberLogin: string;
    customerLogin: string;
    createUser: string;
  };

  const urls: helpdeskURLS = {
    memberLogin: HELPDESK_URL + "/en/member/login",
    customerLogin: HELPDESK_URL + "/en/customer/login",
    createUser: HELPDESK_URL + "/en/member/create/customer",
  };
  console.log(HELPDESK_ADMIN_EMAIL);
  console.log(HELPDESK_ADMIN_PASSWORD);
  const Querystring = require("querystring");
  try {
    const { data } = await axios.post(
      admin ? urls.memberLogin : urls.customerLogin,
      Querystring.stringify({
        _username: email,
        _password: "pass123.",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          withCredentials: true,
        },
      }
    );
    console.log("data: ", data);
    console.log("mensaje:", JSON.stringify(data, null, 4));
    console.log("data: ", data);
    //this.status = helpdeskServiceStatus.enabled;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}
*/

export async function loginHelpdesk() {
  //window.open("http://localhost:9000/en/member/login");

  var form = document.createElement("form");
  form.setAttribute("target", "_blank");
  form.setAttribute("method", "post");
  form.setAttribute("action", "http://localhost:9000/en/member/login");

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "_username");
  hiddenField.setAttribute("value", "jothagoo@gmail.com");

  var hiddenField2 = document.createElement("input");
  hiddenField2.setAttribute("type", "hidden");
  hiddenField2.setAttribute("name", "_password");
  hiddenField2.setAttribute("value", "pass123.");

  form.appendChild(hiddenField);
  form.appendChild(hiddenField2);
  document.body.appendChild(form);
  form.submit();

  /*
    var querystring = require("querystring");
    let aux = await axios
      .post(
        "http://localhost:9000/en/member/login",
        querystring.stringify({
          _username: "jothagoo@gmail.com",
          _password: "pass123.",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            maxRedirects: "0",
          },
        }
      )
      .then(function (response) {
        console.log("test:", response.headers.location);
      });
    console.log("data:", aux);
    return aux;*/
  /*
    var querystring = require("querystring");
    fetch("http://localhost:9000/en/member/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        maxRedirects: "1",
      },
      body: querystring.stringify({
        _username: "jothagoo@gmail.com",
        _password: "pass123.",
      }),
    })
      //Then with the data from the response in JSON...
      .then((data) => {
        console.log("Success:", data);
      })
      //Then with the error genereted...
      .catch((error) => {
        console.error("Error:", error);
      });*/
}
