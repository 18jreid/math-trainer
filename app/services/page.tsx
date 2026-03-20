import Link from "next/link";

export const metadata = { title: "Services — One Wellness Utah" };

// ─── Shared primitives ────────────────────────────────────────────────────────

function Badge({ label, color = "teal" }: { label: string; color?: "teal" | "blue" | "green" | "orange" | "purple" }) {
  const palette: Record<string, string> = {
    teal:   "border-[#00c9a740] text-[#00c9a7]  bg-[#00c9a708]",
    blue:   "border-[#38bdf840] text-[#38bdf8]  bg-[#38bdf808]",
    green:  "border-[#4ade8040] text-[#4ade80]  bg-[#4ade8008]",
    orange: "border-[#fb923c40] text-[#fb923c]  bg-[#fb923c08]",
    purple: "border-[#a78bfa40] text-[#a78bfa]  bg-[#a78bfa08]",
  };
  return (
    <span className={`inline-block border rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${palette[color]}`}>
      {label}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#0e1f24] rounded-xl p-3 text-center flex-1">
      <p className="text-[#00c9a7] font-mono font-bold text-xl leading-none mb-1">{value}</p>
      <p className="text-[#6b9ea8] text-[10px]">{label}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-[#b0ccd5]">
      <span className="text-[#00c9a7] shrink-0 mt-0.5">›</span>
      <span>{children}</span>
    </li>
  );
}

function ServiceCard({
  accent = "teal",
  tag,
  title,
  subtitle,
  children,
}: {
  accent?: "teal" | "blue" | "green" | "orange" | "purple";
  tag: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const border: Record<string, string> = {
    teal:   "border-[#00c9a720]",
    blue:   "border-[#38bdf820]",
    green:  "border-[#4ade8020]",
    orange: "border-[#fb923c20]",
    purple: "border-[#a78bfa20]",
  };
  const bar: Record<string, string> = {
    teal:   "bg-[#00c9a7]",
    blue:   "bg-[#38bdf8]",
    green:  "bg-[#4ade80]",
    orange: "bg-[#fb923c]",
    purple: "bg-[#a78bfa]",
  };
  return (
    <section className={`border ${border[accent]} rounded-2xl bg-[#091418] overflow-hidden mb-5`}>
      <div className="flex items-stretch">
        <div className={`w-1 shrink-0 ${bar[accent]}`} />
        <div className="flex-1 p-5">
          <Badge label={tag} color={accent} />
          <h2 className="text-[#e2f4f1] text-lg font-bold mt-2 mb-0.5">{title}</h2>
          <p className="text-[#6b9ea8] text-xs mb-4">{subtitle}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#060e10] text-[#e2f4f1] px-4 py-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-1">One Wellness Utah</p>
            <h1 className="text-2xl font-bold">Services Guide</h1>
            <p className="text-[#6b9ea8] text-sm mt-1">Everything we offer — explained in detail</p>
          </div>
          <Link
            href="/"
            className="text-[#6b9ea8] hover:text-[#00c9a7] text-sm border border-[#163040] rounded-xl px-3 py-2 transition-colors shrink-0"
          >
            ← Trainer
          </Link>
        </div>

        {/* 1 — BHRT */}
        <ServiceCard
          accent="teal"
          tag="Hormone Health"
          title="Bioidentical Hormone Replacement Therapy"
          subtitle="Rebalancing the hormones your body relies on — for energy, mood, metabolism, and longevity."
        >
          <p className="text-sm text-[#b0ccd5] mb-4">
            Hormones are the body's chemical messengers. When they fall out of balance — due to aging, stress, or medical
            conditions — virtually every system is affected. One Wellness uses the BioTE® Method: tiny pellets inserted
            under the skin that release hormones <em>identically</em> to what your body naturally produces, delivering
            a steady, consistent dose 24/7.
          </p>

          <h3 className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-2">For Women</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>Restores estrogen, progesterone, and testosterone</Bullet>
            <Bullet>Relieves fatigue, brain fog, mood swings, hot flashes, low libido</Bullet>
            <Bullet>Supports healthy weight — hormone balance typically promotes fat loss</Bullet>
            <Bullet>Pellet insertion every 3–4 months (3–4 times per year)</Bullet>
          </ul>

          <h3 className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-2">For Men</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>Optimizes testosterone levels — energy, strength, mental clarity, drive</Bullet>
            <Bullet>Pellet insertion every 4–5 months (2–3 times per year)</Bullet>
            <Bullet>Framed as long-term longevity and disease prevention, not just symptom relief</Bullet>
          </ul>

          <h3 className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-2">How the Pellet Works</h3>
          <p className="text-sm text-[#b0ccd5] mb-4">
            A small pellet (about the size of a grain of rice) is inserted just under the skin near the hip or buttock.
            It dissolves slowly over months, delivering hormones directly into the bloodstream — no daily pills, no
            weekly injections. Over 5,000 insertions performed at One Wellness.
          </p>

          <div className="flex gap-3">
            <Stat value="$350" label="Women / insertion" />
            <Stat value="$700" label="Men / insertion" />
            <Stat value="$200" label="Initial consult" />
          </div>

          <div className="mt-3 border border-[#163040] rounded-xl p-3">
            <p className="text-[#6b9ea8] text-xs">
              <span className="text-[#00c9a7] font-semibold">BioTE NutraPack</span> — companion supplement taken daily
              during therapy. Contains DIM SGS+, Methyl Factors+, and ADK (4 capsules/day, 30-day supply).
              Vegan, gluten-free, soy-free.
            </p>
          </div>
        </ServiceCard>

        {/* 2 — Medical Weight Loss */}
        <ServiceCard
          accent="blue"
          tag="Weight Loss"
          title="Medical Weight Loss"
          subtitle="Clinically guided programs that target the root causes of weight gain — not just calories."
        >
          <p className="text-sm text-[#b0ccd5] mb-4">
            One Wellness takes a physician-supervised approach that goes beyond dieting. Every patient starts with a
            comprehensive evaluation (medical history, physical exam, lab work), then receives a personalized plan
            combining nutrition, exercise, behavioral strategies, and — where appropriate — prescription medications
            or peptide therapies.
          </p>

          <h3 className="text-[#38bdf8] text-xs font-mono uppercase tracking-widest mb-2">Peptide / GLP-1 Therapies</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>
              <strong className="text-[#e2f4f1]">Semaglutide</strong> — GLP-1 receptor agonist. Reduces appetite and
              slows gastric emptying. Started at 0.25 mg/week, titrated up to 1 mg/week for maintenance.
            </Bullet>
            <Bullet>
              <strong className="text-[#e2f4f1]">GIP + GLP-1 Combo</strong> — dual hormone therapy that addresses
              both appetite regulation and glucose metabolism for enhanced results.
            </Bullet>
            <Bullet>
              <strong className="text-[#e2f4f1]">Sermorelin</strong> — a growth hormone secretagogue that supports
              fat loss, lean muscle preservation, sleep quality, and recovery.
            </Bullet>
          </ul>

          <h3 className="text-[#38bdf8] text-xs font-mono uppercase tracking-widest mb-2">One Wellness Mastery Program</h3>
          <p className="text-sm text-[#b0ccd5] mb-3">
            The flagship 60-day intensive program. Includes physician evaluation, diagnostic labs, a personalized diet
            plan, coaching sessions, and a supplement regimen. FSA/HSA eligible.
          </p>

          <div className="flex gap-3 mb-4">
            <Stat value="14.92 lbs" label="Avg loss in 60 days" />
            <Stat value="~21%" label="Patients reduce meds" />
          </div>

          <div className="border border-[#163040] rounded-xl p-3">
            <p className="text-[#6b9ea8] text-xs">
              <span className="text-[#38bdf8] font-semibold">Program tiers:</span>{" "}
              Standard <span className="text-[#e2f4f1]">$1,000</span> · Premium{" "}
              <span className="text-[#e2f4f1]">$2,000</span> · Both FSA/HSA eligible
            </p>
          </div>
        </ServiceCard>

        {/* 3 — Acousana */}
        <ServiceCard
          accent="green"
          tag="Pain Management"
          title="Acousana® Therapy"
          subtitle="Drug-free, non-invasive acoustic wave technology that triggers the body's own healing response."
        >
          <p className="text-sm text-[#b0ccd5] mb-4">
            Acousana uses patented, FDA-approved <strong className="text-[#e2f4f1]">SoftWave® electrohydraulic technology</strong>.
            A technician identifies the exact source of pain, then delivers acoustic waves through the skin using
            ultrasound gel. The waves create a micro-signal that the body interprets as tissue damage — triggering a
            powerful biological healing cascade without any actual damage occurring.
          </p>

          <h3 className="text-[#4ade80] text-xs font-mono uppercase tracking-widest mb-2">What Happens in the Body</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>Increases blood flow and circulation to the target area</Bullet>
            <Bullet>Modulates and eliminates inflammation in damaged tissue</Bullet>
            <Bullet>Stimulates stem cell activation and tissue repair</Bullet>
            <Bullet>Reduces pain — often immediately after the first session</Bullet>
          </ul>

          <h3 className="text-[#4ade80] text-xs font-mono uppercase tracking-widest mb-2">Conditions Treated</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Tendonitis","Rotator cuff / Shoulder pain","Knee pain","Back pain","Chronic inflammation","Neuropathy","Acute injuries"].map((c) => (
              <span key={c} className="text-[10px] border border-[#4ade8030] text-[#4ade80] rounded-full px-2 py-0.5 font-mono">{c}</span>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            <Stat value="86%+" label="Success rate" />
            <Stat value="6–8" label="Sessions / protocol" />
            <Stat value="0" label="Downtime" />
          </div>

          <div className="border border-[#163040] rounded-xl p-3">
            <p className="text-[#6b9ea8] text-xs">
              Severe or chronic conditions may require a follow-up round of 2–4 treatments, scheduled 2–4 months after
              the initial protocol. Patients return to normal activities the same day.
            </p>
          </div>
        </ServiceCard>

        {/* 4 — Functional Medicine */}
        <ServiceCard
          accent="orange"
          tag="Root Cause Medicine"
          title="Functional Medicine"
          subtitle="Treating the whole person — not just the symptoms — with evidence-based integrative care."
        >
          <p className="text-sm text-[#b0ccd5] mb-4">
            Conventional medicine often treats symptoms in isolation. Functional Medicine asks <em>why</em> those
            symptoms exist. One Wellness combines traditional diagnostics with complementary medicine to uncover the
            root causes of chronic illness — whether hormonal, metabolic, gut-related, or lifestyle-driven.
          </p>

          <h3 className="text-[#fb923c] text-xs font-mono uppercase tracking-widest mb-2">The Process</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>Comprehensive health history — far more detailed than a standard intake</Bullet>
            <Bullet>Extensive lab work — beyond routine blood panels to identify subclinical imbalances</Bullet>
            <Bullet>Physical examination with functional assessment</Bullet>
            <Bullet>Personalized treatment plan: nutrition, lifestyle, stress management, nutraceuticals, hormones</Bullet>
          </ul>

          <h3 className="text-[#fb923c] text-xs font-mono uppercase tracking-widest mb-2">Areas of Focus</h3>
          <ul className="space-y-1.5 mb-4">
            <Bullet>
              <strong className="text-[#e2f4f1]">Gut microbiome</strong> — imbalances linked to digestive disorders,
              autoimmune disease, and mood conditions
            </Bullet>
            <Bullet>
              <strong className="text-[#e2f4f1]">Genetic & environmental factors</strong> — accounting for individual
              variation in how patients respond to treatment
            </Bullet>
            <Bullet>
              <strong className="text-[#e2f4f1]">Chronic disease prevention</strong> — framed as proactive optimization,
              not reactive symptom management
            </Bullet>
          </ul>

          <div className="border border-[#163040] rounded-xl p-3">
            <p className="text-[#6b9ea8] text-xs">
              Led by <span className="text-[#e2f4f1] font-semibold">Dr. Brian Rodgers, DO</span> — Board certified
              in Family Medicine, Functional Medicine, and Anti-Aging & Regenerative Medicine.
              Certified BioTE® provider. 29+ years of experience.
            </p>
          </div>
        </ServiceCard>

        {/* 5 — Aesthetic Injections */}
        <ServiceCard
          accent="purple"
          tag="Aesthetics"
          title="Aesthetic Injections (Botox)"
          subtitle="Conservative, personalized treatments to refresh your look — naturally."
        >
          <p className="text-sm text-[#b0ccd5] mb-4">
            One Wellness takes a subtle, patient-centered approach to aesthetic medicine. The goal is never a dramatic
            or overdone result — it's to help you look like the best version of yourself, refreshed and natural.
          </p>

          <ul className="space-y-1.5 mb-4">
            <Bullet>Softens fine lines and wrinkles with precision placement</Bullet>
            <Bullet>Results visible after a single treatment</Bullet>
            <Bullet>Effects last approximately 3–4 months</Bullet>
            <Bullet>Treatments can be maintained on an ongoing basis</Bullet>
            <Bullet>Personalized to your facial anatomy and aesthetic goals</Bullet>
          </ul>

          <div className="border border-[#163040] rounded-xl p-3">
            <p className="text-[#6b9ea8] text-xs">
              Administered by experienced nurse practitioners with backgrounds in ICU, family practice, and women's
              health. A conservative, clinical approach — not a med spa.
            </p>
          </div>
        </ServiceCard>

        {/* 6 — Providers */}
        <section className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[#163040] bg-[#0e1f24]">
            <h2 className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest">Our Providers</h2>
          </div>
          <div className="divide-y divide-[#0e1f24]">
            {[
              {
                name: "Dr. Brian Rodgers, DO",
                creds: "DO · FAARFM · ABAARM",
                bio: "29+ years of experience. Trained in family medicine, functional medicine, anti-aging & regenerative medicine, osteopathic medicine, bioidentical hormones, prolotherapy, neural therapy, and nutrition. BYU graduate. Certified BioTE® provider.",
              },
              {
                name: "Heather Vigil, NP",
                creds: "MSN · BSN · Nurse Practitioner",
                bio: "Master's in Nursing from Western Governors University, BSN from Weber State. Background in family practice, palliative and hospice care, and intensive care units.",
              },
              {
                name: "Jodi",
                creds: "Board-Certified Women's Health NP",
                bio: "20+ years in patient care. Specializes in preventative health with a focus on hormone health and weight management.",
              },
            ].map((p) => (
              <div key={p.name} className="px-5 py-4">
                <p className="text-[#e2f4f1] font-semibold text-sm">{p.name}</p>
                <p className="text-[#00c9a7] font-mono text-[10px] mb-1">{p.creds}</p>
                <p className="text-[#6b9ea8] text-xs leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact footer */}
        <div className="border border-[#163040] rounded-2xl bg-[#091418] p-5 mb-4">
          <p className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest mb-2">Contact & Location</p>
          <p className="text-[#e2f4f1] text-sm font-semibold">1568 S 500 W, Suite 101</p>
          <p className="text-[#6b9ea8] text-sm">Woods Cross, UT 84087</p>
          <p className="text-[#6b9ea8] text-sm mt-1">(801) 874-2388 · hello@onewellnessutah.com</p>
          <p className="text-[#6b9ea8] text-sm">Mon–Fri · 8:00 AM – 4:00 PM</p>
        </div>

        <p className="text-center text-[#163040] text-xs font-mono tracking-widest mb-4">
          ONE WELLNESS UTAH · WOODS CROSS, UT
        </p>
      </div>
    </div>
  );
}
