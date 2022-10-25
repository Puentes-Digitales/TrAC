export async function loginHelpdesk(
  email: string,
  urlLogin: string,
  type: boolean
) {
  console.log("urlclave:", urlLogin);
  const dataHelpdesk = urlLogin.slice(3, -3).split(",");
  console.log("url:", dataHelpdesk[0]);
  console.log("pass:", dataHelpdesk[1]);
  var code: string = "";
  const url = dataHelpdesk[0]?.length ? dataHelpdesk[0] : "";

  if (type) {
    const adminCred = dataHelpdesk[1] ? dataHelpdesk[1]?.split("/") : [""];
    email = adminCred[0] ? adminCred[0] : "";
    code = adminCred[1] ? adminCred[1] : "";
  } else {
    code = dataHelpdesk[1]?.length ? dataHelpdesk[1] : "";
  }

  if (urlLogin.length > 0) {
    var form = document.createElement("form");
    form.setAttribute("target", "_blank");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "_username");
    hiddenField.setAttribute("value", email);

    var hiddenField2 = document.createElement("input");
    hiddenField2.setAttribute("type", "hidden");
    hiddenField2.setAttribute("name", "_password");
    hiddenField2.setAttribute("value", code);

    form.appendChild(hiddenField);
    form.appendChild(hiddenField2);
    document.body.appendChild(form);
    form.submit();
  }
}
