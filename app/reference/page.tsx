import Link from "next/link";

export const metadata = { title: "Clinic Reference — One Wellness Utah" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden mb-5">
      <div className="px-5 py-3 border-b border-[#163040] bg-[#0e1f24]">
        <h2 className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Table({ heads, rows }: { heads: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#163040]">
            {heads.map((h) => (
              <th key={h} className="text-left text-[#6b9ea8] text-xs font-mono uppercase tracking-wider pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#0e1f24] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 pr-4 font-mono ${j === 0 ? "text-[#e2f4f1]" : "text-[#00c9a7]"}`}>
                  {typeof cell === "number" ? cell.toLocaleString() : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReferencePage() {
  return (
    <div className="min-h-screen bg-[#060e10] text-[#e2f4f1] px-4 py-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-1">One Wellness Utah</p>
            <h1 className="text-2xl font-bold">Clinic Reference</h1>
            <p className="text-[#6b9ea8] text-sm mt-1">Quick-reference tables for common calculations</p>
          </div>
          <Link
            href="/"
            className="text-[#6b9ea8] hover:text-[#00c9a7] text-sm border border-[#163040] rounded-xl px-3 py-2 transition-colors"
          >
            ← Trainer
          </Link>
        </div>

        {/* Hormone Pellets (Biote) */}
        <Section title="Hormone Pellet Therapy (Biote)">
          <Table
            heads={["Patient Type", "Cost/Insertion", "Duration", "Sessions/Year"]}
            rows={[
              ["Women", "$350", "3–4 months", "3–4"],
              ["Men",   "$700", "4–5 months", "2–3"],
            ]}
          />
          <p className="text-[#6b9ea8] text-xs mt-3">
            Initial consultation: <span className="text-[#00c9a7]">$200</span> · Over 5,000 insertions performed
          </p>
        </Section>

        {/* Pellet Division Quick Table */}
        <Section title="Pellet ÷ Quick Reference">
          <p className="text-[#6b9ea8] text-xs mb-3">Total pellets ÷ pellets per insertion</p>
          <Table
            heads={["Total Pellets", "Per Insertion", "# Procedures"]}
            rows={[
              [100, 4, 25],  [200, 4, 50],  [400, 4, 100],
              [150, 5, 30],  [300, 5, 60],  [500, 5, 100],
              [120, 6, 20],  [240, 6, 40],  [480, 6, 80],
            ]}
          />
        </Section>

        {/* B12 / Vitamin Injections */}
        <Section title="Vitamin Injections">
          <Table
            heads={["Type", "Typical Doses/Vial", "Kits per Box", "Doses per Box"]}
            rows={[
              ["B12 (Cyanocobalamin)", "10", "—",  "10"],
              ["Vitamin D",            "10", "—",  "10"],
              ["Tri-Immune Boost",     "10", "—",  "10"],
            ]}
          />
          <p className="text-[#6b9ea8] text-xs mt-3">
            Typical injection cost: <span className="text-[#00c9a7]">$20–$40</span> per dose
          </p>
        </Section>

        {/* B12 Division Quick Table */}
        <Section title="B12 Dose ÷ Quick Reference">
          <Table
            heads={["Total Doses", "Doses/Kit", "# Kits"]}
            rows={[
              [50,  10, 5],  [100, 10, 10], [200, 10, 20],
              [75,  25, 3],  [150, 25, 6],  [300, 25, 12],
              [100, 50, 2],  [250, 50, 5],  [500, 50, 10],
            ]}
          />
        </Section>

        {/* Semaglutide / Weight Loss */}
        <Section title="Semaglutide & Weight Loss">
          <Table
            heads={["Medication", "Typical Weekly Dose", "Units/Month (4 wk)", "Units/Quarter"]}
            rows={[
              ["Semaglutide (starter)", "0.25 mg",   "1",   "3"],
              ["Semaglutide (maint.)",  "1 mg",      "4",   "12"],
              ["GIP + GLP-1 Combo",     "varies",    "4",   "12"],
              ["Sermorelin",            "varies",    "—",   "—"],
            ]}
          />
          <p className="text-[#6b9ea8] text-xs mt-3">
            Avg result: <span className="text-[#00c9a7]">14.92 lbs</span> in 60 days ·
            &nbsp;<span className="text-[#00c9a7]">20.96%</span> of patients reduce/eliminate medication
          </p>
        </Section>

        {/* Acousana */}
        <Section title="Acousana® Therapy">
          <Table
            heads={["Condition Type", "Min Sessions", "Max Sessions", "Success Rate"]}
            rows={[
              ["Acute pain",   "6", "8", "86%+"],
              ["Chronic pain", "6", "8", "86%+"],
            ]}
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-[#0e1f24] rounded-xl p-3 text-center">
              <p className="text-[#00c9a7] font-mono font-bold text-xl">6–8</p>
              <p className="text-[#6b9ea8] text-xs">Sessions per protocol</p>
            </div>
            <div className="bg-[#0e1f24] rounded-xl p-3 text-center">
              <p className="text-[#00c9a7] font-mono font-bold text-xl">86%+</p>
              <p className="text-[#6b9ea8] text-xs">Success rate</p>
            </div>
          </div>
        </Section>

        {/* NutraPack */}
        <Section title="Biote NutraPack">
          <Table
            heads={["Capsule", "Per Daily Packet", "30-Day Supply (total caps)"]}
            rows={[
              ["DIM SGS+",       "1", "30"],
              ["Methyl Factors+","2", "60"],
              ["ADK",            "1", "30"],
              ["Total",          "4", "120"],
            ]}
          />
          <p className="text-[#6b9ea8] text-xs mt-3">Ships in 30-day supply · Vegan, gluten-free, soy-free</p>
        </Section>

        {/* Mastery Program */}
        <Section title="One Wellness Mastery Program">
          <Table
            heads={["Tier", "Cost", "FSA/HSA Eligible"]}
            rows={[
              ["Standard",  "$1,000", "Yes"],
              ["Premium",   "$2,000", "Yes"],
            ]}
          />
          <p className="text-[#6b9ea8] text-xs mt-3">Includes physician evaluation, diagnostic tests, personalized diet plan, coaching, and supplement regimen.</p>
        </Section>

        {/* Common Division Cheat Sheet */}
        <Section title="Common Division Quick Reference">
          <p className="text-[#6b9ea8] text-xs mb-3">Frequently used totals ÷ per-unit values</p>
          <Table
            heads={["Total", "÷ Per", "= Answer"]}
            rows={[
              [2200, 200, 11], [1500, 500, 3],  [3000, 100, 30],
              [2400, 400, 6],  [1000,  50, 20], [2500, 250, 10],
              [1800, 600, 3],  [4800, 400, 12], [3600, 300, 12],
              [2000, 250, 8],  [5000, 500, 10], [7200, 600, 12],
            ]}
          />
        </Section>

        <p className="text-center text-[#163040] text-xs font-mono tracking-widest mt-8 mb-4">
          ONE WELLNESS UTAH · 1568 S 500 W Suite 101, Woods Cross, UT · (801) 874-2388
        </p>
      </div>
    </div>
  );
}
