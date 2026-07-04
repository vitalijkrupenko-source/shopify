// Dev-only seed data: three dummy businesses in different pipeline stages.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgoUtc(n: number): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

async function main() {
  await prisma.activity.deleteMany();
  await prisma.snapshot.deleteMany();
  await prisma.business.deleteMany();

  // 1. Fresh prospect
  const mia = await prisma.business.create({
    data: {
      name: "Salon Mia (demo)",
      city: "Ljubljana",
      phone: "+386 40 111 222",
      stage: "PROSPECT",
      notes: "Found via Google Maps. 4.6 stars but stagnant review count.",
      competitorName: "Salon Chic",
      competitorReviewCount: 210,
      snapshots: {
        create: [{ date: daysAgoUtc(0), rating: 4.6, reviewCount: 38 }],
      },
    },
  });

  // 2. Contacted, waiting on a reply — intentionally "stale" for the widget
  await prisma.business.create({
    data: {
      name: "Studio Lepote Nika (demo)",
      city: "Maribor",
      email: "info@studionika.example",
      stage: "CONTACTED",
      notes: "Sent intro email with competitor comparison.",
      competitorName: "Beauty Bar MB",
      competitorReviewCount: 156,
      snapshots: {
        create: [{ date: daysAgoUtc(6), rating: 4.4, reviewCount: 52 }],
      },
      activities: {
        create: [
          {
            type: "EMAIL_SENT",
            content: "Intro email: review stagnation vs Beauty Bar MB.",
            createdAt: daysAgoUtc(6),
          },
        ],
      },
    },
  });

  // 3. Active client with 60 days of snapshot history showing growth
  const ana = await prisma.business.create({
    data: {
      name: "Frizerstvo Ana (demo)",
      city: "Celje",
      phone: "+386 31 333 444",
      email: "ana@frizerstvo-ana.example",
      website: "https://frizerstvo-ana.example",
      stage: "CLIENT",
      pilotStartDate: daysAgoUtc(60),
      clientSince: daysAgoUtc(30),
      monthlyFee: 149,
      notes: "Pilot converted after +11 reviews in the first month.",
      activities: {
        create: [
          { type: "CALL", content: "Discovery call, agreed on 30-day pilot.", createdAt: daysAgoUtc(63) },
          { type: "STAGE_CHANGE", content: "Call booked → Pilot", createdAt: daysAgoUtc(60) },
          { type: "STAGE_CHANGE", content: "Pilot → Client", createdAt: daysAgoUtc(30) },
          { type: "NOTE", content: "QR stands delivered to the salon.", createdAt: daysAgoUtc(55) },
        ],
      },
    },
  });

  // Review count climbing from 41 → ~65 over 60 days
  let count = 41;
  let rating = 4.3;
  for (let d = 60; d >= 0; d -= 3) {
    await prisma.snapshot.create({
      data: {
        businessId: ana.id,
        date: daysAgoUtc(d),
        rating: Math.round(rating * 10) / 10,
        reviewCount: count,
      },
    });
    count += Math.random() < 0.5 ? 1 : 2;
    rating = Math.min(4.8, rating + 0.02);
  }

  console.log("Seeded 3 businesses:", mia.name, "· Studio Lepote Nika (demo) ·", ana.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
