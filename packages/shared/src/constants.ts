import type { DocumentType } from "./schemas";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar",
  PAN: "PAN Card",
  DRIVING_LICENSE: "Driving License",
  PASSPORT: "Passport",
  VOTER_ID: "Voter ID",
  INSURANCE_HEALTH: "Health Insurance",
  INSURANCE_VEHICLE: "Vehicle Insurance",
  INSURANCE_LIFE: "Life Insurance",
  ITR: "Income Tax Return (ITR)",
  BANK_STATEMENT: "Bank Statement",
  UTILITY_BILL: "Utility Bill",
  EDUCATION_CERTIFICATE: "Education Certificate",
  BIRTH_CERTIFICATE: "Birth Certificate",
  OTHER: "Other",
};

/** Recommended document types per adult person for dashboard "missing" checks */
export const REQUIRED_ADULT_DOCUMENTS: DocumentType[] = [
  "AADHAAR",
  "PAN",
  "DRIVING_LICENSE",
  "PASSPORT",
  "INSURANCE_HEALTH",
  "ITR",
];
