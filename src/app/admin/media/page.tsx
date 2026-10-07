'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api/client';
import { getAdminBrowserSupabase } from '@/lib/auth/supabase';
import {
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Filter,
} from 'lucide-react';

interface MediaItem {
  id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  mime_type: string;
  file_size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_at: string;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/media');
      if (res.success) {
        setItems(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = getAdminBrowserSupabase();
      let token: string | undefined;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const res = await fetch(`${backendUrl}/api/admin/v1/media/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error?.message || `Upload failed for ${file.name}`);
        }
      }

      await loadMedia();
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Asset Infrastructure
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Media Library
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Processed luxury high-res jewellery assets, WebP variants, and visual CDN references.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadMedia()}
            className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/mp4"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center space-x-2 bg-sera-espresso text-sera-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Media...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Assets</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2 bg-white/60 border border-sera-taupe/20 rounded-sm">
          <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
          <span className="text-xs">Loading media vault...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center text-sera-taupe bg-white/60 border border-dashed border-sera-taupe/30 rounded-sm">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30 text-sera-espresso" />
          <h3 className="text-sm font-semibold text-sera-espresso">No media assets found</h3>
          <p className="text-xs text-sera-taupe mt-1 max-w-sm mx-auto">
            Upload campaign imagery or product photos. They are automatically compressed into WebP/AVIF formats.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center space-x-2 border border-sera-espresso text-sera-espresso px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-sera-beige/30 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Select Files</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white/80 border border-sera-taupe/30 rounded-sm overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="aspect-square bg-sera-beige/20 relative overflow-hidden flex items-center justify-center">
                {item.mime_type.startsWith('image/') ? (
                  <img
                    src={item.public_url}
                    alt={item.alt_text || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-sera-taupe font-mono uppercase">
                    {item.mime_type}
                  </div>
                )}

                <div className="absolute inset-0 bg-sera-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <button
                    onClick={() => copyUrl(item.public_url, item.id)}
                    className="bg-white text-sera-espresso text-[11px] px-2.5 py-1 rounded-sm shadow-md flex items-center space-x-1.5 font-medium hover:bg-sera-beige/50"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-sera-taupe" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-2.5 border-t border-sera-taupe/20">
                <p className="text-[11px] font-semibold text-sera-espresso truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-sera-taupe font-mono">
                  <span>{item.width && item.height ? `${item.width}×${item.height}` : '—'}</span>
                  <span>{Math.round(item.file_size_bytes / 1024)} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
