export const USER = {
  name: "Sujal",
};

export const people = [
  { id: "p1", name: "Sujal", label: "You" },
  { id: "p2", name: "Father", label: null },
  { id: "p3", name: "Mother", label: null },
  { id: "p4", name: "XYZ", label: "Son" },
];

export const documents = [
  {
    id: "d1",
    name: "Aadhaar Card",
    person: "Sujal",
    personId: "p1",
    type: "Identity",
    date: "2024-03-15",
    status: "active",
  },
  {
    id: "d2",
    name: "PAN Card",
    person: "Sujal",
    personId: "p1",
    type: "Identity",
    date: "2023-11-02",
    status: "active",
  },
  {
    id: "d3",
    name: "Passport",
    person: "Father",
    personId: "p2",
    type: "Travel",
    date: "2022-06-18",
    status: "expiring",
  },
  {
    id: "d4",
    name: "Income Tax Return",
    person: "Sujal",
    personId: "p1",
    type: "Financial",
    date: "2025-07-31",
    status: "active",
  },
  {
    id: "d5",
    name: "Health Insurance",
    person: "Mother",
    personId: "p3",
    type: "Insurance",
    date: "2024-09-01",
    status: "expiring",
  },
];

export const alerts = [
  {
    id: "a1",
    documentName: "Health Insurance",
    person: "Mother",
    personId: "p3",
    daysRemaining: 18,
    severity: "warning",
  },
  {
    id: "a2",
    documentName: "Passport",
    person: "Father",
    personId: "p2",
    daysRemaining: 64,
    severity: "info",
  },
];
