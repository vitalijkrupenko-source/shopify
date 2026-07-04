"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FetchNowButton({
  businessId,
  hasPlaceId,
}: {
  businessId: string;
  hasPlaceId: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function fetchNow() {
    setBusy(true);
    const res = await fetch(`/api/businesses/${businessId}/snapshot`, { method: "POST" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Snapshot failed");
    }
  }

  return (
    <button
      onClick={fetchNow}
      disabled={busy || !hasPlaceId}
      title={hasPlaceId ? "Fetch current rating and review count from Google" : "Add a Google Place ID first"}
      className="btn-secondary"
    >
      {busy ? "Fetching…" : "⟳ Fetch now"}
    </button>
  );
}
