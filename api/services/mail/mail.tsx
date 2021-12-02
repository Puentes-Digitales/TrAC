import React from "react";

import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { requireEnv } from "require-env-variable";
import { IS_PRODUCTION } from "../../../client/constants";
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS_REPLY_TO;
const URL_WEB = process.env.DOMAIN;

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
  risk_header,
  risk_body,
  risk_gif,
  risk_footer,
  risk_json,
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
  risk_header: string;
  risk_body: string;
  risk_gif: string;
  risk_footer: string;
  risk_json: string;
}): string => {
  const parametersDate = JSON.parse(parameters);
  const risk_typesData = JSON.parse(risk_types);
  const risk_jsonData = JSON.parse(risk_json);

  var risksDict: { [index: string]: string } = {};

  risk_jsonData?.map((item: { id: string; def: string }) => {
    risksDict[item.id] = item.def;
  });

  const page = renderToString(
    <html>
      <body
        style={{
          fontSize: "20px",
          backgroundImage:
            "URL('https://drive.google.com/file/d/1wSpdrylvYpovUuFniBi_xuFVkNDayhNA/view')",
          padding: "50px",
          marginLeft: "200px",
          marginRight: "200px",
        }}
      >
        <div
          style={{
            margin: "10px",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <div style={{}}>
            <h2
              style={{
                textAlign: "center",
                fontFamily: "Georgia, serif",
                textSizeAdjust: "40px",
                paddingBottom: "40px",
                borderBottom: "4px double black",
              }}
            >
              {subject}
            </h2>
            <h3 style={{}}>{header}</h3>
            <p>{body}</p>
            <p style={{}}>
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
                        {" : "}
                        {date.date}
                      </li>
                    ) : null;
                  }
                )}
              </ul>
            </p>
          </div>
          <div>
            <h4 style={{ borderBottom: "2px solid black" }}>{risk_header}</h4>
            <div>
              <p>{risk_body}</p>
              <ul>
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
                                (risk_types: {
                                  risk_type_id: React.Key | null | undefined;
                                  risk_type: string;
                                  count: any;
                                }) => {
                                  return risk_types ? (
                                    <li key={risk_types.risk_type_id}>
                                      <p>
                                        <b>
                                          {risksDict[risk_types?.risk_type]}
                                        </b>
                                        {":"}
                                        {risk_types.count}
                                      </p>
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
              <p>{risk_gif}</p>
              <p style={{ textAlign: "center" }}>
                <img
                  src="http://drive.google.com/uc?=export=view&id=1WhAes4dJOsMDxum8m2RT5uZ4THX2-zTG"
                  width="500"
                  height="300"
                ></img>
              </p>
              <p></p>
            </div>
            <b>
              {risk_footer} {URL_WEB}
            </b>
            <p>{farewell}</p>
          </div>
          <div
            style={{
              border: 2,
              background: "#ABBAEA",
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            <p style={{ borderTop: "2px solid black", marginTop: "5px" }}>
              {closing} <b>{EMAIL_ADDRESS}</b>
            </p>
            <p>
              {footer}
              {email}.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
  return page;
};
