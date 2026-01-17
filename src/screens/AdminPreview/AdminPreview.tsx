import React, { useEffect, useMemo, useState } from "react";

type AnyObj = Record<string, any>;

function safeArray(v: any): any[] {
  return Array.isArray(v) ? v : [];
}

function groupBy<T extends AnyObj>(items: T[], key: string) {
  const out: Record<string, T[]> = {};
  for (const it of items) {
    const k = String(it?.[key] ?? "unknown");
    out[k] = out[k] || [];
    out[k].push(it);
  }
  return out;
}

function toYouTubeLink(youtubeVideoId: string, seconds?: number | null, fallback?: string | null) {
  if (typeof fallback === "string" && fallback.startsWith("http")) return fallback;
  if (!youtubeVideoId) return null;
  if (typeof seconds === "number" && Number.isFinite(seconds)) {
    return `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${seconds}s`;
  }
  return `https://www.youtube.com/watch?v=${youtubeVideoId}`;
}

export default function AdminPreview() {
  const [chunkNumber, setChunkNumber] = useState<number>(1);
  const [data, setData] = useState<AnyObj | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const chunkPath = `/preview/chunk-${chunkNumber}.json`;

  useEffect(() => {
    let cancelled = false;
    setErr(null);
    setData(null);

    fetch(chunkPath, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${chunkPath}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setErr(String(e?.message || e));
      });

    return () => {
      cancelled = true;
    };
  }, [chunkPath]);

  const summary = data?.summary || {};
  const episode = data?.episode || {};
  const draft = data?.draft || {};
  const insights = safeArray(draft?.insights);
  const quotes = safeArray(draft?.quotes);

  const insightsBySection = useMemo(() => groupBy(insights, "ui_section"), [insights]);

  const youtubeVideoId = episode?.youtube_video_id || "";

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Admin Preview</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ fontSize: 14, opacity: 0.8 }}>Chunk</label>
          <select
            value={chunkNumber}
            onChange={(e) => setChunkNumber(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 8 }}
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                chunk-{i + 1}.json
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div style={{ padding: 12, borderRadius: 10, background: "#2a0f0f", marginBottom: 12 }}>
          <b>Error:</b> {err}
          <div style={{ marginTop: 6, opacity: 0.85 }}>Expected file at: {chunkPath}</div>
        </div>
      )}

      {!data && !err && <div>Loading {chunkPath}…</div>}

      {data && (
        <>
          {/* TOP SUMMARY */}
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.06)", marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{episode?.title || "Untitled Episode"}</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>
              Video: <code>{youtubeVideoId || "unknown"}</code>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
              <div><b>insights_count:</b> {summary?.insights_count ?? insights.length}</div>
              <div><b>quotes_count:</b> {summary?.quotes_count ?? quotes.length}</div>
              <div><b>last_timestamp:</b> {summary?.last_timestamp ?? "unknown"}</div>
              <div><b>status:</b> {summary?.extraction_status ?? "unknown"}</div>
              <div><b>complete:</b> {String(summary?.extraction_complete ?? false)}</div>
            </div>
          </div>

          {/* VOICE OF AUTHORITY */}
          <section style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 8 }}>Voice of Authority (Quotes)</h3>
            {quotes.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No quotes in this chunk.</div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {quotes.map((q: AnyObj) => {
                  const link = toYouTubeLink(youtubeVideoId, q.timestamp_seconds, q.metadata?.youtube_link);
                  return (
                    <div key={q.quote_id} style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{q.quote_text}</div>
                      <div style={{ marginTop: 6, opacity: 0.85, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span><b>Author:</b> {q.author ?? "unknown"}</span>
                        <span><b>Time:</b> {q.timestamp ?? "unknown"}</span>
                        {link && (
                          <a href={link} target="_blank" rel="noreferrer">
                            Open on YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* INSIGHTS BY UI SECTION */}
          {Object.entries(insightsBySection).map(([sectionName, items]) => (
            <section key={sectionName} style={{ marginBottom: 18 }}>
              <h3 style={{ marginBottom: 8 }}>
                {sectionName} <span style={{ opacity: 0.65 }}>({items.length})</span>
              </h3>

              <div style={{ display: "grid", gap: 10 }}>
                {items
                  .slice()
                  .sort((a: AnyObj, b: AnyObj) => (a.display_order ?? 0) - (b.display_order ?? 0))
                  .map((it: AnyObj) => {
                    const link = toYouTubeLink(youtubeVideoId, it.timestamp_seconds, it.metadata?.youtube_link);
                    return (
                      <div key={it.item_id} style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{it.title ?? "(no title)"}</div>
                          <div style={{ opacity: 0.75 }}>
                            <b>score:</b> {it.metadata?.priority_score ?? "?"} · <b>conf:</b> {it.metadata?.confidence ?? "?"}
                          </div>
                        </div>

                        {it.content && <div style={{ marginTop: 6 }}>{it.content}</div>}
                        {it.metric_value && (
                          <div style={{ marginTop: 6, opacity: 0.9 }}>
                            <b>Metric:</b> {it.metric_value} {it.metric_unit ?? ""}
                          </div>
                        )}

                        <div style={{ marginTop: 8, opacity: 0.85, display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <span><b>Type:</b> {it.type ?? "unknown"}</span>
                          <span><b>Speaker:</b> {it.speaker ?? "unknown"}</span>
                          <span><b>Time:</b> {it.timestamp_start ?? "unknown"}</span>
                          {link && (
                            <a href={link} target="_blank" rel="noreferrer">
                              Open on YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
