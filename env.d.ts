declare namespace NodeJS {
  export interface ProcessEnv {
    SECRET: string;
    DOMAIN: string;
    SENDGRID_API_KEY: string;
    EMAIL_ADDRESS: string;
    EMAIL_ADDRESS_NAME: string;
    EMAIL_ADDRESS_REPLY_TO: string;
    PORT: string;
    SELECTED_PROGRAMS: string;
    HELPDESK_VERIFYCUSTOMER_URL: string;
    HELPDESK_CUSTOMER_CODE: string;
    HELPDESK_CUSTOMER_LOGIN_URL: string;
    HELPDESK_ADMIN_LOGIN_URL: string;
    HELPDESK_ANON_TICKET_CREATION_URL: string;
  }
}
