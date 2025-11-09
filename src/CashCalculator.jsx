import React, { useEffect, useMemo, useState } from "react";
import { Coffee, Files, History, Trash2, IndianRupee } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ToWords } from "to-words";
import TeaCalculator from "./TeaCalculator";

/* ---------- Shared shell (Royal Ledger theme: deep navy + gold) ---------- */
const PanelCard = ({ children, className = "", interactive = false }) => (
  <div
    className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-400/25 via-indigo-300/10 to-transparent ${className}`}
  >
    <div className="relative rounded-2xl bg-[#0b0f1a]/95 backdrop-blur-md border border-indigo-400/20 shadow-[0_8px_28px_rgba(2,6,23,0.6)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(99,102,241,0.20)]" />
      <div className="relative z-10">{children}</div>
    </div>
  </div>
);

/* ---------- Money words ---------- */
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: { name: "Paisa", plural: "Paise", symbol: "" }
    }
  }
});

/* ---------- Config ---------- */
const denominations = [
  { value: 500, label: "₹500" },
  { value: 200, label: "₹200" },
  { value: 100, label: "₹100" },
  { value: 50, label: "₹50" },
  { value: 20, label: "₹20" },
  { value: 10, label: "₹10" }
];

const clamp = (n, min = 0, max = 999999) => Math.min(max, Math.max(min, n));

/* ---------- Component ---------- */
const CashCalculator = () => {
  const [counts, setCounts] = useState(denominations.map(() => ""));
  const [tally, setTally] = useState("");
  const [showTeaCalculator, setShowTeaCalculator] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  /* load saved state */
  useEffect(() => {
    const savedCounts = JSON.parse(localStorage.getItem("cashCounts") || "[]");
    const savedTally = localStorage.getItem("cashTally") || "";
    const savedHistory = JSON.parse(
      localStorage.getItem("cashHistory") || "[]"
    );
    if (
      Array.isArray(savedCounts) &&
      savedCounts.length === denominations.length
    ) {
      setCounts(savedCounts);
    }
    setTally(savedTally);
    setHistory(savedHistory);
  }, []);

  /* persist */
  useEffect(() => {
    localStorage.setItem("cashCounts", JSON.stringify(counts));
    localStorage.setItem("cashTally", tally);
  }, [counts, tally]);

  /* derived totals */
  const totalAmount = useMemo(
    () =>
      counts.reduce(
        (sum, count, i) =>
          sum + (parseInt(count, 10) || 0) * denominations[i].value,
        0
      ),
    [counts]
  );
  const totalNotes = useMemo(
    () => counts.reduce((sum, count) => sum + (parseInt(count, 10) || 0), 0),
    [counts]
  );
  const amountInWords = useMemo(
    () => toWords.convert(totalAmount, { currency: true }),
    [totalAmount]
  );
  const tallyNumber = Number(tally) || 0;
  const tallyDifference = tallyNumber - totalAmount;

  const handleChange = (index, value) => {
    const clean = String(value).replace(/[^\d]/g, "");
    setCounts((prev) => {
      const copy = [...prev];
      copy[index] = clean;
      return copy;
    });
  };

  const resetCounts = () => {
    setCounts(denominations.map(() => ""));
    setTally("");
    toast.success("Cleared");
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const copyDetails = () => {
    let details = "";
    counts.forEach((count, i) => {
      const n = parseInt(count, 10) || 0;
      if (n > 0) {
        const d = denominations[i];
        details += `${d.value}×${n}=${d.value * n}\n`;
      }
    });
    details += "=============\n";
    details += `Total ₹${totalAmount}\n`;
    details += `[Total ${totalNotes} Notes]`;
    const entry = {
      id: Date.now(),
      timestamp: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(new Date()),
      counts,
      totalAmount,
      totalNotes,
      tally,
      details
    };
    const updated = [entry, ...history];
    localStorage.setItem("cashHistory", JSON.stringify(updated));
    setHistory(updated);

    (navigator.clipboard?.writeText
      ? navigator.clipboard.writeText(details)
      : Promise.reject(new Error("Clipboard not available"))
    )
      .then(() => toast.success("Details copied"))
      .catch(() => {
        try {
          const ta = document.createElement("textarea");
          ta.value = details;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          toast.success("Details copied");
        } catch (err) {
          toast.error("Copy failed");
        }
      });
  };

  const deleteEntry = (id) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem("cashHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const deleteAll = () => {
    localStorage.removeItem("cashHistory");
    setHistory([]);
    toast.success("History cleared");
  };

  if (showTeaCalculator) return <TeaCalculator />;

  return (
    <div className="p-4 max-w-lg mx-auto text-white font-sans">
      {/* Toolbar */}
      <PanelCard className="mb-3">
        <div className="flex items-center justify-between px-3 py-3">
          <h1 className="text-xl font-bold text-amber-300">Cash Counter</h1>
          <div className="flex gap-2">
            <button
              className="h-10 w-10 rounded-xl bg-amber-400 text-black active:scale-95 transition flex items-center justify-center"
              onClick={() => setShowTeaCalculator(true)}
              title="Open Tea Calculator"
            >
              <Coffee className="w-5 h-5" />
            </button>
            <button
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition flex items-center justify-center"
              onClick={copyDetails}
              title="Copy summary"
            >
              <Files className="w-5 h-5" />
            </button>
            <button
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition flex items-center justify-center"
              onClick={() => setShowHistory((v) => !v)}
              title="Toggle history"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              className="h-10 w-10 rounded-xl bg-indigo-500/90 hover:bg-indigo-500 active:scale-95 transition flex items-center justify-center"
              onClick={resetCounts}
              title="Reset"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </PanelCard>

      {/* Tally vs Total */}
      <PanelCard className="mb-3">
        <div className="px-3 py-3">
          {/* Align both columns and center them perfectly */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-6">
            {/* Left: Tally */}
            <div className="flex flex-col justify-center">
              <label className="block text-sm mx-auto text-white/70 mb-2 text-center sm:text-left">
                Tally amount
              </label>
              <div className="flex items-center gap-2 h-[52px]">
                <span className="px-2 py-1 rounded-md bg-amber-400/15 text-sm text-amber-200">
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="flex-1 h-full px-3 rounded-lg bg-[#0a1324] border border-indigo-400/20 text-center focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  placeholder="Enter tally"
                  value={tally}
                  onChange={(e) => setTally(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Diff box (aligned with input box) */}
            <div className="flex flex-col justify-center items-end min-w-[160px] h-full">
              <label className="block text-sm  text-white/70 mb-2 text-center sm:text-right">
                Diff :
              </label>
              <div
                className={`inline-flex flex-col items-end justify-center px-4 py-2 h-[52px] rounded-lg text-sm font-semibold leading-tight whitespace-nowrap ${
                  tallyDifference < 0
                    ? "bg-emerald-500/15 text-emerald-300"
                    : tallyDifference > 0
                    ? "bg-rose-500/15 text-rose-300"
                    : "bg-white/5 text-white/70"
                }`}
              >
                <span className="text-xs">
                  {tallyDifference < 0
                    ? "+ greater by"
                    : tallyDifference > 0
                    ? "- less by"
                    : "—"}
                </span>
                <span className="text-xl font-semibold flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {Math.abs(tallyDifference).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Denominations grid */}
      <PanelCard className="mb-3">
        <div className="px-3 py-3">
          <div className="grid grid-cols-1 gap-2">
            {denominations.map((d, i) => {
              const count = parseInt(counts[i] || "0", 10) || 0;
              const rowTotal = count * d.value;
              return (
                <div
                  key={d.value}
                  className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded-md bg-white/5 text-indigo-200 text-sm">
                        {d.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-40 h-9 text-center rounded-lg bg-[#0a1324] border border-indigo-400/20 text-white"
                        value={counts[i]}
                        placeholder="0"
                        onChange={(e) => handleChange(i, e.target.value)}
                      />
                      <div className="w-28 text-sm tabular-nums text-amber-200 text-right">
                        ₹{rowTotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PanelCard>

      {/* Summary */}
      <PanelCard className="mb-3">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="text-indigo-200/80">Total Notes</div>
              <div className="text-xl font-semibold text-indigo-100">
                {totalNotes}
              </div>
            </div>
            <div className="text-right">
              <div className="text-indigo-200/80 text-sm">Total Amount</div>
              <div className="text-2xl font-bold text-amber-300">
                ₹{totalAmount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-indigo-200/80">
            {capitalize(amountInWords)}
          </div>
        </div>
      </PanelCard>

      {/* History */}
      {showHistory && (
        <PanelCard className="mb-2">
          <div className="px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-indigo-100">
                History
              </h2>
              {history.length > 0 && (
                <button
                  className="text-rose-400 text-sm hover:underline"
                  onClick={deleteAll}
                >
                  Delete All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-white/50 text-sm italic">No history yet.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-indigo-400/20 bg-indigo-400/5 p-2"
                  >
                    <div className="text-xs text-indigo-200/70 mb-1">
                      {entry.timestamp}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-indigo-50">
                      {entry.details}
                    </pre>
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-xs"
                        onClick={() => {
                          (navigator.clipboard?.writeText
                            ? navigator.clipboard.writeText(entry.details)
                            : Promise.reject(
                                new Error("Clipboard not available")
                              )
                          )
                            .then(() => toast.success("Copied"))
                            .catch(() => {
                              try {
                                const ta = document.createElement("textarea");
                                ta.value = entry.details;
                                document.body.appendChild(ta);
                                ta.select();
                                document.execCommand("copy");
                                document.body.removeChild(ta);
                                toast.success("Copied");
                              } catch {
                                toast.error("Copy failed");
                              }
                            });
                        }}
                      >
                        <Files size={14} />
                        Copy
                      </button>
                      <button
                        className="flex items-center gap-1 bg-rose-500/80 hover:bg-rose-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PanelCard>
      )}

      <Toaster />
    </div>
  );
};

export default CashCalculator;
