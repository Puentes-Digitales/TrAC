export async function loginHelpdesk() {
  var pwd = process.env.HELPDESK_CUSTOMER_CODE;
  var url = process.env.HELPDESK_LOGIN_URL;
  var form = document.createElement("form");
  console.log("url:", url, pwd);

  form.setAttribute("target", "_blank");
  form.setAttribute("method", "post");
  form.setAttribute("action", url);

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "_username");
  hiddenField.setAttribute("value", "usermail");

  var hiddenField2 = document.createElement("input");
  hiddenField2.setAttribute("type", "hidden");
  hiddenField2.setAttribute("name", "_password");
  hiddenField2.setAttribute("value", pwd);

  form.appendChild(hiddenField);
  form.appendChild(hiddenField2);
  document.body.appendChild(form);
  form.submit();
}
