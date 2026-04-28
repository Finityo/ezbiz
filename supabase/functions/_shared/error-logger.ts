// Shared error-logging helper for edge functions.
// Goal: keep client-facing responses generic while server logs capture
// a request ID, full error message, stack trace, and any extra context.

export type ErrorMapping = {
  // Substring or exact match against the raw error message.
  match: string;
  status: number;
  userMessage: string;
};

export interface LoggedErrorOptions {
  functionName: string;
  error: unknown;
  requestId?: string;
  context?: Record<string, unknown>;
  // Ordered list of known error → status/message mappings.
  // First match wins. If none match, fallback is used.
  mappings?: ErrorMapping[];
  fallbackStatus?: number;
  fallbackMessage?: string;
  corsHeaders?: Record<string, string>;
}

export function newRequestId(): string {
  // crypto.randomUUID is available in Deno edge runtime.
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * Log full error details server-side and return a generic Response for the client.
 * The response body always includes the requestId so support can correlate.
 */
export function logAndBuildErrorResponse(opts: LoggedErrorOptions): Response {
  const {
    functionName,
    error,
    requestId = newRequestId(),
    context,
    mappings = [],
    fallbackStatus = 500,
    fallbackMessage = "Unable to process request. Please try again.",
    corsHeaders = {},
  } = opts;

  const rawMessage = error instanceof Error ? error.message : String(error ?? "");
  const stack = error instanceof Error ? error.stack : undefined;

  // Server-side log: full detail, structured for easy grep.
  console.error(
    JSON.stringify({
      level: "error",
      fn: functionName,
      requestId,
      message: rawMessage,
      stack,
      context,
      timestamp: new Date().toISOString(),
    }),
  );

  // Decide client-facing status + message via mappings.
  let status = fallbackStatus;
  let userMessage = fallbackMessage;
  for (const m of mappings) {
    if (rawMessage === m.match || rawMessage.includes(m.match)) {
      status = m.status;
      userMessage = m.userMessage;
      break;
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: userMessage, requestId }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    },
  );
}
