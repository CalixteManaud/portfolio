import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().optional(),
    });
  },
  handleServerError(err) {
    console.error("[action] server error:", err);
    return "INTERNAL_ERROR";
  },
});
