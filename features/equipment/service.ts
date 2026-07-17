import { listEquipment } from "./repository";

export async function getEquipmentList() {
  return listEquipment();
}
