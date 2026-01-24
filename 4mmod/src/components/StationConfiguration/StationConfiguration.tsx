// src/pages/StationConfiguration.tsx
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const SHEET_TYPE_LABELS: Record<string, string> = {
  PRODUCT: 'Product Characteristics (Assembly)',
  PROCESS: 'Process Check (Oven/Molding)',
  PAINT: 'Paint Quality Sheet',
  TOOLING: 'Perishable Tooling Sheet',
};

type Shopfloor = {
  id: number;
  name: string;
  sheet_type: keyof typeof SHEET_TYPE_LABELS;
};

type Line = {
  id: number;
  name: string;
  shopfloor: number;  // foreign key id
};

type Station = {
  id: number;
  name: string;
  line: number;       // foreign key id
};

// ────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all in one file
// ────────────────────────────────────────────────────────────────
export default function StationConfiguration() {
  // Data
  const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // Selection
  const [selectedShopfloorId, setSelectedShopfloorId] = useState<string>('');
  const [selectedLineId, setSelectedLineId] = useState<string>('');

  // Forms
  const [sfForm, setSfForm] = useState({ name: '', sheet_type: 'PRODUCT' as Shopfloor['sheet_type'] });
  const [editingSfId, setEditingSfId] = useState<number | null>(null);

  const [lineForm, setLineForm] = useState({ name: '', shopfloor: '' });
  const [editingLineId, setEditingLineId] = useState<number | null>(null);

  const [stationForm, setStationForm] = useState({ name: '', line: '' });
  const [editingStationId, setEditingStationId] = useState<number | null>(null);

  // UI
  const [activeTab, setActiveTab] = useState<'shopfloor' | 'line' | 'station'>('shopfloor');
  const [loading, setLoading] = useState(false);

  // ── Data Loading ───────────────────────────────────────────────
  useEffect(() => {
    loadShopfloors();
  }, []);

  useEffect(() => {
    if (selectedShopfloorId) {
      loadLines(Number(selectedShopfloorId));
      setSelectedLineId('');
      setStations([]);
    } else {
      setLines([]);
      setStations([]);
    }
  }, [selectedShopfloorId]);

  useEffect(() => {
    if (selectedLineId) {
      loadStations(Number(selectedLineId));
    } else {
      setStations([]);
    }
  }, [selectedLineId]);

  const loadShopfloors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Shopfloor[]>('/api/shopfloors/');
      setShopfloors(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load shopfloors');
    } finally {
      setLoading(false);
    }
  };

  const loadLines = async (shopfloorId: number) => {
    try {
      const { data } = await axios.get<Line[]>(`/api/lines/?shopfloor=${shopfloorId}`);
      setLines(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStations = async (lineId: number) => {
    try {
      const { data } = await axios.get<Station[]>(`/api/stations/?line=${lineId}`);
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Shopfloor CRUD ─────────────────────────────────────────────
  const handleShopfloorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sfForm.name.trim()) return alert('Name is required');

    try {
      const payload = { name: sfForm.name, sheet_type: sfForm.sheet_type };

      if (editingSfId) {
        await axios.put(`/api/shopfloors/${editingSfId}/`, payload);
      } else {
        await axios.post('/api/shopfloors/', payload);
      }

      setSfForm({ name: '', sheet_type: 'PRODUCT' });
      setEditingSfId(null);
      loadShopfloors();
    } catch (err: any) {
      alert(err.response?.data?.name?.[0] || 'Error saving shopfloor');
    }
  };

  const startEditShopfloor = (item: Shopfloor) => {
    setSfForm({ name: item.name, sheet_type: item.sheet_type });
    setEditingSfId(item.id);
  };

  const deleteShopfloor = async (id: number) => {
    if (!window.confirm('Delete this shopfloor and all related lines & stations?')) return;
    try {
      await axios.delete(`/api/shopfloors/${id}/`);
      loadShopfloors();
      if (Number(selectedShopfloorId) === id) setSelectedShopfloorId('');
    } catch {
      alert('Cannot delete (likely has dependencies)');
    }
  };

  // ── Line CRUD ──────────────────────────────────────────────────
  const handleLineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineForm.name.trim()) return alert('Name is required');
    if (!selectedShopfloorId) return alert('Select a shopfloor first');

    try {
      const payload = {
        name: lineForm.name,
        shopfloor: Number(selectedShopfloorId),
      };

      if (editingLineId) {
        await axios.put(`/api/lines/${editingLineId}/`, payload);
      } else {
        await axios.post('/api/lines/', payload);
      }

      setLineForm({ name: '', shopfloor: '' });
      setEditingLineId(null);
      loadLines(Number(selectedShopfloorId));
    } catch (err: any) {
      alert(err.response?.data?.name?.[0] || 'Error saving line');
    }
  };

  const startEditLine = (item: Line) => {
    setLineForm({ name: item.name, shopfloor: String(item.shopfloor) });
    setEditingLineId(item.id);
  };

  const deleteLine = async (id: number) => {
    if (!window.confirm('Delete this line and all stations?')) return;
    try {
      await axios.delete(`/api/lines/${id}/`);
      loadLines(Number(selectedShopfloorId));
      if (Number(selectedLineId) === id) setSelectedLineId('');
    } catch {
      alert('Cannot delete');
    }
  };

  // ── Station CRUD ───────────────────────────────────────────────
  const handleStationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationForm.name.trim()) return alert('Name is required');
    if (!selectedLineId) return alert('Select a line first');

    try {
      const payload = {
        name: stationForm.name,
        line: Number(selectedLineId),
      };

      if (editingStationId) {
        await axios.put(`/api/stations/${editingStationId}/`, payload);
      } else {
        await axios.post('/api/stations/', payload);
      }

      setStationForm({ name: '', line: '' });
      setEditingStationId(null);
      loadStations(Number(selectedLineId));
    } catch (err: any) {
      alert(err.response?.data?.name?.[0] || 'Error saving station');
    }
  };

  const startEditStation = (item: Station) => {
    setStationForm({ name: item.name, line: String(item.line) });
    setEditingStationId(item.id);
  };

  const deleteStation = async (id: number) => {
    if (!window.confirm('Delete this station?')) return;
    try {
      await axios.delete(`/api/stations/${id}/`);
      loadStations(Number(selectedLineId));
    } catch {
      alert('Cannot delete');
    }
  };

  // ── Helpers ────────────────────────────────────────────────────
  const currentShopfloor = useMemo(
    () => shopfloors.find(s => s.id === Number(selectedShopfloorId)),
    [shopfloors, selectedShopfloorId]
  );

  const currentLine = useMemo(
    () => lines.find(l => l.id === Number(selectedLineId)),
    [lines, selectedLineId]
  );

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <div className="container mx-auto px-4 py-10 max-w-7xl">

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Shopfloor Configuration
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Manage Shopfloors → Lines → Stations
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['shopfloor', 'line', 'station'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-md hover:shadow-xl
                ${activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'}
              `}
            >
              {tab === 'shopfloor' ? 'Shopfloors' : tab === 'line' ? 'Lines' : 'Stations'}
            </button>
          ))}
        </div>

        {/* ── SHOPFLOOR ─────────────────────────────────────────────── */}
        {activeTab === 'shopfloor' && (
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Form */}
            <section className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                {editingSfId ? 'Edit Shopfloor' : 'New Shopfloor'}
              </h2>

              <form onSubmit={handleShopfloorSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    value={sfForm.name}
                    onChange={e => setSfForm({ ...sfForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="e.g. Engine Assembly Area"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sheet Type</label>
                  <select
                    value={sfForm.sheet_type}
                    onChange={e => setSfForm({ ...sfForm, sheet_type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    {Object.entries(SHEET_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                  >
                    {editingSfId ? 'Update' : 'Create'}
                  </button>
                  {editingSfId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSfForm({ name: '', sheet_type: 'PRODUCT' });
                        setEditingSfId(null);
                      }}
                      className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* List */}
            <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
              <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-800">Shopfloors</h3>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500 animate-pulse">Loading...</div>
              ) : shopfloors.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No shopfloors yet</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {shopfloors.map(sf => (
                    <div key={sf.id} className="px-8 py-5 flex items-center justify-between hover:bg-indigo-50/60 transition">
                      <div>
                        <div className="font-semibold text-lg">{sf.name}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{SHEET_TYPE_LABELS[sf.sheet_type]}</div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => startEditShopfloor(sf)} className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                          Edit
                        </button>
                        <button onClick={() => deleteShopfloor(sf.id)} className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── LINE ────────────────────────────────────────────────────── */}
        {activeTab === 'line' && (
          <div className="space-y-10">

            <section className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Manage Lines</h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shopfloor</label>
                <select
                  value={selectedShopfloorId}
                  onChange={e => {
                    setSelectedShopfloorId(e.target.value);
                    setLineForm(prev => ({ ...prev, shopfloor: e.target.value }));
                  }}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Shopfloor...</option>
                  {shopfloors.map(sf => (
                    <option key={sf.id} value={sf.id}>{sf.name}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleLineSubmit} className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Line Name</label>
                  <input
                    value={lineForm.name}
                    onChange={e => setLineForm({ ...lineForm, name: e.target.value })}
                    disabled={!selectedShopfloorId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                    placeholder="e.g. Main Line, Line 3"
                    required
                  />
                </div>

                <div className="flex items-end gap-4">
                  <button
                    type="submit"
                    disabled={!selectedShopfloorId}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {editingLineId ? 'Update' : 'Create'}
                  </button>

                  {editingLineId && (
                    <button
                      type="button"
                      onClick={() => {
                        setLineForm({ name: '', shopfloor: selectedShopfloorId });
                        setEditingLineId(null);
                      }}
                      className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {selectedShopfloorId && (
              <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
                <div className="px-8 py-5 bg-purple-50 border-b border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800">
                    Lines in {currentShopfloor?.name || '—'}
                  </h3>
                </div>

                {lines.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No lines created yet</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {lines.map(line => (
                      <div key={line.id} className="px-8 py-5 flex items-center justify-between hover:bg-purple-50/60 transition">
                        <div className="font-semibold text-lg">{line.name}</div>
                        <div className="flex gap-3">
                          <button onClick={() => startEditLine(line)} className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                            Edit
                          </button>
                          <button onClick={() => deleteLine(line.id)} className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* ── STATION ─────────────────────────────────────────────────── */}
        {activeTab === 'station' && (
          <div className="space-y-10">

            <section className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
              <h2 className="text-2xl font-bold text-pink-700 mb-6">Manage Stations</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shopfloor</label>
                  <select
                    value={selectedShopfloorId}
                    onChange={e => setSelectedShopfloorId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Shopfloor...</option>
                    {shopfloors.map(sf => (
                      <option key={sf.id} value={sf.id}>{sf.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Line</label>
                  <select
                    value={selectedLineId}
                    onChange={e => {
                      setSelectedLineId(e.target.value);
                      setStationForm(prev => ({ ...prev, line: e.target.value }));
                    }}
                    disabled={!selectedShopfloorId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Line...</option>
                    {lines.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleStationSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Station Name</label>
                  <input
                    value={stationForm.name}
                    onChange={e => setStationForm({ ...stationForm, name: e.target.value })}
                    disabled={!selectedLineId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100"
                    placeholder="e.g. Station 01, Final Inspection"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!selectedLineId}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {editingStationId ? 'Update' : 'Create'}
                  </button>

                  {editingStationId && (
                    <button
                      type="button"
                      onClick={() => {
                        setStationForm({ name: '', line: selectedLineId });
                        setEditingStationId(null);
                      }}
                      className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {selectedLineId && (
              <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
                <div className="px-8 py-5 bg-pink-50 border-b border-pink-100">
                  <h3 className="text-xl font-bold text-pink-800">
                    Stations in {currentLine?.name || '—'}
                  </h3>
                </div>

                {stations.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No stations yet</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {stations.map(st => (
                      <div key={st.id} className="px-8 py-5 flex items-center justify-between hover:bg-pink-50/60 transition">
                        <div className="font-semibold text-lg">{st.name}</div>
                        <div className="flex gap-3">
                          <button onClick={() => startEditStation(st)} className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                            Edit
                          </button>
                          <button onClick={() => deleteStation(st.id)} className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Shopfloor Management • Built with React & Tailwind
        </footer>
      </div>
    </div>
  );
}