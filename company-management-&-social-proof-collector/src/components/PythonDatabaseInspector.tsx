import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Database, 
  Play, 
  CheckCircle2, 
  Copy, 
  Download, 
  Check, 
  FileCode, 
  Layers, 
  RefreshCw,
  Cpu,
  Key,
  BarChart2,
  Table as TableIcon,
  Code2,
  Sparkles,
  Search
} from 'lucide-react';

export const PythonDatabaseInspector: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'system' | 'server' | 'gui'>('system');
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<any>(null);
  const [systemCode, setSystemCode] = useState<string>('');
  const [serverCode, setServerCode] = useState<string>('');
  const [guiCode, setGuiCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Interactive Query Console state
  const [customSql, setCustomSql] = useState('SELECT id, client_name, company_role, rating, status FROM testimonials LIMIT 5;');
  const [activeActionName, setActiveActionName] = useState<string>('Run Engine Test');
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'json' | 'table'>('table');

  useEffect(() => {
    fetchSource();
  }, []);

  const fetchSource = async () => {
    try {
      const res = await fetch('/api/python/source-code');
      const data = await res.json();
      if (data.backendCode) setSystemCode(data.backendCode);
      if (data.serverCode) setServerCode(data.serverCode);
      if (data.guiCode) setGuiCode(data.guiCode);
    } catch {
      // Fallback
    }
  };

  const runPythonAction = async (action: string, query?: string, label?: string) => {
    setIsRunning(true);
    setTestOutput(null);
    setActiveActionName(label || action);
    const start = performance.now();

    try {
      if (action === 'run_test') {
        const res = await fetch('/api/python/run-test');
        const data = await res.json();
        setTestOutput(data);
      } else {
        const res = await fetch('/api/python/execute-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, query }),
        });
        const data = await res.json();
        setTestOutput(data);
      }
    } catch (err: any) {
      setTestOutput({
        success: false,
        error: err.message,
      });
    } finally {
      setIsRunning(false);
      setExecutionTimeMs(Math.round(performance.now() - start));
    }
  };

  const getActiveCode = () => {
    if (activeCodeTab === 'system') return systemCode;
    if (activeCodeTab === 'server') return serverCode;
    return guiCode;
  };

  const getActiveFilename = () => {
    if (activeCodeTab === 'system') return 'python_testimonial_system.py';
    if (activeCodeTab === 'server') return 'python_server.py';
    return 'python_gui_app.py';
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const code = getActiveCode();
    const filename = getActiveFilename();
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render Table view if result is an array of objects
  const renderTableResult = () => {
    const data = testOutput?.result;
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <pre className="p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {testOutput.output || JSON.stringify(testOutput.result || testOutput, null, 2)}
        </pre>
      );
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs text-slate-300 font-mono">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2 text-slate-300 max-w-xs truncate">
                    {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Python 3 • Testimonial &amp; Social Proof Collector
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Interactive Playground
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Execute live Python 3 queries, test JWT 15-minute token rotation, inspect SQLite schemas, and test endpoints interactively in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => runPythonAction('run_test', undefined, 'Full Engine Test')}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-950 disabled:opacity-50 active:scale-[0.98]"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? 'Running Python...' : 'Run Full Engine Test'}</span>
            </button>
          </div>

        </div>

        {/* Interactive Quick-Test Actions Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
            Interactive Test Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runPythonAction('get_metrics', undefined, 'Rating Metrics')}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Query Rating Distribution</span>
            </button>

            <button
              onClick={() => runPythonAction('test_jwt', undefined, 'JWT 15m Pair Token Test')}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Test JWT Pair Auth (15m Expire)</span>
            </button>

            <button
              onClick={() => runPythonAction('inspect_schema', undefined, 'SQLite Tables')}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect SQLite Schema</span>
            </button>

            <button
              onClick={() => runPythonAction('custom_sql', 'SELECT id, name, slug, brand_color FROM spaces;', 'Query Spaces')}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>SELECT * FROM spaces</span>
            </button>
          </div>
        </div>

        {/* Custom Interactive SQL Console */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-1 bg-emerald-950/40 rounded border border-emerald-800/40 shrink-0">
            SQL &gt;
          </span>
          <input
            type="text"
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            placeholder="Type a SELECT query (e.g. SELECT * FROM testimonials WHERE rating = 5;)"
            className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            onClick={() => runPythonAction('custom_sql', customSql, 'Custom SQL')}
            disabled={isRunning || !customSql.trim()}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Execute</span>
          </button>
        </div>

      </div>

      {/* Real-time Python Test Execution Output Window */}
      {testOutput && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in">
          <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-white">
                Live Result: {activeActionName}
              </span>
              {executionTimeMs !== null && (
                <span className="text-[10px] text-slate-400 font-mono">
                  ({executionTimeMs} ms)
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                    viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3 h-3" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                    viewMode === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  JSON / Text
                </button>
              </div>

              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                ✓ Status: OK
              </span>
            </div>
          </div>

          {viewMode === 'table' ? (
            renderTableResult()
          ) : (
            <pre className="p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
              {testOutput.output || JSON.stringify(testOutput.result || testOutput, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Code Viewer & Export Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Subheader with Tab and Actions */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveCodeTab('system')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'system'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Core DB &amp; Engine</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('server')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'server'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>REST API Server (http.server)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('gui')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'gui'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>Desktop GUI (Tkinter)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={downloadFile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {getActiveFilename()}</span>
            </button>
          </div>

        </div>

        {/* Code Content */}
        <div className="relative">
          <pre className="p-5 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-[520px] leading-relaxed">
            <code>{getActiveCode() || '# Loading Python source code...'}</code>
          </pre>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Run locally with:{' '}
            <code className="bg-slate-200 text-slate-900 px-2 py-0.5 rounded font-mono font-bold">
              python3 {getActiveFilename()}
            </code>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Zero external pip dependencies (Standard Library only)
          </span>
        </div>

      </div>

    </div>
  );
};
