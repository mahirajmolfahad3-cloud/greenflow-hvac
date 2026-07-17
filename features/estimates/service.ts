import { listEstimates } from "./repository";
import type { Estimate } from "@/types";

/** Computes subtotal/tax/total for an estimate — kept out of UI components. */
export function calculateEstimateTotals(estimate: Estimate) {
  const subtotal = estimate.items.reduce((sum, i) => sum + i.quantity * i.unitPriceCents, 0);
  const taxable = subtotal - estimate.discountCents;
  const tax = Math.round(taxable * estimate.taxRate);
  return { subtotal, tax, total: taxable + tax };
}

export async function getEstimateList() {
  return listEstimates();
}
