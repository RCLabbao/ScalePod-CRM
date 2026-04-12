import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

hydrateRoot(document, <HydratedRouter />, {
  onRecoverableError(error) {
    // Suppress hydration mismatches caused by browser extensions
    // (bis_skin_checked, __processed, etc.)
    if (
      error instanceof Error &&
      error.message.includes("hydrat")
    ) {
      return;
    }
    console.error(error);
  },
});
