import type { Customer } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getInvoiceDerivedData } from "./invoice.server";

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

export async function getCustomerListItems() {
  return db.customer.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function getCustomerDetails(customerId: string) {
  const customer = await db.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      invoices: {
        select: {
          id: true,
          dueDate: true,
          number: true,
          lineItems: {
            select: {
              quantity: true,
              unitPrice: true,
            },
          },
          deposits: {
            select: { amount: true },
          },
        },
      },
    },
  });

  if (!customer) return null;

  const invoiceDetails = customer.invoices.map((invoice) => ({
    id: invoice.id,
    number: invoice.number,
    ...getInvoiceDerivedData(invoice),
  }));

  return { name: customer.name, email: customer.email, invoiceDetails };
}

export async function createCustomer({
  name,
  email,
}: Pick<Customer, "name" | "email">) {
  return db.customer.create({ data: { email, name } });
}
