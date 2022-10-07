export async function verifyCustomer(
  email: string,
  name: string,
  lastName: string
) {
  const url = process.env.HELPDESK_VERIFYCUSTOMER_URL + "/verifyCustomer";
  var querystring = require("querystring");
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      email: email,
      name: name,
      lastName: lastName,
    }),
  })
    .then((data) => {
      console.log("Success:");
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}
