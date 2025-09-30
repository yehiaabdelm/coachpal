import { Hono } from "hono";
// import registerAuthGet from "./get.js";
import registerOrganizationPost from "./post.js";

const auth = new Hono();

auth.use("*");
// registerAuthGet(auth);
registerOrganizationPost(auth);

export default auth;
