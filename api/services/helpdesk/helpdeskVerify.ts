import "dotenv/config";
import axios from "axios";

export async function verifyCustomer(
  email: string,
  name: string,
  lastName: string
) {
  const url = process.env.HELPDESK_VERIFYCUSTOMER_URL + "/verifyCustomer";

  var querystring = require("querystring");
  let aux = await axios
    .post(
      url,
      querystring.stringify({
        email: email,
        name: name,
        lastName: lastName,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
  return aux;
}

export async function readHelpdeskAnonUrl() {
  return process.env.HELPDESK_ANON_TICKET_CREATION_URL;
}
