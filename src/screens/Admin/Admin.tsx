import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

interface DraftEpisode {
  id: string;
  title: string;
  youtube_video_id: string;
  framing: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [manualTranscript, setManualTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [drafts, setDrafts] = useState<DraftEpisode[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoadingDrafts(true);
    const { data, error } = await supabase
      .from('episodes')
      .select('id, title, youtube_video_id, framing, created_at')
      .eq('is_published', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
    } else {
      setDrafts(data || []);
    }
    setIsLoadingDrafts(false);
  };

  const handleIngest = async () => {
    if (!youtubeUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a YouTube URL' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const apiUrl = `${supabaseUrl}/functions/v1/ingest-youtube`;

      const requestBody = {
        youtubeUrl: youtubeUrl.trim(),
        manual_transcript: manualTranscript.trim()
      };

      console.log('Sending request with body:', {
        youtubeUrl: requestBody.youtubeUrl,
        transcriptLength: requestBody.manual_transcript.length
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response received:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Draft Created! "${data.title}" with ${data.insights_count} insights`
        });
        setYoutubeUrl('');
        setManualTranscript('');
        fetchDrafts();
      } else {
        throw new Error(data.error || 'Ingestion failed');
      }
    } catch (err: any) {
      console.error('Ingest error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to process video'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (episodeId: string) => {
    const { error } = await supabase
      .from('episodes')
      .update({ is_published: true })
      .eq('id', episodeId);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to publish episode' });
    } else {
      setMessage({ type: 'success', text: 'Episode published!' });
      setDrafts(drafts.filter(d => d.id !== episodeId));
    }
  };

  const handleDelete = async (episodeId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', episodeId);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to delete episode' });
    } else {
      setMessage({ type: 'success', text: 'Episode deleted successfully' });
      setDrafts(drafts.filter(d => d.id !== episodeId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Ingest new episodes and manage drafts</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Ingest New Episode</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paste Transcript Manually (Optional)
              </label>
              <textarea
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="If auto-transcript fails, paste the transcript here..."
                rows={8}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
                disabled={isProcessing}
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to auto-fetch. If the video has no captions, paste the transcript manually.
              </p>
            </div>

            <Button
              onClick={handleIngest}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Extracting & Analyzing...
                </span>
              ) : (
                'Generate Episode'
              )}
            </Button>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Draft Episodes</h2>

          {isLoadingDrafts ? (
            <div className="text-center py-12 text-slate-400">Loading drafts...</div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No drafts yet. Ingest your first episode above!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {drafts.map((draft) => (
                <Card
                  key={draft.id}
                  className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden hover:border-slate-600 transition-colors"
                >
                  <div className="flex gap-6 p-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${draft.youtube_video_id}/mqdefault.jpg`}
                        alt={draft.title}
                        className="w-48 h-28 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">{draft.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{draft.framing}</p>
                      <div className="text-xs text-slate-500">
                        Created: {new Date(draft.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 justify-center">
                      <Button
                        onClick={() => navigate(`/episode/${draft.id}`)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        REVIEW
                      </Button>
                      <Button
                        onClick={() => handlePublish(draft.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        PUBLISH
                      </Button>
                      <Button
                        onClick={() => handleDelete(draft.id, draft.title)}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
