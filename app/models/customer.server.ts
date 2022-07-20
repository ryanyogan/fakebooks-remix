import { db } from "~/utils/db.server";

export async function getFirstCustomer() {
  return db.customer.findFirst();
}

export async function searchCustomers(query: string) {
  const customers = await db.customer.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  const lowerQuery = query.toLowerCase();

  return customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery)
    );
  });
}
