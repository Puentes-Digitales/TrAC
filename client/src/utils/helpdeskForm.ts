export async function loginHelpdesk(email: string, urlLogin: string) {
  console.log("urlclave:", urlLogin);
  const dataHelpdesk = urlLogin.slice(1, -1).split(",");
  console.log("url:", dataHelpdesk[0]);
  console.log("pass:", dataHelpdesk[1]);

  var form = document.createElement("form");
  form.setAttribute("target", "_blank");
  form.setAttribute("method", "post");
  form.setAttribute("action", dataHelpdesk[0]?.length ? dataHelpdesk[0] : "");

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "_username");
  hiddenField.setAttribute("value", email);

  var hiddenField2 = document.createElement("input");
  hiddenField2.setAttribute("type", "hidden");
  hiddenField2.setAttribute("name", "_password");
  hiddenField2.setAttribute(
    "value",
    dataHelpdesk[1]?.length ? dataHelpdesk[1] : ""
  );

  form.appendChild(hiddenField);
  form.appendChild(hiddenField2);
  document.body.appendChild(form);
  form.submit();
}
