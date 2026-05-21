// Pamoja+ source documents — Version 2 (clean rewrite with audit corrections applied)
// Outputs: docs/v2/Pamoja_Plus_<Name>_v2.docx (x5)

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, PageBreak, Footer, PageNumber, Header
} = require("docx");

// ---------- brand ----------
const GREEN = "2BB24C";
const GREEN_DARK = "1E8A39";
const INK = "0F1B14";
const INK_2 = "3A4A40";
const LINE_CLR = "E4E9E2";

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE_CLR };
const borders = { top: border, bottom: border, left: border, right: border };

// ---------- text helpers ----------
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
  children: [T(text, { size: 22, bold: true, color: GREEN_DARK })],
  spacing: { before: 200, after: 100 }
});

const Bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: Array.isArray(text) ? text : [T(text)],
  spacing: { before: 40, after: 40 }
});

const Numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  children: Array.isArray(text) ? text : [T(text)],
  spacing: { before: 40, after: 40 }
});

const cell = (children, opts = {}) => new TableCell({
  borders,
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: Array.isArray(children) ? children : [children]
});

function table(headers, rows) {
  const colCount = headers.length;
  const totalWidth = 9360;
  const colW = Math.floor(totalWidth / colCount);
  const widths = Array(colCount).fill(colW);
  // adjust last column to match exact sum
  widths[colCount - 1] = totalWidth - colW * (colCount - 1);

  const head = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(P([T(h, { bold: true, color: "FFFFFF" })]),
      { width: widths[i], fill: INK }))
  });
  const body = rows.map((r) => new TableRow({
    children: r.map((c, i) => cell(P([T(String(c))]),
      { width: widths[i], fill: i === 0 ? "F7FBF6" : undefined }))
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [head, ...body]
  });
}

const PB = () => new Paragraph({ children: [new PageBreak()] });

// ---------- cover + section wrapper ----------
function cover(title, subtitle, intro, tag = "Version 2 — Clean rewrite with audit corrections applied") {
  return [
    new Paragraph({
      children: [T("Pamoja+", { size: 56, bold: true, color: GREEN_DARK })],
      spacing: { before: 1200, after: 80 }
    }),
    new Paragraph({
      children: [T(title, { size: 40, bold: true, color: INK })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [T(subtitle, { size: 24, color: INK_2 })],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [T(intro, { size: 22, italics: true, color: INK_2 })],
      spacing: { after: 600 }
    }),
    new Paragraph({
      children: [T(tag, { size: 20, bold: true, color: GREEN_DARK })],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [T("Grow Together. Shop Smarter.", { size: 24, bold: true, color: GREEN })],
      alignment: AlignmentType.CENTER
    }),
    PB()
  ];
}

function makeSection(children) {
  return {
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
          children: [T("Pamoja+ — Version 2", { color: "888888", size: 18 })]
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
    children
  };
}

function makeDoc(children) {
  return new Document({
    creator: "Claude",
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    numbering: {
      config: [
        { reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
        { reference: "numbers",
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }
      ]
    },
    sections: [makeSection(children)]
  });
}

// ============================================================
// DOC 1 — COMPANY PROFILE v2
// ============================================================
function buildCompanyProfile() {
  return [
    ...cover("Company Profile",
      "Community-Powered Digital Marketplace",
      "Connecting people, brands, and opportunities across Tanzania through commerce, community, discovery, and shared value."),

    H1("1. Company Overview"),
    P("Pamoja+ is a community-powered digital marketplace built to connect people, brands, and opportunities across Tanzania. The platform empowers local businesses by increasing visibility, strengthening customer engagement, and helping them grow within a collaborative digital ecosystem."),
    P("At the same time, Pamoja+ gives shoppers a smarter, more meaningful way to discover products, access better deals, support local entrepreneurs, and participate in a growing community of conscious consumers."),
    P([T("The name "), T("Pamoja", { italics: true }), T(", meaning "), T("together", { italics: true }), T(", reflects the core belief behind the platform: growth becomes more powerful when businesses, shoppers, creators, and communities rise collectively.")]),
    P("Pamoja+ is more than a marketplace. It is a digital movement focused on discovery, savings, wellness, local empowerment, and shared value."),

    H1("2. Brand Description"),
    P("Pamoja+ brings together commerce and community by creating a space where businesses can showcase their products, tell their stories, attract loyal customers, and collaborate with others. For shoppers, the platform offers access to unique products, curated deals, wellness-driven brands, lifestyle discoveries, and limited-time offers that may otherwise go unnoticed."),
    P("Through active participation, users help amplify value by sharing deals, recommending products, tagging friends, supporting local sellers, and engaging with brand stories. This creates a self-sustaining ecosystem where visibility, trust, and opportunity are multiplied through community involvement."),

    H1("3. Vision Statement"),
    P("To become a leading community-powered digital marketplace in Tanzania where people, brands, and opportunities connect to create shared growth, smarter shopping, and stronger local economies."),

    H1("4. Mission Statement"),
    P("To empower local businesses with a dynamic digital platform to increase visibility, engage directly with customers, build loyal communities, and scale sustainably, while enabling shoppers to discover meaningful products, exclusive deals, and wellness-driven lifestyle choices."),

    H1("5. Core Purpose"),
    P("Pamoja+ exists to:"),
    Bullet("Support local businesses and entrepreneurs."),
    Bullet("Help shoppers discover unique and affordable products."),
    Bullet("Create a community-driven shopping culture."),
    Bullet("Promote conscious consumption and wellness."),
    Bullet("Encourage collaboration between brands, consumers, and partners."),
    Bullet("Build a digital ecosystem that benefits both businesses and customers."),

    H1("6. What Pamoja+ Offers"),
    H2("For Businesses"),
    Bullet("Showcase products and services."),
    Bullet("Share brand stories."),
    Bullet("Promote special offers and discounts."),
    Bullet("Build direct relationships with customers."),
    Bullet("Gain loyal followers and repeat buyers."),
    Bullet("Collaborate with other businesses."),
    Bullet("Increase market exposure across Tanzania."),
    Bullet("Strengthen brand credibility through community engagement."),
    H2("For Shoppers"),
    Bullet("Discover unique local products."),
    Bullet("Access exclusive deals and promotions."),
    Bullet("Support Tanzanian businesses."),
    Bullet("Find affordable essentials."),
    Bullet("Explore lifestyle and wellness brands."),
    Bullet("Share recommendations with friends."),
    Bullet("Participate in community challenges and rewards."),
    Bullet("Make more conscious purchasing decisions."),

    H1("7. Focus Areas"),
    H2("Local Business Empowerment"),
    P("Pamoja+ helps Tanzanian businesses grow by giving them space to be seen, heard, and supported. The platform creates opportunities for entrepreneurs, SMEs, and emerging brands to compete in a digital environment where storytelling and community support matter."),
    H2("Smarter Deals and Savings"),
    P("The platform helps consumers access better deals, limited-time offers, and curated promotions, making everyday shopping more affordable and more rewarding."),
    H2("Health, Wellness, and Lifestyle"),
    P("Pamoja+ features wellness-focused brands and lifestyle content. Wellness listings follow TMDA guidance: educational and general wellness content only, with no medical or therapeutic claims unless the seller is fully TMDA-compliant."),
    H2("Conscious Consumption"),
    P("Pamoja+ promotes shopping with purpose by highlighting local brands, meaningful products, and community recommendations, encouraging consumers to think beyond price and consider impact, quality, and value."),
    H2("Storytelling and Authentic Engagement"),
    P("The platform uses content, brand stories, community ambassadors, and social campaigns to humanize businesses and create stronger emotional connections between sellers and buyers."),

    H1("8. Target Audience"),
    H2("Business Audience"),
    Bullet("Local entrepreneurs."),
    Bullet("Small and medium-sized businesses."),
    Bullet("Retailers."),
    Bullet("Wellness brands (TMDA-compliant)."),
    Bullet("Lifestyle brands."),
    Bullet("Food and beverage businesses (TBS-compliant where applicable)."),
    Bullet("Homegrown product creators."),
    Bullet("Service providers."),
    H2("Consumer Audience"),
    Bullet("Everyday shoppers looking for better deals."),
    Bullet("Consumers interested in local products."),
    Bullet("Wellness-conscious individuals."),
    Bullet("Lifestyle-focused buyers."),
    Bullet("Young digital users."),
    Bullet("Families seeking affordable essentials."),
    Bullet("Community-minded shoppers."),
    Bullet("Tanzanian diaspora customers seeking to support local brands and send orders home (UK, US, UAE, South Africa, Gulf)."),

    H1("9. Brand Positioning"),
    P([T("Tanzania's community-powered marketplace for local discovery, smarter deals, and collective growth.", { bold: true })]),
    P("The brand sits at the intersection of digital commerce, local business empowerment, community engagement, lifestyle discovery, wellness and conscious consumption, savings, and exclusive offers."),

    H1("10. Brand Personality"),
    Bullet("Community-driven — built around people and shared value."),
    Bullet("Supportive — focused on helping businesses and consumers grow together."),
    Bullet("Trustworthy — promoting authentic brands, real recommendations, and meaningful engagement."),
    Bullet("Vibrant — energetic, inclusive, and connected to everyday life."),
    Bullet("Innovative — using digital tools to modernize local commerce."),
    Bullet("Conscious — encouraging positive habits, wellness, and responsible consumption."),
    Bullet("Collaborative — creating space for partnerships, referrals, and shared success."),

    H1("11. Key Brand Message"),
    P([T("Pamoja+ is where Tanzania shops, saves, discovers, and grows together.", { bold: true })]),

    H1("12. Tagline"),
    P([T("Primary tagline: ", { bold: true }), T("Grow Together. Shop Smarter.")]),
    P("Alternatives held in reserve:"),
    Bullet("Tanzania's Community-Powered Marketplace."),
    Bullet("Discover More. Save More. Grow Together."),
    Bullet("Where Brands and Communities Thrive Together."),
    Bullet("Connecting People, Brands, and Opportunities."),

    H1("13. Closing Summary"),
    P("Pamoja+ is a community-powered digital marketplace designed to connect people, brands, and opportunities across Tanzania. By combining commerce, storytelling, local discovery, wellness, and community participation, the platform creates a new way for businesses and shoppers to grow together."),
    P([T("Pamoja+ — Grow Together. Shop Smarter.", { bold: true, color: GREEN_DARK })])
  ];
}

// ============================================================
// DOC 2 — LEGAL CONSIDERATIONS v2
// ============================================================
function buildLegal() {
  return [
    ...cover("Legal Considerations",
      "Tanzania-specific compliance guide for a community-powered digital marketplace",
      "This guide summarizes the practical legal areas Pamoja+ should consider before and during operation in Tanzania. It must be reviewed by a qualified Tanzanian lawyer and tax advisor before implementation."),

    H1("1. Executive Legal Position"),
    P("Pamoja+ should begin as a verified listing, promotional, and referral marketplace rather than a full payment-holding marketplace. This keeps early legal, tax, payment, refund, and consumer liability lower while the platform builds seller quality, buyer trust, and operational discipline."),
    P("The platform can later move toward full checkout and commission-based transactions once it has stronger seller verification, payment gateway agreements, dispute procedures, refund rules, tax treatment, and customer support capacity."),
    P([T("Recommended starting legal model: ", { bold: true }), T("Sellers sell directly. Customers contact verified sellers through Pamoja+. Pamoja+ earns from visibility, seller subscriptions, paid promotions, brand campaigns, and clearly documented service fees.")]),

    H1("2. Business Registration and Legal Structure"),
    P("Pamoja+ should operate through a properly registered Tanzanian legal entity. A private limited company is the most suitable structure because the platform deals with sellers, shoppers, payments, data, employees, ambassadors, partners, and future investors."),
    H2("Required actions"),
    Numbered("Register the company through BRELA."),
    Numbered("Obtain a Certificate of Incorporation."),
    Numbered("Register for a Taxpayer Identification Number (TIN) with TRA."),
    Numbered("Open a business bank account and official mobile money / payment channels."),
    Numbered("Obtain the relevant business licence before commercial operations."),
    Numbered("File trademark protection for the Pamoja+ name, logo, and tagline through BRELA. Consider ARIPO regional filing in Phase 2 for cross-border expansion."),

    H1("3. Business Licence"),
    P("Confirm the correct licence category for the operating model. The licence may depend on whether the company is treated as an online marketplace, advertising and promotional service, digital platform, e-commerce support business, or business listing service."),
    Bullet("Confirm issuing authority (BRELA or the relevant Local Government Authority)."),
    Bullet("Confirm local municipal requirements for the operating city."),
    Bullet("Keep the business licence renewed and available for partner due diligence."),
    Bullet("Update the licence position when adding delivery, payment holding, or regulated product categories."),

    H1("4. Tax and TRA Compliance"),
    P("Pamoja+ must maintain clean financial records from day one. Every revenue stream is tracked separately so tax treatment, invoices, and management reporting remain clear."),
    H2("Revenue streams to track"),
    table(
      ["Revenue Source", "Description", "Control Needed"],
      [
        ["Seller subscriptions", "Monthly or annual listing plans", "Invoice and renewal tracking"],
        ["Featured listings", "Homepage / category visibility", "Promotion agreement and receipt"],
        ["Social media promotions", "Paid posts and campaign support", "Content approval and proof of delivery"],
        ["Brand story packages", "Storytelling and campaign package", "Scope of work and acceptance record"],
        ["Commission", "Percentage on orders processed through Pamoja+", "Order and settlement records"],
        ["Delivery margin", "If delivery is later coordinated by Pamoja+", "Delivery partner records and receipts"],
        ["Membership fees", "Optional future shopper club", "Customer terms and billing records"]
      ]
    ),
    H2("Tax areas to assess"),
    Bullet("Corporate income tax — 30% for resident companies."),
    Bullet("VAT — 18%. Mandatory registration once annual taxable turnover exceeds TZS 200,000,000."),
    Bullet("Upon VAT registration, Pamoja+ must obtain and operate an EFD (Electronic Fiscal Device) or VFD (Virtual Fiscal Device) for compliant invoicing."),
    Bullet("Withholding tax — 5% on service fees to residents where applicable, including ambassador rewards above threshold."),
    Bullet("PAYE — progressive 0–30% for employees."),
    Bullet("NSSF — 20% combined (10% employer + 10% employee). As a private sector employer, Pamoja+ registers with NSSF, not PSSSF."),
    Bullet("WCF — approximately 0.5% of gross emoluments, payable by the employer."),
    Bullet("SDL — 3.5% of gross emoluments, payable once Pamoja+ has 10 or more employees."),
    Bullet("Local Service Levy — up to 0.3% of turnover, council-dependent. Confirm exact rate with the relevant Local Government Authority."),

    H1("5. Marketplace Role and Liability"),
    P("Legal exposure depends on how involved the platform is in each sale. The early model reduces operational and legal risk while still creating commercial value."),
    table(
      ["Model", "How It Works", "Risk", "Recommendation"],
      [
        ["Listing and referral", "Pamoja+ lists sellers; customers contact sellers directly.", "Lower", "Best for launch"],
        ["Managed checkout", "Customer orders and pays through Pamoja+.", "Medium–High", "Introduce after controls are ready"],
        ["Full marketplace with delivery", "Pamoja+ manages payment, order flow, delivery, and complaints.", "High", "Use only after operational maturity"]
      ]
    ),

    H1("6. Consumer Protection"),
    P("Pamoja+ must avoid misleading consumers. The Fair Competition Commission (FCC) is the consumer protection regulator; the Fair Competition Tribunal (FCT) handles appeals."),
    H2("High-risk consumer issues"),
    Bullet("Fake discounts or inflated \"before\" prices."),
    Bullet("Promoting unavailable products or expired deals."),
    Bullet("Misleading product descriptions."),
    Bullet("Hidden delivery charges or unclear conditions."),
    Bullet("Fake reviews or unverified testimonials."),
    Bullet("Misleading health, beauty, or wellness claims (TMDA-regulated)."),
    Bullet("Sellers failing to respond after promotion."),

    H1("7. Terms and Conditions"),
    table(
      ["Document", "Applies To", "Purpose"],
      [
        ["User Terms", "Shoppers and visitors", "Platform use, limitations, complaints, user responsibilities."],
        ["Seller Terms", "Listed businesses", "Listing accuracy, payment obligations, prohibited products, seller conduct."],
        ["Paid Promotion Terms", "Brands buying visibility", "Deliverables, dates, fees, approvals, refund limits."],
        ["Ambassador Agreement", "Referral / community promoters", "Non-employee status, rewards, conduct, referral tracking, WHT clause."],
        ["Delivery Partner Terms", "Future logistics partners", "Delivery responsibility, proof of delivery, failed delivery, payment."]
      ]
    ),

    H1("8. Privacy and Data Protection (PDPC)"),
    P("Tanzania's Personal Data Protection Act 2022 and Regulations 2023 require data controllers and processors to register with the Personal Data Protection Commission (PDPC). For a marketplace handling buyer, seller, employee, and ambassador data, this registration is required, not optional."),
    H2("Documents and controls required"),
    Bullet("Privacy Policy (live before public launch)."),
    Bullet("Cookie Policy if using cookies, analytics, or retargeting."),
    Bullet("Data Protection Policy."),
    Bullet("Consent wording for sellers, shoppers, and ambassadors."),
    Bullet("Data retention and deletion policy."),
    Bullet("Staff confidentiality agreements."),
    Bullet("Data breach response procedure."),
    Bullet("PDPC data-controller registration before public launch."),

    H1("9. Payments and Mobile Money"),
    P("Pamoja+ uses licensed mobile money providers, banks, or payment aggregators. The platform does not act as a bank, wallet provider, or money custodian during Phase 1."),
    H2("Mobile money providers"),
    Bullet("M-Pesa (Vodacom Tanzania)."),
    Bullet("Mixx by Yas (Yas Tanzania, formerly Tigo Pesa, rebranded 2024)."),
    Bullet("Airtel Money (Airtel Tanzania)."),
    Bullet("Halopesa (Halotel)."),
    Bullet("AzamPesa (Azam Group)."),
    Bullet("T-Pesa (TTCL)."),
    H2("Payment aggregators to shortlist"),
    Bullet("Selcom — broadest MMO coverage, single API."),
    Bullet("Clickpesa — TZ-native, developer-friendly."),
    Bullet("Pesapal — pan-East-Africa, strong card support."),
    Bullet("Flutterwave — diaspora and international cards."),
    Bullet("DPO Pay — long-established, card-focused."),

    H1("10. Refund, Cancellation, and Dispute Policy"),
    table(
      ["Issue", "Phase 1 Handling", "Escalation"],
      [
        ["Wrong price or expired deal", "Pamoja+ corrects/removes listing; contacts seller.", "Repeated errors may lead to suspension."],
        ["Seller not responding", "Pamoja+ follows up with seller.", "Seller response status downgraded."],
        ["Customer paid seller directly", "Seller handles refund directly.", "Pamoja+ may mediate and record complaint."],
        ["Payment through Pamoja+", "Pamoja+ follows written refund and settlement rules.", "Requires order and payment proof."],
        ["Product quality complaint", "Seller is primarily responsible.", "Pamoja+ reviews seller reliability."]
      ]
    ),

    H1("11. Seller Verification"),
    H2("Minimum verification"),
    Bullet("Business name and owner/contact person."),
    Bullet("Phone number and WhatsApp number."),
    Bullet("Physical location or service area."),
    Bullet("Business category and product / service description."),
    Bullet("Social media link or website if available."),
    Bullet("Business licence or registration where applicable."),
    Bullet("ID/contact proof for informal sellers where needed."),
    Bullet("Agreement to Pamoja+ seller terms and prohibited products policy."),
    H2("Higher-risk categories — extra checks"),
    Bullet("Food and beverages (TBS-aware)."),
    Bullet("Cosmetics and beauty products (TMDA-regulated)."),
    Bullet("Health and wellness products (TMDA-regulated)."),
    Bullet("Supplements and therapeutic products (TMDA-regulated)."),
    Bullet("Children's products."),
    Bullet("Imported goods (TBS clearance where required)."),
    Bullet("Electronics and high-value products."),

    H1("12. Product-Specific Compliance"),
    table(
      ["Category", "Regulator / Concern", "Position"],
      [
        ["Food and beverages", "TBS — packaging, hygiene, expiry, labelling", "Clear seller identity and product details required"],
        ["Cosmetics", "TMDA — safety, labelling, registration", "Avoid suspicious or unlabelled products"],
        ["Health and wellness", "TMDA — therapeutic claims", "Educational and general wellness only"],
        ["Medicines", "TMDA — prescription products", "Do not advertise without full compliance"],
        ["Supplements", "TMDA — claims, safety, registration", "Stronger verification before listing"],
        ["Alcohol / restricted goods", "Licensing, age restrictions", "Do not launch early without legal review"]
      ]
    ),
    P([T("Launch position: ", { bold: true }), T("Avoid pharmaceutical, medical, aggressive weight-loss, and cure-based wellness claims in Phase 1. Wellness content stays educational and general.")]),

    H1("13. Advertising and Promotional Claims"),
    Bullet("Discounts must be real and verifiable."),
    Bullet("Before/after prices must not be invented."),
    Bullet("Limited-time offers must have actual expiry dates."),
    Bullet("Testimonials must be genuine and consent-based."),
    Bullet("Sponsored or paid features must be internally recorded."),
    Bullet("Health and beauty claims must be cautious and non-medical unless TMDA-approved."),
    Bullet("Influencer or ambassador content must not mislead customers."),
    P([T("Note: ", { bold: true }), T("Counsel to confirm whether Pamoja+ requires a TCRA Content Service Licence as paid promotion and influencer volume grows.")]),

    H1("14. Intellectual Property"),
    Bullet("Apply for trade/service mark protection through BRELA for the Pamoja+ name, logo, and tagline."),
    Bullet("Phase 2: consider ARIPO regional trade mark filing for cross-border expansion."),
    Bullet("Use written agreements with designers, photographers, developers, and content creators that transfer ownership of paid work to Pamoja+."),
    Bullet("Require sellers to confirm they own or have permission to use uploaded images."),
    Bullet("Reject counterfeit, copied, or unauthorized branded products."),

    H1("15. Employment, Contractors, Ambassadors"),
    table(
      ["Worker Type", "Document", "Key Legal Point"],
      [
        ["Employee", "Employment contract", "PAYE, NSSF, WCF, SDL (10+ employees), leave, labour obligations."],
        ["Freelancer / contractor", "Independent contractor agreement", "Scope, fees, deadlines, confidentiality, IP ownership."],
        ["Ambassador", "Ambassador / referral agreement", "Non-employee status, rewards, conduct, referral tracking, WHT clause where applicable."],
        ["Intern / volunteer", "Internship / volunteer letter", "Clear labour expectations and payment terms."]
      ]
    ),

    H1("16. Website and App Legal Pages"),
    Bullet("Terms and Conditions."),
    Bullet("Privacy Policy."),
    Bullet("Seller Terms."),
    Bullet("Refund and Dispute Policy."),
    Bullet("Community Guidelines."),
    Bullet("Cookie Policy."),
    Bullet("Advertising Policy."),
    Bullet("Prohibited Products Policy."),
    Bullet("Contact and Complaint Page."),

    H1("17. Prohibited Products"),
    Bullet("Illegal goods or services."),
    Bullet("Counterfeit, stolen, or unauthorized branded goods."),
    Bullet("Prescription medicines without TMDA authority."),
    Bullet("Dangerous health products or cure-based claims."),
    Bullet("Weapons, drugs, narcotics, or controlled substances."),
    Bullet("Adult content or exploitative services."),
    Bullet("Fake documents or academic fraud services."),
    Bullet("Misleading financial schemes or unlicensed investment products."),
    Bullet("Gambling services without proper licensing."),
    Bullet("Expired food, cosmetics, or health products."),
    Bullet("Unlabelled regulated products."),
    Bullet("Any product or service violating Tanzanian law."),

    H1("18. Legal Setup by Phase"),
    table(
      ["Phase", "Legal Priorities"],
      [
        ["Before Launch", "BRELA registration, TIN, business licence, bank/payment channels, user terms, privacy policy, seller agreement, prohibited products list, complaint process."],
        ["First 3 Months", "Paid promotion agreement, ambassador agreement, invoice/receipt system, PDPC registration, refund/dispute workflow, trademark application."],
        ["Before Full Checkout", "Payment gateway / aggregator agreement, seller settlement terms, refund process, tax treatment review, VAT monitoring (TZS 200M threshold), EFD/VFD setup, customer support system, transaction records."],
        ["Before Scale", "Compliance audits, supplier due diligence, delivery partner contracts, insurance review, employee handbook, investor-ready legal file, ARIPO trade mark consideration."]
      ]
    ),

    H1("19. First Legal Checklist"),
    Numbered("Register company with BRELA."),
    Numbered("Obtain TIN from TRA."),
    Numbered("Obtain relevant business licence."),
    Numbered("Open business bank account and mobile money merchant accounts."),
    Numbered("Create Terms and Conditions."),
    Numbered("Create Privacy Policy."),
    Numbered("Create Seller Agreement."),
    Numbered("Create Paid Promotion Terms."),
    Numbered("Create Refund and Complaint Policy."),
    Numbered("Create Prohibited Products Policy."),
    Numbered("Create Ambassador Agreement (with WHT clause)."),
    Numbered("Create seller verification checklist."),
    Numbered("File trademark with BRELA."),
    Numbered("Track monthly turnover against the TZS 200M VAT threshold."),
    Numbered("Register with PDPC as data controller."),

    H1("20. Key Regulators (Tanzania)"),
    Bullet("BRELA — company and trademark registration."),
    Bullet("TRA — tax registration, income tax, VAT, invoicing, PAYE, WHT, EFD/VFD."),
    Bullet("PDPC — personal data protection registration and standards."),
    Bullet("TCRA — communications and content service licensing."),
    Bullet("TMDA — medicines, cosmetics, supplements, medical devices."),
    Bullet("TBS — product standards (food, electronics, imports)."),
    Bullet("FCC — fair competition and consumer protection."),
    Bullet("FCT — Fair Competition Tribunal (appeals)."),
    Bullet("NSSF — social security (private sector)."),
    Bullet("WCF — workers compensation."),
    Bullet("BoT — banking and mobile money supervision (indirect)."),
    Bullet("Local Government Authorities — local licensing and service levy."),

    H1("21. Closing Recommendation"),
    P("For Tanzania, the safest and most practical starting position is for Pamoja+ to operate as a verified listing and promotional marketplace first. Connect customers to sellers, support seller visibility, publish verified deals, and earn from promotional services rather than immediately holding customer funds or controlling full transactions."),
    P([T("Best launch position: ", { bold: true }), T("Start with low-risk marketplace visibility. Build trust through verification and content quality. Move into checkout, delivery, and commission-based transactions only after legal, payment, tax, and operational systems are ready.")]),
    P([T("Pamoja+ — Grow Together. Shop Smarter.", { bold: true, color: GREEN_DARK })])
  ];
}

// ============================================================
// DOC 3 — 3-MONTH TIMELINE v2
// ============================================================
function buildTimeline() {
  return [
    ...cover("3-Month Launch Timeline",
      "A realistic, low-burden execution plan",
      "Focused goals. Clean execution. Measured growth. Dar es Salaam only for Q1."),

    H1("1. Overall 3-Month Goal"),
    P("The first three months focus on building a clean operating rhythm in Dar es Salaam rather than launching everything at once. Pamoja+ proves that businesses will join, shoppers will engage, and selected sellers will pay for visibility."),
    P([T("Q1 scope: ", { bold: true }), T("Dar es Salaam only (Kinondoni, Ilala, Ubungo). No outreach to Mwanza, Arusha, or Dodoma until the Month 4 review.")]),
    table(
      ["Area", "3-Month Target"],
      [
        ["Businesses onboarded", "40–60"],
        ["Active sellers", "25–35"],
        ["Product / deal listings", "150+"],
        ["Paid sellers or paid promotions", "5–15"],
        ["Active ambassadors", "10"],
        ["Posting rhythm", "4–6 quality posts per week"],
        ["First revenue target (cumulative across 3 months)", "TZS 300,000 – 1,500,000"]
      ]
    ),

    H1("2. Content language"),
    P("Captions and shopper-facing content are Swahili-first. English is used as a secondary language for diaspora customers and corporate partners."),

    H1("3. Month 1 — Foundation and Soft Setup"),
    P("Prepare the structure, seller process, marketplace categories, communication flow, and first group of sellers. The objective is controlled learning, not mass expansion."),
    table(
      ["Week", "Focus", "Key Actions", "Target Output"],
      [
        ["Week 1", "Internal setup", "Finalize profile, pricing, team roles, seller form, listing template, support line, launch categories.", "Core documents and workflows ready."],
        ["Week 2", "Seller preparation", "List 50 potential businesses, prepare pitch messages, contact first 10.", "Lead list and onboarding tracker ready."],
        ["Week 3", "First onboarding", "Onboard 10–15 sellers, collect photos/details, publish first listings, test inquiry flow.", "10–15 sellers, 30–50 listings live."],
        ["Week 4", "Soft launch", "Announce Pamoja+, post deal highlights, share business spotlights, collect feedback.", "15–20 sellers, 50+ listings live."]
      ]
    ),
    H2("Starting categories"),
    Bullet("Food and beverages."),
    Bullet("Wellness and health lifestyle (educational content only)."),
    Bullet("Beauty and personal care."),
    Bullet("Fashion and accessories."),
    Bullet("Home essentials."),
    Bullet("Services and local deals."),

    H1("4. Month 2 — Market Testing and Community Growth"),
    P("Grow carefully while testing what customers and sellers actually respond to. Learn which categories, posts, deals, and businesses are most promising."),
    table(
      ["Week", "Focus", "Key Actions", "Target Output"],
      [
        ["Week 5", "Improve listings", "Review profiles, improve weak descriptions, organize categories, prepare content calendar.", "Cleaner marketplace presentation."],
        ["Week 6", "Grow sellers", "Contact 20–30 more businesses, onboard 10–15, focus on best-performing categories.", "25–35 total sellers."],
        ["Week 7", "Ambassador pilot", "Recruit 5–10 ambassadors per the Ambassador Verification SOP. Set referral targets, track and reward.", "Ambassador system tested."],
        ["Week 8", "Performance review", "Review top sellers, top categories, best posts, complaints, paid promotion interest.", "Clear focus for Month 3."]
      ]
    ),
    H2("Paid promotion test (aligned with Payment Structure v2)"),
    Bullet("Daily Deal Boost: TZS 5,000 per day."),
    Bullet("Weekly Deal Boost: TZS 25,000 per week."),
    Bullet("Featured Brand Slot: TZS 50,000 per week."),
    Bullet("Only pitch paid visibility to sellers who are already active and responsive."),

    H1("5. Month 3 — Stabilization and Light Monetization"),
    P("Turn the early test into a repeatable operating model. Focus on seller retention, trust, paid visibility, basic partnerships, and a clear next-quarter plan."),
    table(
      ["Week", "Focus", "Key Actions", "Target Output"],
      [
        ["Week 9", "Paid packages", "Introduce Free Plan, TZS 15,000 Growth, TZS 35,000 Plus, and TZS 75,000 Partner to active sellers.", "First upgrades and proper revenue tracking."],
        ["Week 10", "Customer trust", "Verified seller badges, responsive seller labels, testimonials, expired-deal cleanup, complaint flow.", "Stronger trust system."],
        ["Week 11", "Partnership push", "Pitch 5 high-potential brands, target 1–2 Brand Spotlight campaigns (TZS 100,000–200,000).", "1–2 campaigns secured or in discussion."],
        ["Week 12", "Review and plan", "Review revenue, sellers, weak categories, workload, feedback. Prepare Month 4–6 plan.", "Next-quarter plan based on real data."]
      ]
    ),

    H1("6. Weekly Operating Rhythm"),
    table(
      ["Day", "Focus", "Main Actions"],
      [
        ["Monday", "Planning", "Review last week, set goals, confirm onboardings and deals, assign tasks."],
        ["Tue–Thu", "Execution", "Contact sellers, upload listings, create content, promote deals, respond to inquiries."],
        ["Friday", "Review", "Update database, remove expired deals, check payments, review results, prepare next week."],
        ["Weekend", "Light activity", "One deal or community update; urgent messages only."]
      ]
    ),

    H1("7. Minimum Team"),
    Bullet("Lead / Founder — direction, approvals, partnerships."),
    Bullet("Operations Person — listings, deals, workflow."),
    Bullet("Business Development — outreach and onboarding."),
    Bullet("Marketing / Content — social media, deals, brand stories."),
    Bullet("Tech Support — platform updates and analytics."),
    Bullet("Finance / Admin — payment records and reporting."),
    Bullet("Ambassadors — referrals and community sharing."),

    H1("8. What Not to Do in the First 3 Months"),
    Bullet("Do not build a complicated app before testing demand."),
    Bullet("Do not hire a large team too early."),
    Bullet("Do not create too many categories at once."),
    Bullet("Do not manage delivery in-house at the beginning."),
    Bullet("Do not force every seller to pay immediately."),
    Bullet("Do not launch complex rewards before the basic marketplace works."),
    Bullet("Do not run too many campaigns at once."),
    Bullet("Do not expand outside Dar es Salaam in Q1."),
    Bullet("Do not host TMDA-regulated wellness claims."),

    H1("9. End-of-Quarter Review"),
    Bullet("Which businesses received the most inquiries?"),
    Bullet("Which categories performed best?"),
    Bullet("Which sellers are willing to pay?"),
    Bullet("Which promotions generated real engagement?"),
    Bullet("What confused customers?"),
    Bullet("What took too much team time?"),
    Bullet("What should be stopped, repeated, or improved?"),

    P([T("Final note: ", { bold: true }), T("The goal is not perfection. The goal is a clean, trusted, repeatable marketplace process that can grow month by month.")])
  ];
}

// ============================================================
// DOC 4 — TEAM STRUCTURE v2
// ============================================================
function buildTeam() {
  return [
    ...cover("Team Structure and Management",
      "A lean operating framework for a community-powered marketplace",
      "Lean team. Clear roles. Community-led growth. 6–8 core members plus part-time ambassadors at launch."),

    H1("1. Management Philosophy"),
    P("Pamoja+ begins as a lean, organized, and community-driven team. The structure avoids unnecessary hierarchy while creating clear ownership, measurable targets, and daily accountability."),

    H1("2. Organizational Structure"),
    table(
      ["Department", "Primary Purpose", "Main Owner"],
      [
        ["Leadership and Strategy", "Direction, business model, partnerships, growth", "Managing Director"],
        ["Business Development", "Seller acquisition, partnerships, revenue", "Business Development Manager"],
        ["Marketplace Operations", "Listings, deals, customer flow, daily quality", "Operations Manager"],
        ["Marketing and Community", "Brand, content, campaigns, ambassadors", "Marketing & Community Manager"],
        ["Technology and Product", "Platform, UX, data, features", "Product / Technology Lead"],
        ["Finance and Admin", "Payments, records, contracts, compliance", "Finance and Admin Officer"]
      ]
    ),

    H1("3. Leadership and Strategy"),
    H2("Managing Director"),
    Bullet("Define company vision and long-term strategy."),
    Bullet("Approve major partnerships, pricing decisions, hiring, and large expenses."),
    Bullet("Oversee revenue growth, investor/partner relationships, and brand positioning."),
    Bullet("Supervise department leads against weekly and monthly targets."),

    H1("4. Founder Equity and Option Pool"),
    P("Founder equity, vesting, and an employee option pool are to be drafted before any external fundraising conversation. Counsel will guide the structure."),

    H1("5. Business Development"),
    H2("Business Development Manager"),
    Bullet("Recruit local businesses, SMEs, retailers, wellness brands (TMDA-aware), restaurants, salons, boutiques, services."),
    Bullet("Pitch business packages, paid visibility, partner campaigns."),
    Bullet("Manage premium sellers, sponsors, and strategic partners."),
    Bullet("Track seller acquisition, paid conversions, partner revenue, retention."),
    H2("Seller Onboarding Officer"),
    Bullet("Collect seller details, verify information, create profiles."),
    Bullet("Upload product photos, descriptions, pricing, contact details, delivery areas."),
    Bullet("Train sellers on platform usage, response expectations, deal setup."),
    H2("Partnership and Field Representative"),
    Bullet("Visit businesses physically, build trust with owners who prefer face-to-face."),
    Bullet("Field transport allowance: estimated TZS 100,000–250,000 per rep per month."),

    H1("6. Marketplace Operations"),
    H2("Operations Manager"),
    Bullet("Oversee seller onboarding, listings, deals, inquiries, and workflows."),
    Bullet("Monitor listing quality, seller responsiveness, complaints, internal tasks."),
    Bullet("Coordinate between sellers, customers, marketing, technology, and finance."),
    Bullet("Maintain SOPs and weekly performance reports."),
    H2("Marketplace Coordinator"),
    Bullet("Review listings, categories, prices, photos, deal expiry."),
    Bullet("Remove outdated offers."),
    H2("Customer Support Officer"),
    Bullet("Respond to WhatsApp, phone, email, and social media inquiries."),
    Bullet("Handle complaints, escalate serious issues, keep feedback records."),

    H1("7. Marketing, Content, and Community"),
    H2("Marketing and Community Manager"),
    Bullet("Develop campaigns and grow audience engagement."),
    Bullet("Promote businesses, deals, wellness brands, and community stories."),
    Bullet("Lead ambassador activity and offline activations."),
    H2("Content Creator / Social Media"),
    Bullet("Create captions, graphics, reels, deal announcements, brand story posts."),
    Bullet("Maintain content calendar; monitor comments and social performance."),
    Bullet("Captions are Swahili-first; English secondary."),
    H2("Community Ambassador Coordinator"),
    Bullet("Recruit, train, assign, and reward ambassadors per the Ambassador Verification SOP."),

    H1("8. Technology and Product"),
    H2("Product and Technology Lead"),
    Bullet("Manage website/app development, feature priorities, analytics, bug resolution."),
    Bullet("Improve UX for sellers, shoppers, administrators, and ambassadors."),
    Bullet("Support payment integration, seller dashboards, search, data protection, reporting."),
    H2("UI/UX Designer"),
    Bullet("Design marketplace pages, seller profiles, deal cards, onboarding flows, banners."),
    H2("Developer / Technical Support"),
    Bullet("Build features, fix bugs, maintain databases, improve security, manage hosting and backups."),

    H1("9. Finance, Admin, Compliance"),
    H2("Finance and Admin Officer"),
    Bullet("Track subscriptions, boosts, commissions, invoices, receipts, expenses, seller payment status."),
    Bullet("Prepare monthly financial reports."),
    Bullet("Support payroll, contracts, and admin documentation as the team grows."),
    Bullet("Track turnover against the TZS 200,000,000 VAT threshold."),
    H2("Legal and Compliance (outsourced)"),
    P("Typical Tanzanian early-stage legal retainer: TZS 500,000 – 1,500,000 per month."),
    Bullet("Seller terms, privacy policy, refund/dispute rules, partnership agreements, consumer protection guidance."),
    Bullet("PDPC registration and updates."),
    Bullet("Trademark filing and renewal."),

    H1("10. Lean Launch Team"),
    P("At launch, Pamoja+ runs with a compact group of 6–8 core people plus part-time ambassadors."),
    table(
      ["Role", "Number", "Priority"],
      [
        ["Managing Director", "1", "Essential"],
        ["Operations Manager", "1", "Essential"],
        ["Business Development / Seller Acquisition", "1–2", "Essential"],
        ["Marketing and Community Manager", "1", "Essential"],
        ["Content Creator / Social Media", "1", "Essential"],
        ["Product / Technology Lead or Developer", "1", "Essential"],
        ["Finance / Admin Officer", "Part-time or 1", "Important"],
        ["Customer Support Officer", "1", "Important"],
        ["Community Ambassadors", "5–20", "Part-time / commission-based"]
      ]
    ),

    H1("11. Growth Team — added later"),
    Bullet("BD: Partnership Manager, Seller Success Officer."),
    Bullet("Operations: Marketplace Quality Officer, Delivery Coordinator."),
    Bullet("Marketing: Campaign Manager, Videographer, Influencer Coordinator."),
    Bullet("Technology: Full-stack Developer, Data Analyst."),
    Bullet("Finance/Admin: Accountant, HR/Admin Assistant."),
    Bullet("Support: Customer Support Team Lead, Support Agents."),

    H1("12. Cadence"),
    Bullet("Daily 15-minute team check-in: yesterday, today, blockers, approvals needed."),
    Bullet("Weekly 45–60-minute department review: onboardings, deals, marketing, complaints, tech, revenue, next-week priorities."),
    Bullet("Monthly management review: revenue, growth, partnerships, team, budget, strategic focus."),

    H1("13. KPIs by Department"),
    table(
      ["Department", "Core KPIs"],
      [
        ["Leadership", "Monthly revenue, marketplace growth, seller retention, partnerships"],
        ["Business Development", "New sellers, paid conversions, partner revenue, retention"],
        ["Operations", "Active listings, live deals, complaint resolution, seller response rate"],
        ["Marketing", "Reach, engagement, leads, referrals, campaign participation"],
        ["Technology", "Uptime, bug resolution, feature delivery, payment success rate"],
        ["Finance/Admin", "Revenue collected, outstanding payments, invoice accuracy, expense tracking"]
      ]
    ),

    H1("14. Ambassador Management"),
    table(
      ["Activity", "Suggested Reward"],
      [
        ["Refer seller who joins free plan", "TZS 2,000"],
        ["Refer seller who pays subscription", "TZS 5,000 – 10,000"],
        ["Refer premium partner", "TZS 20,000+"],
        ["Refer active shoppers", "Points or monthly reward"],
        ["Top monthly ambassador", "Bonus plus public recognition"]
      ]
    ),
    P([T("Tax note: ", { bold: true }), T("Where applicable, Pamoja+ withholds tax in accordance with TRA rules. See the Ambassador Agreement.")]),

    H1("15. Launch Targets (Q1, aligned with Timeline v2)"),
    Bullet("Business Development: target 15–20 sellers in Month 1 (Dar only). Higher weekly cadence (15–30 per week) applies from Month 4 onwards."),
    Bullet("Marketing: post daily, publish 3–5 deal highlights weekly, 1 community challenge monthly."),
    Bullet("Operations: keep deals updated, remove expired offers weekly, seller profiles 80% complete or higher."),
    Bullet("Ambassadors: 10 recruited in Month 2; each refers 5+ businesses or 20+ shoppers monthly."),
    Bullet("Finance/Admin: track all subscriptions, boosts, campaign payments, and unpaid balances weekly."),

    H1("16. Internal Tools"),
    table(
      ["Purpose", "Suggested Tool"],
      [
        ["Team chat", "WhatsApp or Slack"],
        ["Task management", "Trello, Notion, or ClickUp"],
        ["Seller database", "Google Sheets, Airtable, or CRM"],
        ["Content calendar", "Notion or Google Calendar"],
        ["File storage", "Google Drive"],
        ["Financial tracking", "Excel, Google Sheets, or accounting software"],
        ["Meetings", "Google Meet or Zoom"],
        ["Customer support", "WhatsApp Business or shared inbox"]
      ]
    ),

    H1("17. Essential SOPs"),
    Bullet("Seller onboarding."),
    Bullet("Product listing."),
    Bullet("Deal approval."),
    Bullet("Featured brand."),
    Bullet("Customer complaint."),
    Bullet("Payment confirmation."),
    Bullet("Subscription renewal."),
    Bullet("Ambassador referral."),
    Bullet("Ambassador verification."),
    Bullet("Social media posting."),
    Bullet("Seller verification (TMDA/TBS where applicable)."),
    Bullet("Refund and dispute."),
    Bullet("Monthly reporting."),

    H1("18. Closing"),
    P("Pamoja+ does not start with a heavy corporate structure. It begins as a lean, energetic, and community-driven team with clear ownership, simple reporting, measurable weekly targets, and strong operational discipline."),
    P([T("Pamoja+ — Grow Together. Shop Smarter.", { bold: true, color: GREEN_DARK })])
  ];
}

// ============================================================
// DOC 5 — PAYMENT STRUCTURE v2
// ============================================================
function buildPayment() {
  return [
    ...cover("Payment Structure",
      "Starter payment model for the Tanzanian market",
      "Free entry. Affordable growth. Commission only on completed value."),

    H1("1. Strategic Overview"),
    P("Pamoja+ begins with a payment model that is easy for Tanzanian businesses to accept, simple for shoppers to understand, and flexible enough to grow as the platform gains traction."),
    P("The launch structure follows four principles: free entry, affordable business subscriptions, optional paid visibility, and a small commission only when Pamoja+ directly supports completed transactions."),

    H1("2. Tanzanian Market Understanding"),
    P("The Tanzanian market is mobile-first, relationship-driven, and price-sensitive. Small businesses want visibility but hesitate to pay large upfront fees before seeing results."),
    P("Mobile money is the core payment channel. Cash-on-delivery, pay-on-pickup, and WhatsApp inquiry flows remain available during the early stage to reduce friction and build trust."),
    H2("Key assumptions"),
    Bullet("Most micro and small businesses prefer low monthly commitments."),
    Bullet("Many customers discover online but prefer final confirmation via WhatsApp, phone, pickup, or delivery payment."),
    Bullet("Businesses pay faster for visibility, promotion, leads, and brand storytelling than for abstract platform access."),
    Bullet("Tanzanian diaspora (UK, US, UAE, South Africa, Gulf) is a real revenue source from Month 3 onwards."),
    Bullet("Shoppers are not charged at launch; user growth and discovery matter more than immediate consumer revenue."),

    H1("3. Payment Methods"),
    table(
      ["Method", "Launch Priority", "Purpose"],
      [
        ["Mobile Money", "High", "Main channel for subscriptions, boosts, orders, payouts."],
        ["Bank Transfer", "Medium", "Larger businesses, annual plans, corporate partners."],
        ["Cash on Delivery / Pay on Pickup", "High", "Trust-building and early adoption."],
        ["Card Payments", "Month 3+ for diaspora", "Premium users, corporates, diaspora, higher-value purchases."]
      ]
    ),
    H2("Mobile money providers (current names, 2026)"),
    Bullet("M-Pesa (Vodacom Tanzania)."),
    Bullet("Mixx by Yas (Yas Tanzania, formerly Tigo Pesa, rebranded 2024)."),
    Bullet("Airtel Money (Airtel Tanzania)."),
    Bullet("Halopesa (Halotel)."),
    Bullet("AzamPesa (Azam Group)."),
    Bullet("T-Pesa (TTCL)."),
    H2("Payment aggregators to shortlist by Month 2"),
    Bullet("Selcom — broadest MMO coverage, single API."),
    Bullet("Clickpesa — TZ-native, developer-friendly."),
    Bullet("Pesapal — pan-East-Africa, strong card support."),
    Bullet("Flutterwave — diaspora and international cards."),
    Bullet("DPO Pay — long-established, card-focused."),

    H1("4. Business Pricing"),
    table(
      ["Package", "Monthly Price", "Best For", "Core Benefit"],
      [
        ["Start Pamoja", "Free", "New and small sellers", "Basic marketplace visibility"],
        ["Pamoja Growth", "TZS 15,000", "Small active businesses", "More listings and basic promotion"],
        ["Pamoja Plus", "TZS 35,000", "Serious sellers", "Better visibility, analytics, deal support"],
        ["Pamoja Partner", "TZS 75,000", "Growing brands", "Premium exposure, campaigns, brand support"]
      ]
    ),

    H2("A. Start Pamoja — Free"),
    Bullet("Basic business profile."),
    Bullet("Up to 10 product listings."),
    Bullet("Business contact, WhatsApp button, location or delivery area."),
    Bullet("Basic visibility in marketplace search."),

    H2("B. Pamoja Growth — TZS 15,000 per month"),
    Bullet("Up to 50 product listings."),
    Bullet("Post offers and deals."),
    Bullet("Basic analytics (views, clicks, inquiries)."),
    Bullet("One featured category placement per month."),

    H2("C. Pamoja Plus — TZS 35,000 per month"),
    Bullet("Up to 150 product listings."),
    Bullet("Higher marketplace ranking."),
    Bullet("Two featured deal placements per month."),
    Bullet("Monthly performance report and priority support."),

    H2("D. Pamoja Partner — TZS 75,000 per month"),
    Bullet("High-limit or unlimited listings."),
    Bullet("Homepage feature rotation."),
    Bullet("Four featured deal placements per month."),
    Bullet("Verified business badge, brand story post, advanced analytics."),

    P([T("Regional note: ", { bold: true }), T("Regional pricing will be reviewed before any expansion outside Dar es Salaam.")]),

    H1("5. Commission Structure"),
    table(
      ["Sale Type", "Recommended Commission"],
      [
        ["Direct inquiry — buyer contacts seller", "0%"],
        ["Order processed through Pamoja+", "3% to 5%"],
        ["Featured campaign sale", "5% to 8%"],
        ["High-volume partner seller", "Custom rate"]
      ]
    ),
    P([T("Margin note: ", { bold: true }), T("Net commission is approximately gross commission minus 1.5–2.5% mobile money MDR. Plan pricing accordingly.")]),

    H1("6. Promotional Boost Pricing"),
    table(
      ["Promotion", "Suggested Price", "Use Case"],
      [
        ["Daily Deal Boost", "TZS 5,000 per day", "Flash deals and short offers"],
        ["Weekly Deal Boost", "TZS 25,000 per week", "Sustained deal visibility"],
        ["Featured Brand Slot", "TZS 50,000 per week", "Homepage or category visibility"],
        ["Social Media Feature", "TZS 30,000 per post", "Promotion through Pamoja+ social channels"],
        ["Brand Story Package", "TZS 100,000 – 200,000", "Storytelling, product highlight, design, campaign push"]
      ]
    ),

    H1("7. Shopper Payment Structure"),
    Bullet("Free browsing."),
    Bullet("Free deal discovery."),
    Bullet("Free contact with businesses."),
    Bullet("Free sharing, recommendations, and community participation."),
    H2("Future option — Pamoja+ Savings Club"),
    Bullet("TZS 5,000 per month or TZS 50,000 per year."),
    Bullet("Early access to selected deals."),
    Bullet("Member-only discounts."),
    Bullet("Wellness challenges and reward points."),
    Bullet("Birthday offers and partner benefits."),

    H1("8. Transaction and Service Fees"),
    H2("Customer pays"),
    Bullet("Product price."),
    Bullet("Delivery fee, if applicable."),
    Bullet("Mobile money transaction fees on customer purchases (paid by customer)."),
    H2("Business pays"),
    Bullet("Subscription fee, if subscribed."),
    Bullet("Boost or feature fee, if selected."),
    Bullet("Commission only if Pamoja+ processes the order or payment."),
    H2("Pamoja+ absorbs"),
    Bullet("Mobile money fees on its own collection of subscription and boost payments."),

    H1("9. Delivery Payment"),
    table(
      ["Model", "When", "Payment"],
      [
        ["Seller-managed delivery", "Launch phase", "Seller sets the fee and collects directly."],
        ["Pamoja+ delivery partner", "Later stage", "Pamoja+ coordinates with riders or couriers."],
        ["Pickup option", "Always available", "Customer pays online, by mobile money, or on pickup."]
      ]
    ),
    H2("Suggested delivery fees (Dar es Salaam)"),
    table(
      ["Distance / Area", "Suggested Fee"],
      [
        ["Nearby area", "TZS 2,000 – 3,000"],
        ["Within city zone", "TZS 3,000 – 7,000"],
        ["Long distance within city", "TZS 7,000 – 12,000"],
        ["Outside city", "Quoted separately"]
      ]
    ),

    H1("10. Launch Phasing"),
    table(
      ["Phase", "Timeline", "Payment Focus"],
      [
        ["Phase 1: Soft Launch", "0–3 months", "Free listings, paid boosts, direct inquiries, optional subscriptions, mobile money only."],
        ["Phase 2: Growth", "3–6 months", "Stronger subscriptions, featured campaigns, simple checkout via aggregator. Card support for diaspora."],
        ["Phase 3: Scale", "6–12 months", "Expand commissions, memberships, analytics, delivery, partner packages."]
      ]
    ),

    H1("11. Compliance Reminders"),
    Bullet("Track monthly turnover against the TZS 200,000,000 VAT threshold."),
    Bullet("Upon VAT registration, obtain and operate an EFD or VFD for compliant invoicing."),
    Bullet("Withholding tax may apply on certain payments (e.g., ambassador rewards above threshold)."),
    Bullet("Mobile money MDR (~1.5–2.5%) reduces effective commission margin."),

    H1("12. Recommended Final Starter Model"),
    Bullet("Free entry for businesses."),
    Bullet("Affordable monthly plans from TZS 15,000."),
    Bullet("Optional paid boosts from TZS 5,000 per day."),
    Bullet("Premium visibility and brand storytelling for growing businesses."),
    Bullet("0% commission on direct WhatsApp or call inquiries."),
    Bullet("3–5% commission only on completed platform-processed orders."),
    Bullet("Free access for shoppers during launch."),

    P([T("Closing recommendation: ", { bold: true }), T("Free to join. Affordable to grow. Fair to monetize. Pamoja+ monetizes growth, visibility, and completed value — not basic participation.")]),
    P([T("Pamoja+ — Grow Together. Shop Smarter.", { bold: true, color: GREEN_DARK })])
  ];
}

// ============================================================
// MAIN
// ============================================================
const outDir = path.join(__dirname, "..", "docs", "v2");
fs.mkdirSync(outDir, { recursive: true });

const docs = [
  { name: "Pamoja_Plus_Company_Profile_v2.docx",          build: buildCompanyProfile },
  { name: "Pamoja_Plus_Legal_Considerations_Tanzania_v2.docx", build: buildLegal },
  { name: "Pamoja_Plus_3_Month_Timeline_v2.docx",         build: buildTimeline },
  { name: "Pamoja_Plus_Team_Structure_and_Management_v2.docx", build: buildTeam },
  { name: "Pamoja_Plus_Payment_Structure_v2.docx",        build: buildPayment }
];

(async () => {
  for (const d of docs) {
    const doc = makeDoc(d.build());
    const buf = await Packer.toBuffer(doc);
    const outPath = path.join(outDir, d.name);
    fs.writeFileSync(outPath, buf);
    console.log("Wrote:", outPath, "(" + buf.length + " bytes)");
  }
  console.log("\nAll 5 v2 documents written to:", outDir);
})();
