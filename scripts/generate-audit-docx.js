// Generate Pamoja+ Audit & Revisions report as a .docx
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, PageBreak, Footer, PageNumber, Header
} = require("docx");

const GREEN = "2BB24C";
const GREEN_DARK = "1E8A39";
const YELLOW = "F5C518";
const INK = "0F1B14";
const LINE = "E4E9E2";

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };

// ---------- helpers ----------
const T = (text, opts = {}) => new TextRun({ text, font: "Arial", ...opts });

const P = (text, opts = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [T(text)],
  spacing: { before: 80, after: 80 },
  ...opts
});

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [T(text, { size: 36, bold: true, color: GREEN_DARK })],
  spacing: { before: 360, after: 200 }
});

const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [T(text, { size: 28, bold: true, color: INK })],
  spacing: { before: 280, after: 140 }
});

const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [T(text, { size: 22, bold: true, color: GREEN_DARK })],
  spacing: { before: 200, after: 100 }
});

const Bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [T(text)],
  spacing: { before: 40, after: 40 }
});

const cell = (children, opts = {}) => new TableCell({
  borders,
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: Array.isArray(children) ? children : [children]
});

function changeTable(items) {
  const colWidths = [780, 2860, 2860, 2860];
  const head = new TableRow({
    tableHeader: true,
    children: [
      cell(P([T("#", { bold: true, color: "FFFFFF" })]), { width: colWidths[0], fill: INK }),
      cell(P([T("Original / Issue", { bold: true, color: "FFFFFF" })]), { width: colWidths[1], fill: INK }),
      cell(P([T("Why it matters", { bold: true, color: "FFFFFF" })]), { width: colWidths[2], fill: INK }),
      cell(P([T("Recommended Revision", { bold: true, color: "FFFFFF" })]), { width: colWidths[3], fill: INK })
    ]
  });
  const rows = items.map((it, i) => new TableRow({
    children: [
      cell(P([T(String(i + 1), { bold: true })]), { width: colWidths[0] }),
      cell(P([T(it.orig)]), { width: colWidths[1] }),
      cell(P([T(it.why)]), { width: colWidths[2] }),
      cell(P([T(it.fix, { bold: true, color: GREEN_DARK })]), { width: colWidths[3], fill: "F7FBF6" })
    ]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [head, ...rows]
  });
}

// ---------- content ----------
const payment = [
  { orig: '"Tigo Pesa" listed as a current mobile money brand.',
    why: 'Tigo Tanzania rebranded to Yas in 2024; Tigo Pesa is now Mixx by Yas. Using the old name signals outdated market knowledge to partners.',
    fix: 'Replace "Tigo Pesa" with "Mixx by Yas" throughout the document.' },
  { orig: 'List of mobile money options omits T-Pesa.',
    why: 'TTCL\'s T-Pesa is relevant for government-leaning customers and rural reach.',
    fix: 'Add "T-Pesa (TTCL)" to the list of supported/optional mobile money providers.' },
  { orig: 'Card payments classified as "Later" with no diaspora carve-out.',
    why: 'Tanzanian diaspora (UK, US, UAE, SA) is a real early revenue source for wellness and fashion categories.',
    fix: 'Add card support via Flutterwave / Selcom / Pesapal / DPO by Month 3, specifically for diaspora customers.' },
  { orig: 'No mention of TZ payment aggregators.',
    why: 'Selcom, Clickpesa, Pesapal, DPO, and Flutterwave are the dominant aggregators; choosing one is a Month-2 decision that affects checkout architecture.',
    fix: 'Add a shortlist: Selcom (broadest MMO coverage), Clickpesa (TZ-native, developer-friendly), Pesapal (pan-EA, card-strong), DPO, Flutterwave.' },
  { orig: 'Commission stated as 3–5% with no note on mobile money MDR.',
    why: 'M-Pesa / Mixx by Yas merchant pricing (1.5–2.5%) eats meaningfully into the stated commission margin.',
    fix: 'Add a note that net commission ≈ gross commission − ~1.5–2.5% mobile money MDR. Plan pricing accordingly.' },
  { orig: 'No regional price elasticity (Dar vs Mwanza/Dodoma).',
    why: 'TZS 35,000 may convert well in Dar es Salaam but face resistance in secondary cities.',
    fix: 'Add a sentence: "Regional pricing will be reviewed before any expansion outside Dar es Salaam."' },
  { orig: '"Mobile money transaction cost, if charged by the provider" is vague.',
    why: 'Bank of Tanzania has capped certain fees. Sellers and shoppers will ask who absorbs the cost.',
    fix: 'State explicitly: "Mobile money transaction fees are paid by the customer for purchases and by Pamoja+ for subscription billing."' }
];

const legal = [
  { orig: 'TMDA (Tanzania Medicines and Medical Devices Authority) not named.',
    why: 'TMDA replaced TFDA in 2019. It regulates cosmetics, supplements, and health-claim products — exactly the categories Pamoja+ intends to host (wellness, beauty).',
    fix: 'Add TMDA as the regulator for cosmetics, supplements, and any health/medical device claims. All listings in these categories must be TMDA-aware.' },
  { orig: 'TBS (Tanzania Bureau of Standards) not named.',
    why: 'TBS clearance and marking is required for many packaged goods, food, electronics, and imports.',
    fix: 'Add TBS for product standards covering food packaging, electronics, and imported goods.' },
  { orig: 'TCRA (Tanzania Communications Regulatory Authority) not named.',
    why: 'Online content services may require TCRA\'s Content Service Licence. Influencer/ambassador campaigns can fall under this.',
    fix: 'Add a note: "Counsel to confirm whether Pamoja+ requires a TCRA Content Service Licence, especially as paid promotion volume grows."' },
  { orig: 'FCC (Fair Competition Commission) not named.',
    why: 'FCC is the actual regulator for misleading advertising and consumer protection in Tanzania.',
    fix: 'Replace generic "fair competition and consumer protection framework" with "Fair Competition Commission (FCC) and Fair Competition Tribunal (FCT) for appeals."' },
  { orig: 'VAT threshold value missing.',
    why: 'The mandatory VAT registration threshold is currently TZS 200,000,000 annual turnover. Without the number, the team cannot monitor proactively.',
    fix: 'State explicitly: "VAT registration is mandatory once annual taxable turnover exceeds TZS 200,000,000."' },
  { orig: 'EFD requirement not mentioned.',
    why: 'Once VAT-registered, TRA requires an Electronic Fiscal Device (EFD) or Virtual Fiscal Device (VFD) for every receipt — material operational cost.',
    fix: 'Add: "Upon VAT registration, Pamoja+ must obtain and operate an EFD or VFD for compliant invoicing."' },
  { orig: 'SDL trigger not stated.',
    why: 'Skills Development Levy is 3.5% of gross emoluments, payable by employers with 10 or more employees. The threshold is a key planning lever.',
    fix: 'Add: "SDL of 3.5% of gross emoluments becomes payable once Pamoja+ has 10 or more employees."' },
  { orig: 'NSSF vs PSSSF ambiguous.',
    why: 'NSSF is for private sector employees; PSSSF is for public sector. For clarity to staff and counsel.',
    fix: 'Clarify: "As a private sector employer, Pamoja+ will register with NSSF (not PSSSF)."' },
  { orig: 'WCF rate not stated.',
    why: 'Workers Compensation Fund contribution is approximately 0.5% of gross emoluments — needed for accurate budgeting.',
    fix: 'Add: "WCF contribution is ~0.5% of gross emoluments, payable by the employer."' },
  { orig: 'Local Service Levy referred to as "where applicable" without a rate.',
    why: 'Up to 0.3% of turnover in many councils (incl. Dar es Salaam). Vagueness here is a budgeting risk.',
    fix: 'Add: "Local Service Levy is up to 0.3% of turnover; confirm exact rate with the relevant Local Government Authority."' },
  { orig: 'PDPC registration described as "assessment of whether registration is required".',
    why: 'Tanzania\'s Personal Data Protection Act 2022 plus Regulations 2023 require data controllers/processors to register with PDPC. For a marketplace handling buyer, seller, and ambassador data, this is almost certainly required.',
    fix: 'Restate as: "Pamoja+ will register with the Personal Data Protection Commission (PDPC) as a data controller before public launch."' },
  { orig: 'Trademark scope limited to BRELA.',
    why: 'For regional protection (Kenya, Uganda, Rwanda — future expansion markets), ARIPO filing is the appropriate next step.',
    fix: 'Add: "Phase 2 — consider ARIPO regional trade mark filing once Pamoja+ targets cross-border expansion."' },
  { orig: 'Ambassador rewards described without any withholding-tax note.',
    why: 'Cash payments to ambassadors above TRA thresholds may trigger withholding tax (WHT 5% on services to residents).',
    fix: 'Add to the Ambassador Agreement: "Where applicable, Pamoja+ shall withhold tax in accordance with TRA rules."' }
];

const company = [
  { orig: 'Smart quotes rendered as ? in several places (encoding issue in source .docx).',
    why: 'Affects readability and professionalism of the printed/exported document.',
    fix: 'Re-save the document in UTF-8; replace stray "?" with proper curly quotes (" " \' \').' },
  { orig: '"To become Tanzania\'s leading community-powered digital marketplace" stated as a vision (regulator-sensitive).',
    why: '"Leading" is fine; the legal doc separately recommends starting as a listing/referral marketplace, not a full national platform.',
    fix: 'Soften early-stage external claims; reserve "leading national marketplace" wording for post-Phase-2 communications.' },
  { orig: 'No clear segmentation for diaspora shoppers.',
    why: 'Diaspora is identified in the Payment audit as an early revenue source; the Profile should mention it.',
    fix: 'Add to the Consumer Audience list: "Tanzanian diaspora customers seeking to support local brands and send orders home."' }
];

const timeline = [
  { orig: 'Month 1 target "15–20 sellers, 50+ listings" with no city/zone specified.',
    why: 'Operational discipline collapses if seller outreach spreads geographically too early.',
    fix: 'Constrain Month 1 to Dar es Salaam only (Kinondoni, Ilala, Ubungo). No outreach to Mwanza, Arusha, or Dodoma until Month 4+ review.' },
  { orig: 'No content-language guidance.',
    why: 'Tanzania is functionally bilingual; Swahili-first builds trust faster than English-only.',
    fix: 'Add: "Captions and shopper-facing content are Swahili-first; English used as a secondary language for diaspora and partners."' },
  { orig: 'Ambassador recruitment in Month 2 with no vetting SOP referenced.',
    why: 'An unvetted ambassador can damage the brand quickly in WhatsApp groups.',
    fix: 'Reference: "Recruit per Ambassador Verification SOP (see SOP pack)."' },
  { orig: 'Paid promotion test prices (TZS 25,000 / 50,000) inconsistent with Payment doc daily boost (TZS 5,000/day).',
    why: 'Sellers comparing the two will be confused; pricing must be a single ladder.',
    fix: 'Reconcile to: "Daily boost TZS 5,000 / Weekly boost TZS 25,000 / Featured slot TZS 50,000/week."' },
  { orig: '"First revenue target TZS 300,000 – 1,500,000" with no unit (per month? cumulative?).',
    why: 'Without a unit this is unmeasurable.',
    fix: 'Clarify: "Cumulative across the first 3 months."' }
];

const team = [
  { orig: 'Ambassador rewards listed in TZS without WHT cross-reference.',
    why: 'Same compliance risk flagged in the Legal audit.',
    fix: 'Add: "Rewards are subject to applicable withholding tax per TRA rules; refer to the Ambassador Agreement."' },
  { orig: 'No founder equity / cap table placeholder.',
    why: 'Investor conversations begin earlier than expected; absence here delays diligence.',
    fix: 'Add a section: "Founder Equity & Option Pool — to be drafted before any external fundraising conversation."' },
  { orig: 'Field Representative role with no transport allowance budgeted.',
    why: 'Field visits in Dar require daladala/Bolt budget; not budgeting it pushes the cost to the rep informally.',
    fix: 'Add a line item under Finance: "Field transport allowance — estimated TZS 100,000–250,000 per rep per month."' },
  { orig: '"Outsourced Legal" mentioned without a retainer estimate.',
    why: 'Founders need a planning number.',
    fix: 'Add: "Typical TZ early-stage legal retainer: TZS 500,000 – 1,500,000 per month."' },
  { orig: 'Team doc seller targets ("15–30 businesses per week") conflict with Timeline doc (15–20 per month in Month 1).',
    why: 'Two source documents stating different ambition levels create execution confusion.',
    fix: 'Adopt the Timeline doc\'s ambition for Q1. The Team doc\'s weekly target applies from Month 4 onward, post-pilot.' }
];

// ---------- document ----------
const doc = new Document({
  creator: "Claude",
  title: "Pamoja+ Audit & Revisions",
  description: "Tanzanian-market audit and recommended revisions across all five source documents.",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } }
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 300 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [T("Pamoja+ — Audit & Revisions", { color: "888888", size: 18 })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [T("Page ", { color: "888888", size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], color: "888888", size: 18, font: "Arial" })]
        })]
      })
    },
    children: [
      // Cover
      new Paragraph({
        children: [T("Pamoja+", { size: 56, bold: true, color: GREEN_DARK })],
        spacing: { before: 1200, after: 80 }
      }),
      new Paragraph({
        children: [T("Audit & Revisions", { size: 40, bold: true, color: INK })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [T("Tanzanian-market review of the five Pamoja+ source documents.", { size: 24, color: "3A4A40" })],
        spacing: { after: 600 }
      }),
      new Paragraph({
        children: [T("Prepared by: Claude  ·  Date: " + new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
          { size: 20, color: "3A4A40" })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [T("Status: For founder and counsel review", { size: 20, color: "3A4A40", italics: true })],
        spacing: { after: 800 }
      }),
      new Paragraph({
        children: [T("Grow Together. Shop Smarter.", { size: 24, bold: true, color: GREEN })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // Executive summary
      H1("1. Executive Summary"),
      P("This document audits the five Pamoja+ source documents against the current Tanzanian market and regulatory environment. It identifies the issues found, explains why each matters, and proposes a recommended revision."),
      P("The review focuses on factual accuracy (regulator names, rates, thresholds), market currency (mobile money brands, aggregators), commercial coherence (pricing across docs), and Phase-1 operational discipline (city scope, content language)."),
      P("Headline findings:"),
      Bullet("Mobile money list is out of date — \"Tigo Pesa\" is now \"Mixx by Yas\" (rebranded 2024)."),
      Bullet("Several critical Tanzanian regulators are missing — TMDA, TBS, TCRA, FCC."),
      Bullet("VAT threshold (TZS 200M) and EFD/VFD obligation are not stated."),
      Bullet("PDPC registration should be treated as required, not as something to assess."),
      Bullet("Ambassador rewards need a withholding-tax clause."),
      Bullet("Pricing and seller-count targets are inconsistent across the Timeline and Team documents."),
      P("Recommended next step: founders sign off on the revisions in this report, counsel reviews the legal-doc table specifically, and the source documents are reissued as Version 2."),
      new Paragraph({ children: [new PageBreak()] }),

      H1("2. Document 1 — Company Profile"),
      H2("Revisions"),
      changeTable(company),
      new Paragraph({ children: [new PageBreak()] }),

      H1("3. Document 2 — Legal Considerations (Tanzania)"),
      P("This is the highest-priority section. All items should be reviewed by counsel before any legal page is published."),
      H2("Revisions"),
      changeTable(legal),
      new Paragraph({ children: [new PageBreak()] }),

      H1("4. Document 3 — 3-Month Timeline"),
      H2("Revisions"),
      changeTable(timeline),
      new Paragraph({ children: [new PageBreak()] }),

      H1("5. Document 4 — Team Structure & Management"),
      H2("Revisions"),
      changeTable(team),
      new Paragraph({ children: [new PageBreak()] }),

      H1("6. Document 5 — Payment Structure"),
      H2("Revisions"),
      changeTable(payment),
      new Paragraph({ children: [new PageBreak()] }),

      H1("7. Corrected Reference Sheet"),
      P("Quick facts the team can rely on while revising the source documents."),

      H2("Mobile money — correct current names (2026)"),
      Bullet("M-Pesa — Vodacom Tanzania"),
      Bullet("Mixx by Yas — Yas Tanzania (rebranded from Tigo Pesa, 2024)"),
      Bullet("Airtel Money — Airtel Tanzania"),
      Bullet("Halopesa — Halotel"),
      Bullet("AzamPesa — Azam Group"),
      Bullet("T-Pesa — TTCL"),

      H2("Payment aggregators to shortlist"),
      Bullet("Selcom — broadest MMO coverage, single API"),
      Bullet("Clickpesa — TZ-native, developer-friendly"),
      Bullet("Pesapal — pan-East-Africa, strong card support"),
      Bullet("Flutterwave — diaspora and international cards"),
      Bullet("DPO Pay — long-established, card-focused"),

      H2("Key Tanzanian regulators"),
      Bullet("BRELA — company and trademark registration"),
      Bullet("TRA — tax (TIN, VAT, PAYE, WHT, EFD)"),
      Bullet("PDPC — personal data protection (registration required)"),
      Bullet("TCRA — communications and content service licensing"),
      Bullet("TMDA — medicines, cosmetics, supplements, medical devices"),
      Bullet("TBS — product standards (food, electronics, imports)"),
      Bullet("FCC — fair competition and consumer protection (FCT for appeals)"),
      Bullet("NSSF — social security (private sector)"),
      Bullet("WCF — workers compensation"),
      Bullet("BoT — banking and mobile money supervision (indirect)"),

      H2("Tax thresholds and rates (verify with advisor)"),
      Bullet("VAT mandatory registration threshold: TZS 200,000,000 annual turnover"),
      Bullet("VAT rate: 18%"),
      Bullet("Corporate income tax (resident company): 30%"),
      Bullet("SDL: 3.5% of gross emoluments (employers with 10 or more employees)"),
      Bullet("NSSF: 20% combined (10% employer + 10% employee)"),
      Bullet("WCF: approximately 0.5% of gross emoluments"),
      Bullet("Local Service Levy: up to 0.3% of turnover, council-dependent"),
      Bullet("PAYE: progressive, 0–30%"),
      Bullet("WHT on service fees to residents: 5%"),
      P([T("Note: ", { bold: true }), T("All rates above are indicative and must be confirmed with a TRA-registered tax advisor before being quoted externally.", { italics: true })]),

      new Paragraph({ children: [new PageBreak()] }),

      H1("8. Sign-off"),
      P("This audit report is for internal review. Once founders and counsel have accepted the proposed revisions, the source documents should be reissued as Version 2 and circulated to the team."),
      P(" "),
      P("Founders: ______________________________     Date: ________________"),
      P(" "),
      P("Counsel:   ______________________________     Date: ________________"),
      P(" "),
      P([T("Pamoja+ — Grow Together. Shop Smarter.", { bold: true, color: GREEN_DARK })])
    ]
  }]
});

const outPath = path.join(__dirname, "..", "docs", "Pamoja_Plus_Audit_and_Revisions.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log("Wrote:", outPath, "(" + buf.length + " bytes)");
});
