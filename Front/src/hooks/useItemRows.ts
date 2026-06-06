import { useCallback, useMemo, useState } from "react";
import type { ItemRow, Material } from "../types";

let rowCounter = 0;

function makeRow(): ItemRow {
  rowCounter += 1;
  return { id: rowCounter, qty: 1, query: "", picked: null };
}

/** Manages the list of qty/search rows used by Donate and Party tabs. */
export function useItemRows(divisor: number) {
  const [rows, setRows] = useState<ItemRow[]>(() => [makeRow()]);

  const addRow = useCallback(() => setRows((r) => [...r, makeRow()]), []);

  const removeRow = useCallback(
    (id: number) => setRows((r) => r.filter((row) => row.id !== id)),
    []
  );

  const patchRow = useCallback(
    (id: number, patch: Partial<ItemRow>) =>
      setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row))),
    []
  );

  const setQty = useCallback(
    (id: number, qty: number) => patchRow(id, { qty }),
    [patchRow]
  );

  const setQuery = useCallback(
    (id: number, query: string) => patchRow(id, { query, picked: null }),
    [patchRow]
  );

  const pick = useCallback(
    (id: number, picked: Material) => patchRow(id, { picked, query: picked.n }),
    [patchRow]
  );

  const reset = useCallback(() => setRows([makeRow()]), []);

  const total = useMemo(
    () =>
      rows.reduce(
        (sum, r) => (r.picked ? sum + (r.picked.p * r.qty) / divisor : sum),
        0
      ),
    [rows, divisor]
  );

  const summary = useMemo(
    () =>
      rows
        .filter((r) => r.picked)
        .map((r) => `${r.qty}× ${r.picked!.n}`)
        .join(", "),
    [rows]
  );

  return { rows, addRow, removeRow, setQty, setQuery, pick, reset, total, summary };
}
