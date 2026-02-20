import {
  createCallbackRequestInDb,
  listCallbackRequestsFromDb,
} from "@/server/db/repositories/callback-requests";

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

function nextCallbackRequestId() {
  return `CALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function addCallbackRequest(input: Omit<CallbackRequest, "id" | "createdAt">) {
  const callbackRequest: CallbackRequest = {
    id: nextCallbackRequestId(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  return createCallbackRequestInDb(callbackRequest);
}

export async function listCallbackRequests(limit = 50) {
  return listCallbackRequestsFromDb(limit);
}
