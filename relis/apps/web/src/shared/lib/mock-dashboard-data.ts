/**
 * MOCK DATA — placeholder values only, ported from v1/src/data/mock.ts.
 * There is no backend data-fetching wired up yet (no auth/session, no
 * project/papers API). Replace with real data once those modules exist;
 * do not treat these values as a source of truth.
 */

export interface MockPaper {
  id: string;
  status: "pending" | "included" | "excluded" | "conflict";
}

export const mockCurrentUser = {
  name: "Alice Santos",
  role: "Reviewer",
};

export const mockActiveProject = {
  id: "p1",
  title: "Machine Learning for Requirements Engineering",
  description:
    "Systematic review on the application of ML techniques to automate requirements elicitation and analysis.",
};

export const mockPapers: MockPaper[] = [
  { id: "pap-1001", status: "pending" },
  { id: "pap-1002", status: "excluded" },
  { id: "pap-1003", status: "included" },
  { id: "pap-1004", status: "conflict" },
  { id: "pap-1005", status: "included" },
  { id: "pap-1006", status: "pending" },
];
