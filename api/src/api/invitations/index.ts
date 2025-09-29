import { Hono } from "hono";
import registerAuthGet from "./get.js";
import registerAuthPost from "./post.js";

const auth = new Hono();

auth.use("*");
registerAuthGet(auth);
registerAuthPost(auth);

export default auth;
