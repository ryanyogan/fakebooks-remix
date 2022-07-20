import type { Deposit } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function createDeposit(
  data: Pick<Deposit, "invoiceId" | "amount" | "note" | "depositDate">
) {
  return db.deposit.create({ data });
}
