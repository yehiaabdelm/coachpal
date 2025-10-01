import { Hono } from "hono";
// import registerAuthGet from "./get.js";
import registerOrganizationPost from "./post.js";

const organizations = new Hono();

organizations.use("*");
// registerAuthGet(auth);
registerOrganizationPost(organizations);

export default organizations;
