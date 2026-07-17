import { listInventory } from "./repository";

export async function getInventoryList() {
  return listInventory();
}
