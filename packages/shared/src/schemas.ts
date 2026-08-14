import { z } from "zod";

export const DocumentTypeEnum = z.enum([
  "AADHAAR",
  "PAN",
  "DRIVING_LICENSE",
  "PASSPORT",
  "VOTER_ID",
  "INSURANCE_HEALTH",
  "INSURANCE_VEHICLE",
  "INSURANCE_LIFE",
  "ITR",
  "BANK_STATEMENT",
  "UTILITY_BILL",
  "EDUCATION_CERTIFICATE",
  "BIRTH_CERTIFICATE",
  "OTHER",
]);

export type DocumentType = z.infer<typeof DocumentTypeEnum>;

/** Accepts HTML date (YYYY-MM-DD), ISO datetime, empty, or null (clear) */
const optionalDateString = z.preprocess((v) => {
  if (v === "" || v === undefined) return undefined;
  if (v === null) return null;
  return v;
}, z.union([
  z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  z.null(),
]).optional());

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createPersonSchema = z.object({
  name: z.string().min(1),
  relation: z.string().optional(),
  dob: optionalDateString,
});

export const updatePersonSchema = createPersonSchema.partial();

export const createDocumentSchema = z.object({
  personId: z.string().min(1),
  type: DocumentTypeEnum,
  title: z.string().min(1),
  metadata: z.record(z.unknown()).default({}),
  tagNames: z.array(z.string()).default([]),
  expiryDate: optionalDateString,
  isFavorite: z.boolean().default(false),
  inTravelPack: z.boolean().default(false),
});

export const updateDocumentSchema = createDocumentSchema.partial().omit({ personId: true });

export const uploadVersionSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
});

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  type: DocumentTypeEnum.optional(),
  personId: z.string().optional(),
  tag: z.string().optional(),
  favorite: z.coerce.boolean().optional(),
  travelPack: z.coerce.boolean().optional(),
  expiringWithinDays: z.coerce.number().int().positive().optional(),
});

export const compareQuerySchema = z.object({
  ids: z
    .string()
    .transform((s) => s.split(",").filter(Boolean))
    .pipe(z.array(z.string()).min(2).max(4)),
});

export interface DashboardStats {
  totalDocuments: number;
  totalPersons: number;
  expiringSoon: DocumentSummary[];
  expired: DocumentSummary[];
  missingByPerson: MissingDocsByPerson[];
  favoritesCount: number;
  travelPackCount: number;
}

export interface DocumentSummary {
  id: string;
  title: string;
  type: DocumentType;
  personId: string;
  personName: string;
  expiryDate: string | null;
  isFavorite: boolean;
  inTravelPack: boolean;
}

export interface MissingDocsByPerson {
  personId: string;
  personName: string;
  missingTypes: DocumentType[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}
