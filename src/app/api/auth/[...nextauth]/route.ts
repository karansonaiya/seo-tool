import { handlers } from "@/auth";

// Force Node.js runtime — required for Mongoose / MongoDB
export const runtime = "nodejs";

export const { GET, POST } = handlers;
