import { Mutation, Resolver, Authorized, Arg } from "type-graphql";
import {
  readHelpdeskAnonUrl,
  verifyCustomer,
} from "../../services/helpdesk/helpdeskVerify";
import "dotenv/config";
//import { loginHelpdesk } from "../../services/helpdesk/helpdeskLogin";

@Resolver(() => String)
export class HelpdeskResolver {
  @Authorized()
  @Mutation(() => String)
  async sendCredentials(
    @Arg("email") email: string,
    @Arg("Name") Name: string,
    @Arg("LastName") LastName: string,
    @Arg("type") type: boolean
  ) {
    var url = "";
    if (type) {
      url = process.env.HELPDESK_ADMIN_LOGIN_URL
        ? process.env.HELPDESK_ADMIN_LOGIN_URL
        : "";
    } else {
      url = process.env.HELPDESK_CUSTOMER_LOGIN_URL
        ? process.env.HELPDESK_CUSTOMER_LOGIN_URL
        : "";
    }
    const customerCode = process.env.HELPDESK_CUSTOMER_CODE || "";
    console.log("se llama la funcion sendCredentials");
    verifyCustomer(email, Name, LastName);
    return JSON.stringify(url + "," + customerCode);
  }

  @Mutation(() => String)
  async readAnonUrl() {
    return readHelpdeskAnonUrl();
  }
}
