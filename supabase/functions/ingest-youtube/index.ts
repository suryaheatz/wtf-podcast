import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { YoutubeTranscript } from 'npm:youtube-transcript';
import OpenAI from 'npm:openai';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface YouTubeMetadata {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  const response = await fetch(oembedUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube metadata');
  }

  const data = await response.json();

  return {
    videoId,
    title: data.title || 'Untitled Video',
    thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    channelTitle: data.author_name,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const rawPayload = await req.text();
    console.log("🔍 RAW PAYLOAD RECEIVED:", rawPayload);

    const payload = JSON.parse(rawPayload);
    const { youtubeUrl, manual_transcript } = payload;

    console.log("🚀 Starting Ingest for:", youtubeUrl);
    console.log("📝 Manual Transcript received?", !!manual_transcript);
    console.log("📝 Manual Transcript length:", manual_transcript?.length || 0);
    console.log("📝 Manual Transcript first 100 chars:", manual_transcript?.substring(0, 100) || "EMPTY");

    if (!youtubeUrl) {
      throw new Error("YouTube URL is required");
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const openai = new OpenAI({ apiKey: openAiKey });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL format");
    }

    const metadata = await fetchYouTubeMetadata(videoId);
    console.log("✅ Metadata fetched:", metadata.title);

    let transcriptText = "";

    if (manual_transcript && manual_transcript.length > 50) {
      console.log("✅ Using Manual Transcript");
      transcriptText = manual_transcript;

      if (transcriptText.length > 50000) {
        transcriptText = transcriptText.substring(0, 50000);
      }
      console.log("✅ Manual transcript processed. Length:", transcriptText.length);
    } else {
      console.log("🔄 Attempting Auto-Fetch...");
      try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        transcriptText = transcriptItems.map((item: any) => item.text).join(' ');

        if (transcriptText.length > 50000) {
          transcriptText = transcriptText.substring(0, 50000);
        }
        console.log("✅ Transcript auto-fetched. Length:", transcriptText.length);
      } catch (err) {
        console.error("❌ Transcript fetch failed:", err);
        throw new Error("Could not fetch transcript. Please paste it manually.");
      }
    }

    let aiData = {
      title: metadata.title,
      framing: "Transcript unavailable. Please review manually.",
      guest_tags: {} as Record<string, string>,
      insights: [] as any[]
    };

    console.log("🔍 DEBUG: About to check if transcriptText exists...");
    console.log("🔍 DEBUG: transcriptText is populated?", !!transcriptText);
    console.log("🔍 DEBUG: transcriptText length:", transcriptText?.length || 0);

    if (transcriptText) {
      console.log("✅ AI BLOCK ENTERED! Sending to GPT-4o-mini... (text length:", transcriptText.length, ")");

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a Business Intelligence Engine. Analyze the transcript and extract JSON.\n\nREQUIRED JSON STRUCTURE:\n{\n  "title": "Episode Title",\n  "framing": "2-sentence hook explaining why this matters",\n  "guest_tags": { "Guest Name": "Badge (e.g. Scale Operator, VC, Founder)" },\n  "insights": [\n    { "type": "tldr_summary", "content": "Brief bullet point summary" },\n    { "type": "metric", "title": "Label", "metric_value": "Num", "metric_unit": "Unit", "trend_direction": "up", "content": "Context" },\n    { "type": "roadmap_item", "title": "Phase Name", "context": "Subtitle", "content": "Action item" },\n    { "type": "quote", "content": "Quote text", "speaker": "Name", "context": "Context footer" },\n    { "type": "tactical_advice", "title": "Headline", "content": "Details", "context": "DO or DONT" },\n    { "type": "chapter", "title": "Headline", "category_tag": "Category", "content": "Context", "signal": "Signal", "action_item": "Next Step", "speaker": "Name" }\n  ]\n}\n\nIMPORTANT: Only use these exact type values: tldr_summary, metric, roadmap_item, quote, tactical_advice, chapter`
            },
            { role: "user", content: `Analyze this transcript: ${transcriptText}` }
          ],
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (content) {
          aiData = JSON.parse(content);
          console.log("✅ AI Analysis complete");
        }
      } catch (aiError) {
        console.error("⚠️ OpenAI error:", aiError);
      }
    } else {
      console.log("⚠️ AI BLOCK SKIPPED - transcriptText is empty or falsy!");
    }

    const { data: podcast, error: podcastError } = await supabase
      .from('podcasts')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (podcastError || !podcast) {
      throw new Error("No active podcast found. Please create a podcast first.");
    }

    const { data: lastEpisode } = await supabase
      .from('episodes')
      .select('episode_number')
      .eq('podcast_id', podcast.id)
      .order('episode_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextEpisodeNumber = (lastEpisode?.episode_number || 0) + 1;

    console.log("💾 Saving to Supabase...");

    const { data: episode, error: epError } = await supabase
      .from('episodes')
      .insert({
        podcast_id: podcast.id,
        episode_number: nextEpisodeNumber,
        title: aiData.title,
        youtube_video_id: videoId,
        thumbnail_url: metadata.thumbnail,
        guest_name: metadata.channelTitle || 'Guest',
        release_date: new Date().toISOString().split('T')[0],
        framing: aiData.framing,
        is_published: false,
        duration_minutes: 60,
      })
      .select()
      .single();

    if (epError) {
      console.error('Episode insert error:', epError);
      throw new Error(`Failed to create episode: ${epError.message}`);
    }

    console.log("✅ Episode created:", episode.id);

    if (aiData.guest_tags && Object.keys(aiData.guest_tags).length > 0) {
      console.log("👥 Processing guests...");
      let guestOrder = 0;

      for (const [name, tag] of Object.entries(aiData.guest_tags)) {
        const { data: guest, error: guestError } = await supabase
          .from('guests')
          .upsert({
            name,
            avatar_url: '',
            bio: tag as string
          }, {
            onConflict: 'name',
            ignoreDuplicates: false
          })
          .select()
          .maybeSingle();

        if (guest && !guestError) {
          await supabase.from('episode_guests').insert({
            episode_id: episode.id,
            guest_id: guest.id,
            guest_tag: tag as string,
            display_order: guestOrder++
          });
          console.log(`✅ Guest linked: ${name}`);
        } else if (guestError) {
          console.error(`⚠️ Guest error for ${name}:`, guestError);
        }
      }
    }

    if (aiData.insights && aiData.insights.length > 0) {
      console.log(`📊 Inserting ${aiData.insights.length} insights...`);

      const insightsToInsert = aiData.insights.map((item: any, index: number) => ({
        episode_id: episode.id,
        type: item.type,
        title: item.title || null,
        content: item.content || null,
        context: item.context || null,
        metric_value: item.metric_value || null,
        metric_unit: item.metric_unit || null,
        trend_direction: item.trend_direction || null,
        speaker: item.speaker || null,
        category_tag: item.category_tag || null,
        signal: item.signal || null,
        action_item: item.action_item || null,
        display_order: index
      }));

      const { error: insightsError } = await supabase
        .from('episode_insights')
        .insert(insightsToInsert);

      if (insightsError) {
        console.error('⚠️ Insights insert error:', insightsError);
      } else {
        console.log("✅ Insights inserted");
      }
    } else {
      await supabase.from('episode_insights').insert({
        episode_id: episode.id,
        type: 'tldr_summary',
        title: 'Key Takeaway',
        content: 'This episode provides valuable insights. AI analysis pending.',
        display_order: 0
      });
    }

    console.log("✅ Success! Episode ID:", episode.id);

    return new Response(
      JSON.stringify({
        success: true,
        episode_id: episode.id,
        title: aiData.title,
        insights_count: aiData.insights?.length || 0
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error: any) {
    console.error("🔥 Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
