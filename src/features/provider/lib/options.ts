export const PROVIDER_ROLES = [
  "Business owner",
  "Manager",
  "Independent professional",
];

export const PROVIDER_CATEGORIES = [
  "Home cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
  "Gardening",
  "Moving",
  "Handyman",
];

export const ADDITIONAL_SERVICES = [
  "Deep cleaning",
  "Move-out cleaning",
  "Regular maintenance",
  "Emergency calls",
  "Eco-friendly options",
];

export const SERVICE_AREAS = ["Austin, Texas", "Dallas, Texas", "Houston, Texas"];

export const TRAVEL_RADII = [
  "Within 5 km",
  "Within 10 km",
  "Within 25 km",
  "Within 50 km",
];

export const MAX_DESCRIPTION = 500;

export type ProviderDraft = {
  ownerName: string;
  role: string;
  professionalTitle: string;
  yearsOfExperience: string;
  businessEmail: string;
  businessPhone: string;
  businessName: string;
  businessDescription: string;
  primaryCategory: string;
  additionalServices: string[];
  serviceArea: string;
  travelRadius: string;
};

export const emptyDraft: ProviderDraft = {
  ownerName: "",
  role: "",
  professionalTitle: "",
  yearsOfExperience: "",
  businessEmail: "",
  businessPhone: "",
  businessName: "",
  businessDescription: "",
  primaryCategory: "",
  additionalServices: [],
  serviceArea: "",
  travelRadius: "",
};
