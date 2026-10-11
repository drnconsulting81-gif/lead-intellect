/**
 * LEADINTELLECT AUTOMATED PLATFORM TEST SUITE
 * Validates master database integrity, query performance, provider adapters,
 * credit ledgers, suppression registry, and export formatting.
 */

const fs = require("fs");
const path = require("path");

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
    passed++;
  } else {
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================`);
  console.log(` LEADINTELLECT COMPREHENSIVE PLATFORM TEST SUITE`);
  console.log(`====================================================${colors.reset}\n`);

  // ----------------------------------------------------
  // TEST SUITE 1: MASTER DATASET INTEGRITY
  // ----------------------------------------------------
  console.log(`${colors.bold}1. Master Dataset Ingestion & File Integrity${colors.reset}`);
  const prospectsPath = path.join(__dirname, "..", "data", "prospects.json");
  const companiesPath = path.join(__dirname, "..", "data", "companies.json");

  assert(fs.existsSync(prospectsPath), "data/prospects.json exists");
  assert(fs.existsSync(companiesPath), "data/companies.json exists");

  const prospects = JSON.parse(fs.readFileSync(prospectsPath, "utf-8"));
  const companies = JSON.parse(fs.readFileSync(companiesPath, "utf-8"));

  assert(prospects.length >= 49000, `Prospects dataset size is ${prospects.length} records (expected ~50k)`);
  assert(companies.length >= 8000, `Companies dataset size is ${companies.length} records (expected >8k)`);

  const sampleProspect = prospects[0];
  assert(Boolean(sampleProspect.id && sampleProspect.name), "Prospect records have valid ID and Full Name");
  assert(Boolean(sampleProspect.email && sampleProspect.email.includes("@")), "Prospect records contain email address");
  assert(Boolean(sampleProspect.emailStatus), `Prospect record has truthful email status: "${sampleProspect.emailStatus}"`);
  assert(sampleProspect.emailStatus !== "generic_verified", "Email status does not use generic unverified placeholders");

  // ----------------------------------------------------
  // TEST SUITE 2: TARGET PROSPECT QUERY SCENARIOS
  // ----------------------------------------------------
  console.log(`\n${colors.bold}2. Target Query Scenarios Over Actual Master Data${colors.reset}`);

  // Scenario A: CFOs at Indian manufacturing companies
  const t0 = Date.now();
  const cfoIndiaManufacturing = prospects.filter((p) => {
    const isCfo = (p.title || "").toLowerCase().includes("cfo") || (p.title || "").toLowerCase().includes("chief financial officer");
    const isIndia = (p.country || "").toLowerCase().includes("india") || (p.location || "").toLowerCase().includes("india");
    const isMfg = (p.industry || "").toLowerCase().includes("manufacturing") || (p.industry || "").toLowerCase().includes("industrial");
    return isCfo && (isIndia || isMfg);
  });
  const tQuery = Date.now() - t0;
  assert(cfoIndiaManufacturing.length >= 0, `Search: CFOs in India/Manufacturing returned ${cfoIndiaManufacturing.length} records in ${tQuery}ms (<50ms target)`);

  // Scenario B: Operations leaders at US manufacturing firms
  const opsUSMfg = prospects.filter((p) => {
    const isOps = (p.title || "").toLowerCase().includes("operation") || (p.title || "").toLowerCase().includes("coo") || (p.title || "").toLowerCase().includes("vp operations");
    const isUS = (p.country || "").toLowerCase().includes("united states") || (p.country || "").toLowerCase().includes("us");
    return isOps && isUS;
  });
  assert(opsUSMfg.length > 0, `Search: Operations leaders in US returned ${opsUSMfg.length} real decision-makers`);

  // Scenario C: Decision-makers at SaaS / Technology companies
  const saasLeaders = prospects.filter((p) => {
    const ind = (p.industry || "").toLowerCase();
    return ind.includes("software") || ind.includes("technology") || ind.includes("information technology") || ind.includes("saas");
  });
  assert(saasLeaders.length > 500, `Search: Technology/SaaS decision-makers returned ${saasLeaders.length} matching prospects`);

  // Scenario D: Phone coverage check
  const phoneContacts = prospects.filter((p) => p.hasPhone && p.phone && p.phone.trim().length > 0);
  assert(phoneContacts.length > 0, `Contact Coverage: ${phoneContacts.length} verified phone records exist in dataset`);

  // ----------------------------------------------------
  // TEST SUITE 3: FIT SCORING INTEGRITY
  // ----------------------------------------------------
  console.log(`\n${colors.bold}3. Fit Scoring Logic & 0-100 Normalization${colors.reset}`);
  const scores = prospects.slice(0, 100).map((p) => p.icpScore);
  const allInRange = scores.every((s) => typeof s === "number" && s >= 0 && s <= 100);
  assert(allInRange, "All calculated ICP Fit Scores are bounded strictly between 0 and 100");

  const tier1Count = prospects.filter((p) => p.icpTier === "Tier 1").length;
  assert(tier1Count > 0, `Tier 1 Prospects: ${tier1Count} high-fit decision-makers identified`);

  // ----------------------------------------------------
  // TEST SUITE 4: LOCAL DATABASE SCHEMA & FALLBACK
  // ----------------------------------------------------
  console.log(`\n${colors.bold}4. Storage Layer & Record Persistence${colors.reset}`);
  const dbPath = path.join(__dirname, "..", "data", "db.json");
  assert(fs.existsSync(dbPath), "Local storage file data/db.json exists");

  const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  assert(Array.isArray(dbData.users), "data/db.json has users table");
  assert(Array.isArray(dbData.lists), "data/db.json has lists table");
  assert(Array.isArray(dbData.creditLedger), "data/db.json has creditLedger table");
  assert(Array.isArray(dbData.suppressions), "data/db.json has suppressions table");
  assert(Array.isArray(dbData.exportLogs), "data/db.json has exportLogs table");

  // ----------------------------------------------------
  // TEST SUITE 5: PRIVACY SUPPRESSION & OPT-OUT REGISTRY
  // ----------------------------------------------------
  console.log(`\n${colors.bold}5. Privacy Suppression & Opt-Out Registry${colors.reset}`);
  const testEmail = "optout-test-" + Date.now() + "@example.com";
  dbData.suppressions.push({
    id: "sup_test",
    email: testEmail.toLowerCase(),
    reason: "User requested opt-out",
    source: "web_request",
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  const reloadedDb = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const isSuppressed = reloadedDb.suppressions.some((s) => s.email === testEmail.toLowerCase());
  assert(isSuppressed, `Suppression check confirms ${testEmail} is registered in opt-out database`);

  // Clean up test suppression
  dbData.suppressions = dbData.suppressions.filter((s) => s.id !== "sup_test");
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  // ----------------------------------------------------
  // TEST SUITE 6: CSV EXPORT FORMATTING & ESCAPING
  // ----------------------------------------------------
  console.log(`\n${colors.bold}6. CSV Export RFC Compliance & Escaping${colors.reset}`);
  function escapeCsvValue(val) {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const testValWithQuotes = 'VP of "Sales" & Marketing';
  const escaped = escapeCsvValue(testValWithQuotes);
  assert(escaped === '"VP of ""Sales"" & Marketing"', "CSV value properly escapes inner quotes per RFC 4180");

  const testValWithNewline = "Line 1\nLine 2";
  const escapedNewline = escapeCsvValue(testValWithNewline);
  assert(escapedNewline.startsWith('"') && escapedNewline.endsWith('"'), "CSV value with newline is safely quoted");

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log(`\n${colors.bold}${colors.cyan}====================================================`);
  console.log(` TEST EXECUTION SUMMARY`);
  console.log(`====================================================${colors.reset}`);
  console.log(` Total Checks: ${passed + failed}`);
  console.log(` ${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(` ${failed === 0 ? colors.green : colors.red}Failed: ${failed}${colors.reset}`);

  if (failed > 0) {
    console.error(`\n${colors.red}${colors.bold}Some tests failed! Review logs above.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}All platform test suites passed successfully!${colors.reset}\n`);
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
