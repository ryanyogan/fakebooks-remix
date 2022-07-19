export function asUTC(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function fromNow(days: number) {
  return asUTC(
    new Date(asUTC(new Date()).getTime() + 1000 * 60 * 60 * 24 * days)
  );
}

export function getDaysToDueDate(date: Date) {
  return Math.ceil(
    date.getTime() - asUTC(new Date()).getTime() / (1000 * 60 * 60 * 24)
  );
}
