import { Form, useActionData } from "@remix-run/react";
import { inputClasses, LabelText, submitButtonClasses } from "~/components";
import CustomerCombobox from "~/routes/resources/customers";

type ActionData = {
  errors: {
    customerId: string | null;
    dueDate: string | null;
    lineItems: Record<
      string,
      {
        quantity: string | null;
        unitPrice: string | null;
      }
    >;
  };
};

export default function NewInvoice() {
  const actionData = useActionData() as ActionData | undefined;

  return (
    <div className="relative p-10">
      <h2 className="mb-4 font-display">New Invoice</h2>
      <Form method="post" className="flex flex-col gap-4">
        <CustomerCombobox />
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <label htmlFor="dueDate">
              <LabelText>Due Date</LabelText>
            </label>
            {actionData?.errors.dueDate ? (
              <em id="dueDate-error" className="text-d-p-xs text-red-600">
                {actionData.errors.dueDate}
              </em>
            ) : null}
          </div>
          <input
            id="dueDate"
            name="dueDate"
            className={inputClasses}
            type="date"
            aria-invalid={Boolean(actionData?.errors.dueDate) || undefined}
            aria-errormessage={
              actionData?.errors.dueDate ? "dueDate-error" : undefined
            }
          />
        </div>

        <div>
          <button
            type="submit"
            name="intent"
            value="create"
            className={submitButtonClasses}
          >
            Create Invoice
          </button>
        </div>
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
