import React from "react";

import { renderToStaticMarkup, renderToString } from "react-dom/server";
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

export const RiskNotificationMail = ({
  email,
  header,
  footer,
  subject,
  body,
  farewell,
  closing,
  parameters,
  risk_types,
}: {
  email: string;
  header: string;
  footer: string;
  body: string;
  subject: string;
  farewell: string;
  closing: string;
  parameters: string;
  risk_types: string;
}): string => {
  const parametersDate = JSON.parse(parameters);
  const risk_typesData = JSON.parse(risk_types);
  const page = renderToString(
    <html>
      <div
        style={{
          border: 2,
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        <div
          style={{
            alignItems: "start",
          }}
        >
          <h2>{subject}</h2>
          <h3>{header}</h3>
          <p>{body}</p>
          <ul>
            {parametersDate?.map(
              (date: {
                id: React.Key | null | undefined;
                loading_type: any;
                date: any;
              }) => {
                return date ? (
                  <tr key={date.id}>
                    <b>{date.loading_type}</b>
                    {date.date}
                  </tr>
                ) : null;
              }
            )}
          </ul>
        </div>
        <div>
          <ul>
            <h3>Situaciones de riesgo</h3>
            {risk_typesData.length
              ? risk_typesData?.map(
                  (risks: {
                    risk_id: React.Key | null | undefined;
                    program: any;
                    risks: any;
                  }) => {
                    return risks ? (
                      <li key={risks.risk_id}>
                        <b>{risks.program}</b>
                        <ul>
                          {risks.risks?.map(
                            (risk_type: {
                              risk_type_id: React.Key | null | undefined;
                              risk_type: any;
                              count: any;
                            }) => {
                              return risk_type ? (
                                <li key={risk_type.risk_type_id}>
                                  <b>{risk_type.risk_type}</b>
                                  {":"}
                                  <b>{risk_type.count}</b>
                                </li>
                              ) : null;
                            }
                          )}
                        </ul>
                      </li>
                    ) : null;
                  }
                )
              : null}
          </ul>
          <p>{farewell}</p>
        </div>
        <div
          style={{
            border: 2,
            background: "#ABBAEA",
            textSizeAdjust: "70%",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          <p>
            {closing} <b>{EMAIL_ADDRESS}</b>
          </p>
          <p>
            {footer}
            {email}.
          </p>
        </div>
      </div>
    </html>
  );
  return page;
};
export const NotificationMail = ({
  email,
  header,
  footer,
  subject,
  body,
  farewell,
  closing,
  parameters,
}: {
  email: string;
  header: string;
  footer: string;
  body: string;
  subject: string;
  farewell: string;
  closing: string;
  parameters: string;
}): string => {
  const parametersDate = JSON.parse(parameters);
  return renderToString(
    <div>
      <h2>{subject}</h2>
      <h3>{header}</h3>
      <p>{body}</p>
      <ul>
        {parametersDate?.map(
          (date: {
            id: React.Key | null | undefined;
            loading_type: any;
            date: any;
          }) => {
            return date ? (
              <li key={date.id}>
                <b>{date.loading_type}</b>
                {": "}
                {date.date}
              </li>
            ) : null;
          }
        )}
      </ul>
      <p>{farewell}</p>
      <p>
        {closing} <b>{EMAIL_ADDRESS}</b>
      </p>
      <p>
        {footer}
        {email}.
      </p>
    </div>
  );
};
