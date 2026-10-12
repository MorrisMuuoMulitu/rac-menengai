declare const process: { env: Record<string, string | undefined> };
import { createOrientationHandler } from "../server/orientation-access.js";
export default createOrientationHandler(process.env);
