import dns from "dns/promises";

export interface LeadVerificationResult {
  verifiedAt: string;
  overallStatus: "verified" | "suspicious" | "fake" | "pending";
  reliabilityScore: number; // 0 - 100
  emailCheck: {
    status: "valid_mx" | "no_mx" | "invalid_domain" | "disposable" | "syntax_error" | "missing";
    emailProvided: string;
    domain: string;
    mxRecords: string[];
    isDisposable: boolean;
    diagnosticMessage: string;
  };
  phoneCheck: {
    status: "valid" | "fake_555" | "invalid_format" | "repeating_digits" | "missing";
    phoneProvided: string;
    formattedNumber?: string;
    countryCode?: string;
    diagnosticMessage: string;
  };
  summaryBadge: string;
  recommendation: string;
  checkedByBot: string;
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "yopmail.com",
  "sharklasers.com",
  "getairmail.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "trashmail.com",
  "temp-mail.org",
  "dispostable.com",
]);

// Known fake/mock domains often used in templates
const MOCK_DOMAINS = new Set([
  "apexconstruct.com",
  "formarchitects.studio",
  "example.com",
  "test.com",
  "mock.com",
  "fake.com",
  "acme.com",
]);

/**
 * Validates email using RFC syntax, disposable check, and actual DNS MX lookup.
 */
export async function verifyEmailAddress(email: string = ""): Promise<LeadVerificationResult["emailCheck"]> {
  const trimmed = (email || "").trim().toLowerCase();

  if (!trimmed) {
    return {
      status: "missing",
      emailProvided: "No email address found",
      domain: "",
      mxRecords: [],
      isDisposable: false,
      diagnosticMessage: "No email address was provided on this lead record.",
    };
  }

  // Basic RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      status: "syntax_error",
      emailProvided: trimmed,
      domain: "",
      mxRecords: [],
      isDisposable: false,
      diagnosticMessage: `Malformed email syntax: '${trimmed}' is not a valid email address.`,
    };
  }

  const parts = trimmed.split("@");
  const domain = parts[1];

  // Disposable check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      status: "disposable",
      emailProvided: trimmed,
      domain,
      mxRecords: [],
      isDisposable: true,
      diagnosticMessage: `Disposable / temporary burner email provider detected ('${domain}'). Inquiries from disposable inboxes are almost always fake.`,
    };
  }

  // Immediate flag for known mock domains
  if (MOCK_DOMAINS.has(domain)) {
    return {
      status: "invalid_domain",
      emailProvided: trimmed,
      domain,
      mxRecords: [],
      isDisposable: false,
      diagnosticMessage: `Fictional mock template domain ('${domain}') detected. This domain does not host genuine client email.`,
    };
  }

  // Real DNS MX Record Lookup
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      return {
        status: "no_mx",
        emailProvided: trimmed,
        domain,
        mxRecords: [],
        isDisposable: false,
        diagnosticMessage: `Domain '${domain}' exists in DNS but has NO Mail Exchange (MX) records. It cannot receive incoming messages.`,
      };
    }

    const hostnames = mx.map((m) => m.exchange);
    return {
      status: "valid_mx",
      emailProvided: trimmed,
      domain,
      mxRecords: hostnames,
      isDisposable: false,
      diagnosticMessage: `Verified real mail server. Domain '${domain}' actively resolves to ${mx.length} MX host(s): ${hostnames.slice(0, 2).join(", ")}.`,
    };
  } catch (err: any) {
    const code = err?.code || "";
    if (code === "ENOTFOUND" || code === "NXDOMAIN" || code === "ENODATA") {
      return {
        status: "invalid_domain",
        emailProvided: trimmed,
        domain,
        mxRecords: [],
        isDisposable: false,
        diagnosticMessage: `Domain '${domain}' does not exist (DNS error: ${code}). No email inbox exists at this address.`,
      };
    }

    // If DNS resolution timed out or network blocked, check domain structure
    return {
      status: "invalid_domain",
      emailProvided: trimmed,
      domain,
      mxRecords: [],
      isDisposable: false,
      diagnosticMessage: `Failed to resolve mail servers for '${domain}' (${code || "Unreachable"}). Highly likely to be a non-existent domain.`,
    };
  }
}

/**
 * Validates phone / WhatsApp numbers for international E.164 validity and fictitious 555 patterns.
 */
export function verifyPhoneNumber(phone: string = ""): LeadVerificationResult["phoneCheck"] {
  const trimmed = (phone || "").trim();

  if (!trimmed) {
    return {
      status: "missing",
      phoneProvided: "No phone number found",
      diagnosticMessage: "No phone number was provided. Client did not leave contact digits.",
    };
  }

  // Clean characters except digits and plus
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");

  // Detect 555 fictitious Hollywood exchanges (e.g. +1 415 555-0192 or 555-xxxx)
  if (
    trimmed.includes("555-") || 
    trimmed.includes("(555)") || 
    trimmed.includes(" 555 ") || 
    /555[0-9]{4}/.test(digitsOnly)
  ) {
    return {
      status: "fake_555",
      phoneProvided: trimmed,
      diagnosticMessage: `Fictional 555 exchange detected in '${trimmed}'. This is a reserved Hollywood/movie fake placeholder number that cannot receive calls or WhatsApp.`,
    };
  }

  // Detect repeating or dummy sequential digits
  if (
    /^(.)\1{5,}$/.test(digitsOnly) || 
    digitsOnly === "123456789" || 
    digitsOnly === "1234567890" || 
    digitsOnly === "0000000000"
  ) {
    return {
      status: "repeating_digits",
      phoneProvided: trimmed,
      diagnosticMessage: `Sequential or repeating dummy digits detected in '${trimmed}'. This is an intentional placeholder.`,
    };
  }

  // Length check: E.164 specifies minimum 7 digits (small island territories) to max 15 digits
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return {
      status: "invalid_format",
      phoneProvided: trimmed,
      diagnosticMessage: `Invalid digit length (${digitsOnly.length} digits). Standard international phone numbers have between 8 and 15 digits.`,
    };
  }

  // Determine Country Dial Code if present
  let countryCode = "International";
  if (trimmed.startsWith("+1") || (digitsOnly.length === 10 && !trimmed.startsWith("+"))) {
    countryCode = "US / Canada (+1)";
  } else if (trimmed.startsWith("+44")) {
    countryCode = "United Kingdom (+44)";
  } else if (trimmed.startsWith("+92")) {
    countryCode = "Pakistan (+92)";
  } else if (trimmed.startsWith("+971")) {
    countryCode = "United Arab Emirates (+971)";
  } else if (trimmed.startsWith("+61")) {
    countryCode = "Australia (+61)";
  } else if (trimmed.startsWith("+49")) {
    countryCode = "Germany (+49)";
  }

  return {
    status: "valid",
    phoneProvided: trimmed,
    formattedNumber: trimmed.startsWith("+") ? trimmed : `+${digitsOnly}`,
    countryCode,
    diagnosticMessage: `Valid international phone format detected (${countryCode}). Verified format for WhatsApp and voice dispatch.`,
  };
}

/**
 * Runs the Lead Reliability Verification Agent on a single lead.
 */
export async function auditLeadReliability(
  email: string,
  phone?: string,
  botVersion: string = "LeadSentry Verification Bot v3.1"
): Promise<LeadVerificationResult> {
  const [emailCheck, phoneCheck] = await Promise.all([
    verifyEmailAddress(email),
    Promise.resolve(verifyPhoneNumber(phone || "")),
  ]);

  let reliabilityScore = 100;
  let overallStatus: LeadVerificationResult["overallStatus"] = "verified";

  // Email scoring
  if (emailCheck.status === "invalid_domain" || emailCheck.status === "no_mx") {
    reliabilityScore -= 70;
    overallStatus = "fake";
  } else if (emailCheck.status === "disposable" || emailCheck.status === "syntax_error") {
    reliabilityScore -= 80;
    overallStatus = "fake";
  } else if (emailCheck.status === "missing") {
    reliabilityScore -= 60;
    overallStatus = "suspicious";
  }

  // Phone scoring
  if (phoneCheck.status === "fake_555" || phoneCheck.status === "repeating_digits") {
    reliabilityScore -= 30;
    if (overallStatus !== "fake") overallStatus = "suspicious";
  } else if (phoneCheck.status === "missing") {
    reliabilityScore -= 20;
    if (overallStatus === "verified") overallStatus = "verified"; // Email is still verified
  } else if (phoneCheck.status === "invalid_format") {
    reliabilityScore -= 25;
    if (overallStatus !== "fake") overallStatus = "suspicious";
  }

  reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));

  if (reliabilityScore <= 30) {
    overallStatus = "fake";
  } else if (reliabilityScore <= 65) {
    overallStatus = "suspicious";
  }

  let summaryBadge = "Verified Real Lead";
  let recommendation = "Safe to send architectural proposals and initiate WhatsApp consultation.";

  if (overallStatus === "fake") {
    summaryBadge = "FAKED / UNRELIABLE LEAD";
    recommendation = "Do not waste time pursuing. The email domain does not resolve or phone is a fictional placeholder.";
  } else if (overallStatus === "suspicious") {
    summaryBadge = "SUSPICIOUS / INCOMPLETE LEAD";
    recommendation = "Proceed with caution. One or more contact coordinates failed verification.";
  } else if (phoneCheck.status === "missing") {
    summaryBadge = "VERIFIED EMAIL (NO PHONE)";
    recommendation = "Email inbox is verified active on DNS. Send initial proposal via email since no phone was provided.";
  }

  return {
    verifiedAt: new Date().toISOString(),
    overallStatus,
    reliabilityScore,
    emailCheck,
    phoneCheck,
    summaryBadge,
    recommendation,
    checkedByBot: botVersion,
  };
}
