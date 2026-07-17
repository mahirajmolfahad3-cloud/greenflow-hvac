import { listCustomers, getCustomerById } from "./repository";

export async function getCustomerList(search?: string) {
  const customers = await listCustomers();
  if (!search) return customers;
  const q = search.toLowerCase();
  return customers.filter((c) => c.name.toLowerCase().includes(q));
}

export async function getCustomerProfile(id: string) {
  return getCustomerById(id);
}
