import { Mutation, Resolver, Authorized, Arg } from "type-graphql";
import { verifyCustomer } from "../../services/helpdesk/helpdeskVerify";
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
    console.log("se llama la funcion sendCredentials");
    const url = verifyCustomer(email, Name, LastName);
    return url;
  }
}
