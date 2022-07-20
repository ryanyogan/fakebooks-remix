import { Form } from "@remix-run/react";
import CustomerCombobox from "~/routes/resources/customers";

export default function NewInvoice() {
  return (
    <div className="relative p-10">
      <h2 className="mb-4 font-display">New Invoice</h2>
      <Form method="post" className="flex flex-col gap-4">
        <CustomerCombobox />
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="absolute inset-0 flex justify-center bg-red-100 pt-4">
      <div className="text-center text-red-brand">
        <div className="text-[14px] font-bold">Oh snap!</div>
        <div className="px-2 text-[12px]">There was a problem. Sorry.</div>
      </div>
    </div>
  );
}
