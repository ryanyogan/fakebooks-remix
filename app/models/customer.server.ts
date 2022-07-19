import { db } from "~/utils/db.server";

export async function getFirstCustomer() {
  return db.customer.findFirst();
}
