import { GRADE_COLOR } from "../data/materials";
import { searchMaterials, fmt } from "../lib/search";
import type { ItemRow, Material } from "../types";

interface RowsApi {
  rows: ItemRow[];
  addRow: () => void;
  removeRow: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  setQuery: (id: number, q: string) => void;
  pick: (id: number, m: Material) => void;
}

interface ItemRowEditorProps {
  api: RowsApi;
  divisor: number;
}

/** Renders qty + inline-search rows; suggestions expand the row downward (never a floating dropdown). */
export function ItemRowEditor({ api, divisor }: ItemRowEditorProps) {
  const { rows, addRow, removeRow, setQty, setQuery, pick } = api;

  return (
    <>
      {rows.map((row) => {
        const matches =
          row.picked || !row.query.trim() ? [] : searchMaterials(row.query);
        const showNoMatch = !row.picked && row.query.trim() && matches.length === 0;

        return (
          <div
            key={row.id}
            className="bg-panel2 border border-border rounded-xl p-2.5 mb-2.5"
          >
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                value={row.qty}
                onChange={(e) => setQty(row.id, parseInt(e.target.value) || 0)}
                className="w-16 bg-[#0d0d0d] border border-border text-text rounded-lg py-2.5 text-[15px] text-center"
              />
              <input
                value={row.query}
                placeholder="Search item…"
                onChange={(e) => setQuery(row.id, e.target.value)}
                className="flex-1 bg-[#0d0d0d] border border-border text-text rounded-lg px-2.5 py-2.5 text-sm"
              />
              <button
                onClick={() => removeRow(row.id)}
                className="bg-none border-none text-[#666] text-xl cursor-pointer px-1"
              >
                ×
              </button>
            </div>

            {matches.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {matches.map((m) => (
                  <button
                    key={m.n}
                    onClick={() => pick(row.id, m)}
                    className="flex justify-between items-center bg-[#0d0d0d] border border-border rounded-lg px-2.5 py-2 cursor-pointer text-[13px] active:bg-[#181818]"
                  >
                    <span className="flex items-center gap-[7px]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: GRADE_COLOR[m.g] }}
                      />
                      {m.n}
                      <span
                        className="text-[9px] px-1.5 rounded font-bold"
                        style={{ color: GRADE_COLOR[m.g] }}
                      >
                        {m.g}
                      </span>
                    </span>
                    <span className="text-muted text-[11px]">
                      {m.p} adena · {fmt(m.p / divisor)}pt
                    </span>
                  </button>
                ))}
              </div>
            )}

            {showNoMatch && (
              <div className="mt-2 text-[#555] text-[13px] px-2.5 py-2">No match</div>
            )}

            {row.picked && (
              <div className="text-[13px] text-green mt-1.5 flex justify-between">
                <span>
                  ✓ {row.qty} × {row.picked.n}
                </span>
                <span>{fmt((row.picked.p * row.qty) / divisor)} pts</span>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addRow}
        className="w-full bg-transparent border border-dashed border-border text-gold rounded-[10px] py-2.5 text-[13px] cursor-pointer mb-3.5"
      >
        + Add Item
      </button>
    </>
  );
}
