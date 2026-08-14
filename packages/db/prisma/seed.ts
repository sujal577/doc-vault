import { PrismaClient, DocumentType } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const vaultKeySalt = crypto.randomBytes(16).toString("hex");
  const passwordHash = await bcrypt.hash("demo1234", 12);

  // Always reset demo password so login works after re-seed
  const user = await prisma.user.upsert({
    where: { email: "demo@docvault.local" },
    update: { passwordHash },
    create: {
      email: "demo@docvault.local",
      passwordHash,
      vaultKeySalt,
    },
  });

  const self = await prisma.person.upsert({
    where: { id: "seed-person-self" },
    update: { name: "You", relation: "self" },
    create: {
      id: "seed-person-self",
      userId: user.id,
      name: "You",
      relation: "self",
    },
  });

  const spouse = await prisma.person.upsert({
    where: { id: "seed-person-spouse" },
    update: { name: "Spouse", relation: "spouse" },
    create: {
      id: "seed-person-spouse",
      userId: user.id,
      name: "Spouse",
      relation: "spouse",
    },
  });

  const child = await prisma.person.upsert({
    where: { id: "seed-person-child" },
    update: { name: "Child", relation: "child" },
    create: {
      id: "seed-person-child",
      userId: user.id,
      name: "Child",
      relation: "child",
    },
  });

  const tags = await Promise.all(
    ["important", "travel", "tax"].map((name) =>
      prisma.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      })
    )
  );

  const existingDocs = await prisma.document.count({ where: { userId: user.id } });
  if (existingDocs === 0) {
    const aadhaar = await prisma.document.create({
      data: {
        userId: user.id,
        personId: self.id,
        type: DocumentType.AADHAAR,
        title: "Aadhaar Card",
        metadataEnc: JSON.stringify({ number: "XXXX-XXXX-1234", issuer: "UIDAI" }),
        expiryDate: null,
        isFavorite: true,
        inTravelPack: true,
        tags: { create: [{ tagId: tags[0].id }, { tagId: tags[1].id }] },
      },
    });

    await prisma.document.create({
      data: {
        userId: user.id,
        personId: self.id,
        type: DocumentType.PAN,
        title: "PAN Card",
        metadataEnc: JSON.stringify({ number: "ABCDE1234F" }),
        isFavorite: true,
      },
    });

    const dl = await prisma.document.create({
      data: {
        userId: user.id,
        personId: self.id,
        type: DocumentType.DRIVING_LICENSE,
        title: "Driving License",
        metadataEnc: JSON.stringify({ number: "DL-0123456789", state: "MH" }),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        inTravelPack: true,
      },
    });

    await prisma.document.create({
      data: {
        userId: user.id,
        personId: spouse.id,
        type: DocumentType.INSURANCE_HEALTH,
        title: "Health Insurance Policy",
        metadataEnc: JSON.stringify({ policyNumber: "HI-998877", provider: "Star Health" }),
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: aadhaar.id,
        year: 2025,
        fileKey: "seed/aadhaar-2025.enc",
        fileName: "aadhaar.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
        checksum: "seed-checksum-aadhaar",
      },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: dl.id,
        year: 2024,
        fileKey: "seed/dl-2024.enc",
        fileName: "dl.pdf",
        mimeType: "application/pdf",
        sizeBytes: 2048,
        checksum: "seed-checksum-dl",
      },
    });

    await prisma.reminder.create({
      data: {
        userId: user.id,
        documentId: dl.id,
        remindAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        daysBefore: 7,
      },
    });
  }

  console.log("Seed complete.");
  console.log("  Login: demo@docvault.local / demo1234");
  console.log(`  Persons: ${self.name}, ${spouse.name}, ${child.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
