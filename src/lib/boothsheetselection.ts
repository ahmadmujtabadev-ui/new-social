// lib/boothSheetApi.ts
export type BoothRow = {
  BoothID: string;
  Category: string;
  Status: string;
  BookedAt: string;
};

const SHEETDB_URL = "https://sheetdb.io/api/v1/3yt3d1sid36uv";

export async function getReservedBooths(category: string): Promise<number[]> {
  const url =
    SHEETDB_URL +
    "/search?Category=" +
    encodeURIComponent(category) +
    "&Status=selected";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const rows = (await res.json()) as BoothRow[];

  return rows
    .map((r) => Number(r.BoothID))
    .filter((n) => !Number.isNaN(n));
}

type ReserveResult =
  | { ok: true }
  | { ok: false; reason: "already-booked" | "network" };

export async function tryReserveBooth(params: {
  category: string;
  boothId: number;
}): Promise<ReserveResult> {
  const { category, boothId } = params;

  const checkUrl =
    SHEETDB_URL +
    "/search?Category=" +
    encodeURIComponent(category) +
    "&BoothID=" +
    encodeURIComponent(String(boothId));

  const checkRes = await fetch(checkUrl, { cache: "no-store" });
  if (!checkRes.ok) {
    return { ok: false, reason: "network" };
  }

  const existing = (await checkRes.json()) as BoothRow[];
  if (existing.length > 0) {
    return { ok: false, reason: "already-booked" };
  }

  const body = {
    data: [
      {
        BoothID: String(boothId),
        Category: category,
        Status: "selected",
        BookedAt: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(SHEETDB_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return { ok: false, reason: "network" };

  return { ok: true };
}
