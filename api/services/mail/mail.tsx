import React from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { requireEnv } from "require-env-variable";
import { IS_PRODUCTION } from "../../../client/constants";

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS_REPLY_TO;
const DOMAIN = IS_PRODUCTION
  ? requireEnv("DOMAIN").DOMAIN
  : "http://localhost:3000";

export const UnlockMail = ({
  email,
  unlockKey,
}: {
  email: string;
  unlockKey: string;
}): string => {
  const link = `${DOMAIN}/unlock/${email}/${unlockKey}`;

  return renderToStaticMarkup(
    <div>
      <h2>Bienvenido/a a la herramienta TrAC!</h2>
      <br />
      <p>
        El equipo LALA ha preparado para usted una cuenta de usuario para
        utilizar la herramienta TrAC. Por seguridad, la cuenta de usuario sólo
        será activada cuando haya establecido una contraseña segura.
      </p>
      <br />
      <p>
        Haga click{" "}
        <a href={link}>
          <b>aquí</b>
        </a>{" "}
        para ingresar una contraseña nueva y activar su cuenta
      </p>
      <br />
      <p>
        O abra este link en su navegador: {"   "}
        <b>{link}</b>
      </p>
      <br />
      <p>
        Si tiene algún problema o alguna pregunta, puede contactarnos al correo:{" "}
        <b>{EMAIL_ADDRESS}</b>
      </p>
    </div>
  );
};
export const NotificationMail = ({
  email,
  header,
  footer,
  subject,
  body,
}: {
  email: string;
  header: string;
  footer: string;
  body: string;
  subject: string;
}): string => {
  console.log(subject);
  return renderToStaticMarkup(
    <div>
      <h2>{subject}</h2>
      <h3>{header}</h3>
      <p>{body}</p>
      <p>
        {footer} <b>{EMAIL_ADDRESS}</b>
      </p>
      <p>
        Por favor no responda este email. Este correo fue generado de manera
        automática por TrAC-FID y enviado a {email}.
      </p>
    </div>
  );
};
