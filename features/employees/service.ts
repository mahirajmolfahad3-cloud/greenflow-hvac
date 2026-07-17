import { listEmployees } from "./repository";

export async function getEmployeesList() {
  return listEmployees();
}
