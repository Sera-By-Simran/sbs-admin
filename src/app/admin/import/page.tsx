'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { FileSpreadsheet, Loader2, AlertCircle, RefreshCw, CheckCircle2, Play, ShieldAlert } from 'lucide-react';

export default function AdminImportPage() {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  async function loadSheetAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/import');
      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to inspect catalogue spreadsheet');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSheetAnalysis();
  }, []);

  async function handleDryRun() {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const res = await api.post('/api/admin/v1/import', { dry_run: true });
      if (res.success) {
        setSimulationResult(res.data);
      }
    } catch (err: any) {
      alert(`Simulation failed: ${err?.message}`);
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Catalogue Ingestion Engine
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Sheets Catalogue Synchroniser
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadSheetAnalysis}
            className="p-2 border border-sera-taupe/30 rounded-sm text-sera-espresso hover:bg-white text-xs font-semibold flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-scan Workbook</span>
          </button>
          <button
            onClick={handleDryRun}
            disabled={simulating || loading}
            className="px-3.5 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 flex items-center space-x-1.5 shadow-sm"
          >
            {simulating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sera-champagne" />
            ) : (
              <Play className="w-3.5 h-3.5 text-sera-champagne" />
            )}
            <span>Run Dry-Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-sm text-xs flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
        <div className="space-y-1">
          <span className="font-semibold block uppercase text-[10px] tracking-wider">
            Zero-Fabrication Safety Protocol
          </span>
          <p className="leading-relaxed">
            The source file at <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded">Sheets\SERA_BY_SIMRAN_PRODUCT_CATALOG_SYSTEM.xlsx</code> is strictly mounted in read-only mode. Placeholder template rows are flagged and excluded from live commit to prevent synthetic products from contaminating the production boutique.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-sera-taupe text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span>Parsing Excel sheets...</span>
        </div>
      ) : analysis && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sera-taupe/20 p-4 rounded-sm">
              <span className="text-[10px] uppercase text-sera-taupe font-semibold block">Total Sheet Rows</span>
              <span className="font-mono text-xl font-bold text-sera-espresso">{analysis.total_rows}</span>
            </div>
            <div className="bg-white border border-sera-taupe/20 p-4 rounded-sm">
              <span className="text-[10px] uppercase text-sera-taupe font-semibold block">Valid SKUs Found</span>
              <span className="font-mono text-xl font-bold text-sera-espresso">{analysis.validation?.valid_sku_count}</span>
            </div>
            <div className="bg-white border border-sera-taupe/20 p-4 rounded-sm">
              <span className="text-[10px] uppercase text-sera-taupe font-semibold block">Template / Draft Placeholders</span>
              <span className="font-mono text-xl font-bold text-amber-800">{analysis.validation?.template_row_count}</span>
            </div>
            <div className="bg-white border border-sera-taupe/20 p-4 rounded-sm">
              <span className="text-[10px] uppercase text-sera-taupe font-semibold block">Detected Categories</span>
              <span className="font-mono text-xl font-bold text-sera-espresso">{analysis.validation?.distinct_categories?.length || 0}</span>
            </div>
          </div>

          {/* Simulation Output */}
          {simulationResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Simulation Passed (Dry Run Mode)</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {simulationResult.message}
              </p>
              <div className="text-xs text-emerald-900 flex space-x-6 pt-1">
                <span>Eligible Records: <strong>{simulationResult.eligible_records_count}</strong></span>
                <span>Template Placeholders Filtered Out: <strong>{simulationResult.skipped_template_count}</strong></span>
              </div>
            </div>
          )}

          {/* Inspection Table */}
          <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
            <div className="p-3 bg-sera-ivory border-b border-sera-taupe/20 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                Sample Rows from &ldquo;{analysis.sheet_name}&rdquo;
              </span>
              <span className="text-[10px] text-sera-taupe font-mono">
                Sheets: {analysis.available_sheets?.join(', ')}
              </span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-sera-ivory/40 border-b border-sera-taupe/15 text-sera-taupe uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">SKU</th>
                  <th className="py-2.5 px-4">Product Title</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Selling Price (₹)</th>
                  <th className="py-2.5 px-4">Supplier Cost (₹)</th>
                  <th className="py-2.5 px-4">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sera-taupe/15 font-mono text-[11px]">
                {analysis.sample_rows?.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-sera-ivory/30">
                    <td className="py-2.5 px-4 font-bold text-sera-espresso">{row.sku}</td>
                    <td className="py-2.5 px-4 font-sans text-xs">{row.name}</td>
                    <td className="py-2.5 px-4 font-sans">{row.category}</td>
                    <td className="py-2.5 px-4">₹{row.selling_price_inr}</td>
                    <td className="py-2.5 px-4 text-sera-taupe">₹{row.supplier_cost_inr}</td>
                    <td className="py-2.5 px-4 font-sans">
                      {row.is_template ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-sm text-[10px] uppercase font-semibold">
                          Template
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-sm text-[10px] uppercase font-semibold">
                          Live Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
