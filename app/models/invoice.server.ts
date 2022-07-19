import type { LineItem } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getDaysToDueDate } from "~/utils/helpers";

export type DueStatus = "paid" | "overpaid" | "overdue" | "due";

export function getInvoiceDerivedData(invoice: {
  dueDate: Date;
  lineItems: Array<{ quantity: number; unitPrice: number }>;
  deposits: Array<{ amount: number }>;
}) {
  const daysToDueDate = getDaysToDueDate(invoice.dueDate);

  const totalAmount = invoice.lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  const totalDeposits = invoice.deposits.reduce(
    (acc, deposit) => acc + deposit.amount,
    0
  );

  const dueStatus: DueStatus =
    totalAmount === totalDeposits
      ? "paid"
      : totalDeposits > totalAmount
      ? "overpaid"
      : daysToDueDate < 0
      ? "overdue"
      : "due";

  const dueStatusDisplay =
    dueStatus === "paid"
      ? "Paid"
      : dueStatus === "overpaid"
      ? "Overpaid"
      : dueStatus === "overdue"
      ? "Overdue"
      : daysToDueDate === 0
      ? "Due today"
      : daysToDueDate === 1
      ? "Due tomorrow"
      : `Due in ${daysToDueDate} days`;

  return {
    totalAmount,
    totalDeposits,
    daysToDueDate,
    dueStatus,
    dueStatusDisplay,
  };
}

export async function getFirstInvoice() {
  return db.invoice.findFirst();
}

export async function getInvoiceListItems() {
  const invoices = await db.invoice.findMany({
    select: {
      id: true,
      dueDate: true,
      number: true,
      customer: {
        select: { name: true },
      },
      lineItems: {
        select: { quantity: true, unitPrice: true },
      },
      deposits: {
        select: { amount: true },
      },
    },
  });

  return invoices.map((invoice) => ({
    id: invoice.id,
    name: invoice.customer.name,
    number: invoice.number,
    ...getInvoiceDerivedData(invoice),
  }));
}

export async function getInvoiceDetails(invoiceId: string) {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      number: true,
      invoiceDate: true,
      dueDate: true,
      customer: {
        select: { id: true, name: true },
      },
      lineItems: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          description: true,
        },
      },
      deposits: {
        select: { id: true, amount: true, depositDate: true },
      },
    },
  });

  if (!invoice) return null;
  return { invoice, ...getInvoiceDerivedData(invoice) };
}

export type LineItemFields = Pick<
  LineItem,
  "quantity" | "unitPrice" | "description"
>;

export async function createInvoice({
  dueDate,
  customerId,
  lineItems,
}: {
  dueDate: Date;
  customerId: string;
  lineItems: Array<LineItemFields>;
}) {
  const largestInvoiceNumber = await db.invoice.findFirst({
    select: { number: true },
    orderBy: { number: "desc" },
  });
  const nextNumber = largestInvoiceNumber ? largestInvoiceNumber.number + 1 : 1;

  return db.invoice.create({
    data: {
      number: nextNumber,
      dueDate,
      customer: {
        connect: { id: customerId },
      },
      lineItems: {
        create: lineItems.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
      },
    },
  });
}
