import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import { requireUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);
  return json({});
}

export default function DashboardRoute() {
  return <div>Look at all these graphs!</div>;
}
