import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { getFirstCustomer } from "~/models/customer.server";
import { getFirstInvoice } from "~/models/invoice.server";
import { requireUser } from "~/utils/session.server";

type LoaderData = {
  firstInvoiceId?: string;
  firstCustomerId?: string;
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "font-bold text-black" : "";

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);
  const [firstInvoice, firstCustoemr] = await Promise.all([
    getFirstInvoice(),
    getFirstCustomer(),
  ]);

  return json<LoaderData>({
    firstInvoiceId: firstInvoice?.id,
    firstCustomerId: firstCustoemr?.id,
  });
}

export default function SalesRoute() {
  const data = useLoaderData<typeof loader>();
  const matches = useMatches();
  const routeMatches = (route: string) =>
    matches.some((m) => m.id === `routes/__app/sales/${route}`);

  return (
    <div className="relative h-full p-10">
      <h1 className="font-display text-d-h3 text-black">Sales</h1>
      <div className="h-6" />
      <div className="flex gap-4 border-b border-gray-100 pb-4 text-[length:14px] font-medium text-gray-400">
        <NavLink
          to="."
          className={linkClassName({ isActive: routeMatches("index") })}
        >
          Overview
        </NavLink>
        <NavLink to="subscriptions" prefetch="intent" className={linkClassName}>
          Subscriptions
        </NavLink>
        <NavLink
          to={
            data.firstInvoiceId ? `invoices/${data.firstInvoiceId}` : "invoices"
          }
          prefetch="intent"
          className={linkClassName({ isActive: routeMatches("invoices") })}
        >
          Invoices
        </NavLink>
        <NavLink
          to={
            // data.firstCustomerId
            false ? `customers/${data.firstCustomerId}` : "customers"
          }
          prefetch="intent"
          className={linkClassName({ isActive: routeMatches("customers") })}
        >
          Customers
        </NavLink>
        <NavLink
          to="deposits"
          prefetch="intent"
          className={linkClassName({ isActive: routeMatches("deposits") })}
        >
          Deposits
        </NavLink>
      </div>
      <div className="h-4" />
      <Outlet />
    </div>
  );
}
