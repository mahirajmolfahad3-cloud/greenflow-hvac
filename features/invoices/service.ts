import { listInvoices } from "./repository";

export async function getInvoiceList() {
  return listInvoices();
}

export async function getOutstandingBalanceCents() {
  const invoices = await listInvoices();
  return invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.totalCents, 0);
}
