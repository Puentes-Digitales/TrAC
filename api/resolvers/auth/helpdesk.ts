import { Mutation, Resolver, Authorized, Arg } from "type-graphql";
import { verifyCustomer } from "../../services/helpdesk/helpdeskVerify";
import "dotenv/config";
//import { loginHelpdesk } from "../../services/helpdesk/helpdeskLogin";

@Resolver(() => String)
export class HelpdeskResolver {
  @Authorized()
  @Mutation(() => String)
  async sendCredentials(
    @Arg("email") email: string,
    @Arg("Name") Name: string,
    @Arg("LastName") LastName: string
  ) {
    const url = process.env.HELPDESK_LOGIN_URL || "";
    const customerCode = process.env.HELPDESK_CUSTOMER_CODE || "";
    console.log("se llama la funcion sendCredentials");
    verifyCustomer(email, Name, LastName);
    return JSON.stringify(url + "," + customerCode);
  }
}
