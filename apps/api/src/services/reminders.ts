import { prisma } from "@doc-vault/db";

const DEFAULT_DAYS = (process.env.REMINDER_DAYS_BEFORE ?? "30,7,1")
  .split(",")
  .map((d) => parseInt(d.trim(), 10))
  .filter((n) => !Number.isNaN(n));

export async function syncRemindersForDocument(
  userId: string,
  documentId: string,
  expiryDate: Date | null
): Promise<void> {
  await prisma.reminder.deleteMany({ where: { documentId, sent: false } });
  if (!expiryDate) return;

  for (const daysBefore of DEFAULT_DAYS) {
    const remindAt = new Date(expiryDate);
    remindAt.setDate(remindAt.getDate() - daysBefore);
    if (remindAt > new Date()) {
      await prisma.reminder.create({
        data: { userId, documentId, remindAt, daysBefore },
      });
    }
  }
}

function isDbUnreachable(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("Can't reach database server") || message.includes("P1001");
}

export function startReminderWorker(): void {
  const intervalMs = 60_000;
  let lastDbWarnAt = 0;

  setInterval(async () => {
    try {
      const due = await prisma.reminder.findMany({
        where: { sent: false, remindAt: { lte: new Date() } },
        include: { document: { include: { person: true } }, user: true },
      });

      for (const reminder of due) {
        console.log(
          `[REMINDER] ${reminder.user.email}: "${reminder.document.title}" (${reminder.document.person.name}) expires in ${reminder.daysBefore} day(s)`
        );
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { sent: true },
        });
      }
    } catch (err) {
      if (isDbUnreachable(err)) {
        const now = Date.now();
        if (now - lastDbWarnAt > 5 * 60_000) {
          console.warn(
            "[reminders] Postgres not reachable at localhost:5432. Start it with: pnpm docker:up"
          );
          lastDbWarnAt = now;
        }
        return;
      }
      console.error("Reminder worker error:", err);
    }
  }, intervalMs);
}
