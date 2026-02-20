export type CallbackRequest = {
  id: string;
  createdAt: string;
  phone: string;
  name?: string;
  email?: string;
  preferredCallTime?: string;
  note?: string;
  wizardSnapshot?: Record<string, unknown>;
};

const globalStore = globalThis as unknown as {
  callbackRequests?: CallbackRequest[];
};

const callbackRequests = globalStore.callbackRequests ?? [];
globalStore.callbackRequests = callbackRequests;

function nextCallbackRequestId() {
  return `CALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function addCallbackRequest(input: Omit<CallbackRequest, "id" | "createdAt">) {
  const callbackRequest: CallbackRequest = {
    id: nextCallbackRequestId(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  callbackRequests.unshift(callbackRequest);
  if (callbackRequests.length > 200) {
    callbackRequests.length = 200;
  }

  return callbackRequest;
}

export function listCallbackRequests(limit = 50) {
  return callbackRequests.slice(0, Math.max(1, limit));
}
