/**
 * Gmail Client Integration for Architecture & Design Leads
 * Scans user's authorized inbox for relevant leads/inquiries,
 * generates an intelligent proposal, and sends an alert email to Arslan Qaiser.
 */

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  bodyText: string;
  leadScore: number;
  matchReasons: string[];
  isArchitecturalLead: boolean;
}

export interface ProposalGenerationResult {
  detectedClientName: string;
  detectedSenderEmail: string;
  projectSummary: string;
  recommendedServices: string[];
  suggestedTurnaround: string;
  proposedFeeEstimate: string;
  customProposalDraft: string;
  followupSubject: string;
}

const ARCH_KEYWORDS = [
  "architect", "architecture", "drafting", "drafter", "cad", "autocad",
  "revit", "bim", "permit", "plan check", "blueprints", "elevations",
  "floor plan", "residential design", "construction documents", "redline",
  "remodeling", "addition", "adu", "3d render", "shop drawings", "title 24",
  "rhino", "rendering", "millwork", "interior design", "planning permission"
];

export async function fetchInboxArchitecturalMessages(
  accessToken: string,
  maxResults = 15
): Promise<GmailMessageSummary[]> {
  // Query for unread or recent messages matching architectural keywords or newsletters
  const query = encodeURIComponent("architect OR architecture OR drafting OR cad OR revit OR bim OR permit OR blueprint OR 3D");
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=${maxResults}`;

  const res = await fetch(listUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail API error (${res.status}): ${errorText}`);
  }

  const listData = await res.json();
  const messages: any[] = listData.messages || [];

  if (messages.length === 0) {
    // If specific query had 0 results, fetch recent messages from inbox generally
    const fallbackListRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    if (fallbackListRes.ok) {
      const fbData = await fallbackListRes.json();
      messages.push(...(fbData.messages || []));
    }
  }

  const detailedSummaries: GmailMessageSummary[] = [];

  // Fetch metadata and snippets for each message in parallel
  const detailPromises = messages.slice(0, 15).map(async (msg) => {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      if (!msgRes.ok) return null;
      const data = await msgRes.json();

      let subject = "No Subject";
      let from = "Unknown";
      let to = "";
      let date = "";

      const headers: { name: string; value: string }[] = data.payload?.headers || [];
      headers.forEach((h) => {
        const name = h.name.toLowerCase();
        if (name === "subject") subject = h.value;
        if (name === "from") from = h.value;
        if (name === "to") to = h.value;
        if (name === "date") date = h.value;
      });

      // Extract plain text body if possible
      let bodyText = data.snippet || "";
      if (data.payload?.parts) {
        for (const part of data.payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            try {
              const decoded = Buffer.from(part.body.data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
              if (decoded.length > bodyText.length) {
                bodyText = decoded.slice(0, 2000);
              }
            } catch {
              // ignore decode error
            }
          }
        }
      }

      // Calculate lead score & matching keywords
      const textToAnalyze = `${subject} ${bodyText} ${data.snippet}`.toLowerCase();
      const matchReasons: string[] = [];
      let leadScore = 20; // baseline

      ARCH_KEYWORDS.forEach((kw) => {
        if (textToAnalyze.includes(kw)) {
          matchReasons.push(kw);
          leadScore += 12;
        }
      });

      // Boost if asking for quote, proposal, timeline, rate, or project
      if (/quote|estimate|proposal|price|rate|budget|looking for|need someone|urgent|hire|freelance/i.test(textToAnalyze)) {
        leadScore += 25;
        matchReasons.push("high-intent intent phrase");
      }

      leadScore = Math.min(100, leadScore);
      const isArchitecturalLead = matchReasons.length > 0 || leadScore >= 40;

      return {
        id: data.id,
        threadId: data.threadId,
        from,
        to,
        subject,
        date,
        snippet: data.snippet || "",
        bodyText: bodyText.slice(0, 3000),
        leadScore,
        matchReasons: Array.from(new Set(matchReasons)),
        isArchitecturalLead,
      };
    } catch (e) {
      return null;
    }
  });

  const results = await Promise.all(detailPromises);
  results.forEach((r) => {
    if (r) detailedSummaries.push(r);
  });

  // Sort by highest lead score first
  detailedSummaries.sort((a, b) => b.leadScore - a.leadScore);

  return detailedSummaries;
}

export async function sendEmailViaGmailApi(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    bodyText,
  ];
  const rawMessage = messageParts.join("\r\n");

  const base64Encoded = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: base64Encoded }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to send email via Gmail API (${response.status}): ${errorData}`);
  }

  return response.json();
}
