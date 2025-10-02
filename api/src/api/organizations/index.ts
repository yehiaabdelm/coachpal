import { Hono } from "hono";
// import registerAuthGet from "./get.js";
import registerOrganizationPost from "./post.js";
import registerOrganizationGet from "./get.js";

const organizations = new Hono();

organizations.use("*");
// registerAuthGet(auth);
registerOrganizationPost(organizations);
registerOrganizationGet(organizations);

export default organizations;
