import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

export default function IndexRoute() {
  return (
    <div>
      Go to the{" "}
      <Link className="text-blue-600 underline" to="sales">
        sales
      </Link>{" "}
      page...
    </div>
  );
}
