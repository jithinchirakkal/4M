
import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, Plus, X, Save, Settings, Factory } from "lucide-react";

// ==================== 4M TYPES ====================
interface FourMCategory {
  id?: number;
  four_m: string; 
  category_type: string;
  description: string;
}

interface FourMAction {
  id?: number;
  category: number;
  action_taken: string;
  change_record: boolean;
  identification_psn_batch_no: boolean;
  ojt: boolean;
  containment_action: boolean;
  machine_check_sheet: boolean; 
  in_process_sheet: boolean;
  approving_authority: string | null;
  customer_approval: boolean;
  set_up_approval: boolean;
  retroactive_inspection: boolean;
  suspected_lot_check: boolean;
  remarks: string;
}

interface CombinedData extends FourMCategory {
  actions: FourMAction[];
}

// ==================== STATION TYPES ====================
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
  shopfloor: number;
};

type Station = {
  id: number;
  name: string;
  line: number;
};

// ==================== STATION CONFIGURATION COMPONENT ====================
function StationConfiguration() {
  const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedShopfloorId, setSelectedShopfloorId] = useState<string>('');
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [sfForm, setSfForm] = useState({ name: '', sheet_type: 'PRODUCT' as Shopfloor['sheet_type'] });
  const [editingSfId, setEditingSfId] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState({ name: '', shopfloor: '' });
  const [editingLineId, setEditingLineId] = useState<number | null>(null);
  const [stationForm, setStationForm] = useState({ name: '', line: '' });
  const [editingStationId, setEditingStationId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'shopfloor' | 'line' | 'station'>('shopfloor');
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('http://127.0.0.1:8000/api/shopfloors/');
      const data = await response.json();
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
      const response = await fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${shopfloorId}`);
      const data = await response.json();
      setLines(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStations = async (lineId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/stations/?line=${lineId}`);
      const data = await response.json();
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShopfloorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sfForm.name.trim()) return alert('Name is required');

    try {
      const payload = { name: sfForm.name, sheet_type: sfForm.sheet_type };
      const url = editingSfId ? `http://127.0.0.1:8000/api/shopfloors/${editingSfId}/` : 'http://127.0.0.1:8000/api/shopfloors/';
      const method = editingSfId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSfForm({ name: '', sheet_type: 'PRODUCT' });
      setEditingSfId(null);
      loadShopfloors();
    } catch (err) {
      alert('Error saving shopfloor');
    }
  };

  const startEditShopfloor = (item: Shopfloor) => {
    setSfForm({ name: item.name, sheet_type: item.sheet_type });
    setEditingSfId(item.id);
  };

  const deleteShopfloor = async (id: number) => {
    if (!window.confirm('Delete this shopfloor and all related lines & stations?')) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/shopfloors/${id}/`, { method: 'DELETE' });
      loadShopfloors();
      if (Number(selectedShopfloorId) === id) setSelectedShopfloorId('');
    } catch {
      alert('Cannot delete (likely has dependencies)');
    }
  };

  const handleLineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineForm.name.trim()) return alert('Name is required');
    if (!selectedShopfloorId) return alert('Select a shopfloor first');

    try {
      const payload = { name: lineForm.name, shopfloor: Number(selectedShopfloorId) };
      const url = editingLineId ? `http://127.0.0.1:8000/api/lines/${editingLineId}/` : 'http://127.0.0.1:8000/api/lines/';
      const method = editingLineId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setLineForm({ name: '', shopfloor: '' });
      setEditingLineId(null);
      loadLines(Number(selectedShopfloorId));
    } catch (err) {
      alert('Error saving line');
    }
  };

  const startEditLine = (item: Line) => {
    setLineForm({ name: item.name, shopfloor: String(item.shopfloor) });
    setEditingLineId(item.id);
  };

  const deleteLine = async (id: number) => {
    if (!window.confirm('Delete this line and all stations?')) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/lines/${id}/`, { method: 'DELETE' });
      loadLines(Number(selectedShopfloorId));
      if (Number(selectedLineId) === id) setSelectedLineId('');
    } catch {
      alert('Cannot delete');
    }
  };

  const handleStationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationForm.name.trim()) return alert('Name is required');
    if (!selectedLineId) return alert('Select a line first');

    try {
      const payload = { name: stationForm.name, line: Number(selectedLineId) };
      const url = editingStationId ? `http://127.0.0.1:8000/api/stations/${editingStationId}/` : 'http://127.0.0.1:8000/api/stations/';
      const method = editingStationId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setStationForm({ name: '', line: '' });
      setEditingStationId(null);
      loadStations(Number(selectedLineId));
    } catch (err) {
      alert('Error saving station');
    }
  };

  const startEditStation = (item: Station) => {
    setStationForm({ name: item.name, line: String(item.line) });
    setEditingStationId(item.id);
  };

  const deleteStation = async (id: number) => {
    if (!window.confirm('Delete this station?')) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/stations/${id}/`, { method: 'DELETE' });
      loadStations(Number(selectedLineId));
    } catch {
      alert('Cannot delete');
    }
  };

  const currentShopfloor = useMemo(
    () => shopfloors.find(s => s.id === Number(selectedShopfloorId)),
    [shopfloors, selectedShopfloorId]
  );

  const currentLine = useMemo(
    () => lines.find(l => l.id === Number(selectedLineId)),
    [lines, selectedLineId]
  );

  return (
    <div className="pb-10">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {(['shopfloor', 'line', 'station'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
              activeTab === tab
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
            }`}
          >
            {tab === 'shopfloor' ? 'Shopfloors' : tab === 'line' ? 'Lines' : 'Stations'}
          </button>
        ))}
      </div>

      {activeTab === 'shopfloor' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">
              {editingSfId ? 'Edit Shopfloor' : 'New Shopfloor'}
            </h2>
            <form onSubmit={handleShopfloorSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={sfForm.name}
                  onChange={e => setSfForm({ ...sfForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Engine Assembly Area"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet Type</label>
                <select
                  value={sfForm.sheet_type}
                  onChange={e => setSfForm({ ...sfForm, sheet_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {Object.entries(SHEET_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition">
                  {editingSfId ? 'Update' : 'Create'}
                </button>
                {editingSfId && (
                  <button type="button" onClick={() => { setSfForm({ name: '', sheet_type: 'PRODUCT' }); setEditingSfId(null); }} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-800">Shopfloors</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : shopfloors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No shopfloors yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {shopfloors.map(sf => (
                  <div key={sf.id} className="px-6 py-4 flex items-center justify-between hover:bg-indigo-50/60 transition">
                    <div>
                      <div className="font-semibold">{sf.name}</div>
                      <div className="text-sm text-gray-600">{SHEET_TYPE_LABELS[sf.sheet_type]}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditShopfloor(sf)} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm transition">
                        Edit
                      </button>
                      <button onClick={() => deleteShopfloor(sf.id)} className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition">
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

      {activeTab === 'line' && (
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Manage Lines</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Shopfloor</label>
              <select
                value={selectedShopfloorId}
                onChange={e => { setSelectedShopfloorId(e.target.value); setLineForm(prev => ({ ...prev, shopfloor: e.target.value })); }}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Shopfloor...</option>
                {shopfloors.map(sf => (
                  <option key={sf.id} value={sf.id}>{sf.name}</option>
                ))}
              </select>
            </div>
            <form onSubmit={handleLineSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line Name</label>
                <input
                  value={lineForm.name}
                  onChange={e => setLineForm({ ...lineForm, name: e.target.value })}
                  disabled={!selectedShopfloorId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  placeholder="e.g. Main Line, Line 3"
                  required
                />
              </div>
              <div className="flex items-end gap-3">
                <button type="submit" disabled={!selectedShopfloorId} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:pointer-events-none">
                  {editingLineId ? 'Update' : 'Create'}
                </button>
                {editingLineId && (
                  <button type="button" onClick={() => { setLineForm({ name: '', shopfloor: selectedShopfloorId }); setEditingLineId(null); }} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {selectedShopfloorId && (
            <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
              <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                <h3 className="text-lg font-bold text-purple-800">Lines in {currentShopfloor?.name || '—'}</h3>
              </div>
              {lines.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No lines created yet</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {lines.map(line => (
                    <div key={line.id} className="px-6 py-4 flex items-center justify-between hover:bg-purple-50/60 transition">
                      <div className="font-semibold">{line.name}</div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditLine(line)} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                          Edit
                        </button>
                        <button onClick={() => deleteLine(line.id)} className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">
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

      {activeTab === 'station' && (
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
            <h2 className="text-xl font-bold text-pink-700 mb-4">Manage Stations</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shopfloor</label>
                <select
                  value={selectedShopfloorId}
                  onChange={e => setSelectedShopfloorId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
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
                  onChange={e => { setSelectedLineId(e.target.value); setStationForm(prev => ({ ...prev, line: e.target.value })); }}
                  disabled={!selectedShopfloorId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                >
                  <option value="">Select Line...</option>
                  {lines.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <form onSubmit={handleStationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                <input
                  value={stationForm.name}
                  onChange={e => setStationForm({ ...stationForm, name: e.target.value })}
                  disabled={!selectedLineId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  placeholder="e.g. Station 01, Final Inspection"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!selectedLineId} className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:pointer-events-none">
                  {editingStationId ? 'Update' : 'Create'}
                </button>
                {editingStationId && (
                  <button type="button" onClick={() => { setStationForm({ name: '', line: selectedLineId }); setEditingStationId(null); }} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {selectedLineId && (
            <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
              <div className="px-6 py-4 bg-pink-50 border-b border-pink-100">
                <h3 className="text-lg font-bold text-pink-800">Stations in {currentLine?.name || '—'}</h3>
              </div>
              {stations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No stations yet</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {stations.map(st => (
                    <div key={st.id} className="px-6 py-4 flex items-center justify-between hover:bg-pink-50/60 transition">
                      <div className="font-semibold">{st.name}</div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditStation(st)} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                          Edit
                        </button>
                        <button onClick={() => deleteStation(st.id)} className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">
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
    </div>
  );
}

// ==================== MAIN 4M METHOD PAGE ====================
export default function FourMMethodPage() {
  const [selectedModule, setSelectedModule] = useState<'4m-config' | 'station-settings'>('4m-config');
  const [categories, setCategories] = useState<CombinedData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selected4M, setSelected4M] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    four_m: "",
    category_type: "",
    description: "",
    action_taken: "",
    change_record: false,
    identification_psn_batch_no: false,
    ojt: false,
    containment_action: false,
    machine_check_sheet: false, // New
    in_process_sheet: false,
    set_up_approval: false,
    retroactive_inspection: false,
    suspected_lot_check: false,
    approving_authority: "",
    customer_approval: false,
    remarks: "",
  });

  useEffect(() => {
    if (selectedModule === '4m-config') {
      fetchData();
    }
  }, [selectedModule]);

  const fetchData = async () => {
    try {
      const [categoriesRes, actionsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/4m-categories/"),
        fetch("http://127.0.0.1:8000/api/actions/"),
      ]);

      const categoriesData = await categoriesRes.json();
      const actionsData = await actionsRes.json();

      const combined = categoriesData.map((cat: FourMCategory) => ({
        ...cat,
        actions: actionsData.filter((action: FourMAction) => action.category === cat.id),
      }));

      combined.sort((a: CombinedData, b: CombinedData) => {
        if (a.four_m !== b.four_m) {
          return a.four_m.localeCompare(b.four_m);
        }
        if (a.category_type !== b.category_type) {
          const order: { [key: string]: number } = { 'Planned': 1, 'Unplanned': 2, 'Abnormal': 3 };
          return order[a.category_type] - order[b.category_type];
        }
        return (a.id || 0) - (b.id || 0);
      });

      setCategories(combined);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.four_m || !formData.category_type || !formData.description || !formData.action_taken) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      let categoryId: number;

      if (editingId) {
        const existingCategory = categories.find(cat => 
          cat.actions.some(action => action.id === editingId)
        );
        
        if (existingCategory) {
          categoryId = existingCategory.id!;
          
          await fetch(`http://127.0.0.1:8000/api/4m-categories/${categoryId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              four_m: formData.four_m, 
              category_type: formData.category_type,
              description: formData.description,
            }),
          });

          await fetch(`http://127.0.0.1:8000/api/actions/${editingId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: categoryId,
              action_taken: formData.action_taken,
              change_record: formData.change_record,
              identification_psn_batch_no: formData.identification_psn_batch_no,
              ojt: formData.ojt,
              containment_action: formData.containment_action,
              machine_check_sheet: formData.machine_check_sheet,
              in_process_sheet: formData.in_process_sheet,
             
              set_up_approval: formData.set_up_approval,
              retroactive_inspection: formData.retroactive_inspection,
              suspected_lot_check: formData.suspected_lot_check,
              customer_approval: formData.customer_approval,
              approving_authority: formData.approving_authority || null,
              remarks: formData.remarks,
            }),
          });
        }
      } else {
        const existingCategory = categories.find(
          (cat) =>
            cat.category_type === formData.category_type &&
            cat.description === formData.description
        );

        if (existingCategory) {
          categoryId = existingCategory.id!;
        } else {
          const categoryRes = await fetch("http://127.0.0.1:8000/api/4m-categories/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              four_m: formData.four_m, 
              category_type: formData.category_type,
              description: formData.description,
            }),
          });
          const categoryData = await categoryRes.json();
          categoryId = categoryData.id;
        }

        await fetch("http://127.0.0.1:8000/api/actions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: categoryId,
            action_taken: formData.action_taken,
            change_record: formData.change_record,
            identification_psn_batch_no: formData.identification_psn_batch_no,
            ojt: formData.ojt,
            containment_action: formData.containment_action,
            machine_check_sheet: formData.machine_check_sheet,
            in_process_sheet: formData.in_process_sheet,
            set_up_approval: formData.set_up_approval,
            retroactive_inspection: formData.retroactive_inspection,
            suspected_lot_check: formData.suspected_lot_check,
            approving_authority: formData.approving_authority || null,
            customer_approval: formData.customer_approval,
            remarks: formData.remarks,
          }),
        });
      }

      alert(editingId ? "Updated successfully!" : "Added successfully!");
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data");
    }
  };

  const handleEdit = (category: CombinedData, action: FourMAction) => {
    setFormData({
      four_m: category.four_m, 
      category_type: category.category_type,
      description: category.description,
      action_taken: action.action_taken,
      change_record: action.change_record,
      identification_psn_batch_no: action.identification_psn_batch_no,
      ojt: action.ojt,
      containment_action: action.containment_action,
      set_up_approval: action.set_up_approval,
      retroactive_inspection: action.retroactive_inspection,
      suspected_lot_check: action.suspected_lot_check,
      machine_check_sheet: action.machine_check_sheet, 
      in_process_sheet: action.in_process_sheet,
      approving_authority: action.approving_authority || "",
      customer_approval: action.customer_approval,
      remarks: action.remarks || "",
    });
    setEditingId(action.id!);
    setShowForm(true);
  };

  const handleDelete = async (actionId: number, categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this action?")) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/actions/${actionId}/`, {
        method: "DELETE",
      });

      const category = categories.find(cat => cat.id === categoryId);
      if (category && category.actions.length === 1) {
        await fetch(`http://127.0.0.1:8000/api/4m-categories/${categoryId}/`, {
          method: "DELETE",
        });
      }

      alert("Deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data");
    }
  };

  const resetForm = () => {
    setFormData({
      four_m: "",  
      category_type: "",
      description: "",
      action_taken: "",
      change_record: false,
      identification_psn_batch_no: false,
      ojt: false,
      containment_action: false,
      set_up_approval: false,
      retroactive_inspection: false,
      suspected_lot_check: false,
      machine_check_sheet: false,
      in_process_sheet: false,
      approving_authority: "",
      customer_approval: false,
      remarks: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesCategory = selectedCategory ? cat.category_type === selectedCategory : true;
    const matches4M = selected4M ? cat.four_m === selected4M : true;
    return matchesCategory && matches4M;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header with Module Switcher */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6 p-6">
          <h1 className="text-3xl font-bold">Quality System Configuration</h1>
          <p className="text-blue-100 mt-2">Manage 4M methods and station settings</p>
          
          {/* Module Toggle Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setSelectedModule('4m-config')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedModule === '4m-config'
                  ? 'bg-white text-indigo-600 shadow-lg scale-105'
                  : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
              }`}
            >
              <Settings size={20} />
              4M Configuration
            </button>
            <button
              onClick={() => setSelectedModule('station-settings')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedModule === 'station-settings'
                  ? 'bg-white text-indigo-600 shadow-lg scale-105'
                  : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
              }`}
            >
              <Factory size={20} />
              Station Settings
            </button>
          </div>
        </div>

        {/* Conditional Content Rendering */}
        {selectedModule === '4m-config' && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <label className="font-semibold text-gray-700">Filter by 4M:</label>
                    <select
                      value={selected4M}
                      onChange={(e) => setSelected4M(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    >
                      <option value="">All 4M Types</option>
                      <option value="Man">Man</option>
                      <option value="Machine/Tool">Machine/Tool</option>
                      <option value="Material">Material</option>
                      <option value="Method">Method</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="font-semibold text-gray-700">Filter by Category:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    >
                      <option value="">All Categories</option>
                      <option value="Planned">Planned</option>
                      <option value="Unplanned">Unplanned</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
                >
                  {showForm ? <X size={20} /> : <Plus size={20} />}
                  {showForm ? "Cancel" : "Add New"}
                </button>
              </div>
            </div>

            {showForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingId ? "Edit Method" : "Add New"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      4M Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="four_m"
                      value={formData.four_m}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="">Select 4M</option>
                      <option value="Man">Man</option>
                      <option value="Machine/Tool">Machine/Tool</option>
                      <option value="Material">Material</option>
                      <option value="Method">Method</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category_type"
                        value={formData.category_type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Category</option>
                        <option value="Planned">Planned</option>
                        <option value="Unplanned">Unplanned</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Definition/Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter definition"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Action Taken <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="action_taken"
                      value={formData.action_taken}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Enter action taken"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Activities to be done</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="change_record" checked={formData.change_record} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Change Record</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="identification_psn_batch_no" checked={formData.identification_psn_batch_no} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Identification PSN / Batch No.</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="ojt" checked={formData.ojt} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">OJT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="set_up_approval" checked={formData.set_up_approval} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Set-Up Approval</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="retroactive_inspection" checked={formData.retroactive_inspection} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Retroactive Inspection</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="containment_action" checked={formData.containment_action} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Containment Action</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="suspected_lot_check" checked={formData.suspected_lot_check} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Suspected Lot Check</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="customer_approval" checked={formData.customer_approval} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">Customer Approval</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="machine_check_sheet" 
                          checked={formData.machine_check_sheet} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 text-indigo-600 rounded" 
                        />
                        <span className="text-sm text-gray-700">Machine Check Sheet</span>
                      </label>

                      {/* <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="in_process_sheet" 
                          checked={formData.in_process_sheet} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 text-indigo-600 rounded" 
                        />
                        <span className="text-sm text-gray-700">In-Process Sheet</span>
                      </label> */}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Approving Authority</label>
                    <input
                      type="text"
                      name="approving_authority"
                      value={formData.approving_authority}
                      onChange={handleInputChange}
                      placeholder="Enter approving authority"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Enter remarks (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
                      Cancel
                    </button>
                    <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-indigo-700 font-semibold">
                      <Save size={20} />
                      {editingId ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">S.No.</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">4M</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Category Type</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Definition</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Action Taken</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700" colSpan={8}>Activities to be done</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Remarks</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">Actions</th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Change Record</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Identification PSN / Batch No.</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">OJT</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Set-Up Approval</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Retroactive Inspection</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Containment Action</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Customer Approval</th>
                      <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">Approving Authority</th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="text-center py-8 text-gray-500">
                          No data available. Click "Add New" to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.flatMap((category, catIdx) =>
                        category.actions.map((action, actIdx) => (
                          <tr key={`${category.id}-${action.id}`} className="hover:bg-indigo-50 transition">
                            <td className="border border-gray-200 p-3 text-center">
                              {filteredCategories.slice(0, catIdx).reduce((sum, c) => sum + c.actions.length, 0) + actIdx + 1}
                            </td>
                            <td className="border border-gray-200 p-3 text-center font-semibold">{category.four_m}</td>
                            <td className="border border-gray-200 p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                category.category_type === "Planned" ? "bg-blue-100 text-blue-800" :
                                category.category_type === "Unplanned" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {category.category_type}
                              </span>
                            </td>
                            <td className="border border-gray-200 p-3">{category.description}</td>
                            <td className="border border-gray-200 p-3">{action.action_taken}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.change_record ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.identification_psn_batch_no ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.ojt ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.set_up_approval ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.retroactive_inspection ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.containment_action ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.machine_check_sheet ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.in_process_sheet ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3 text-center">{action.customer_approval ? "Yes" : "No"}</td>
                            <td className="border border-gray-200 p-3">{action.approving_authority || "-"}</td>
                            <td className="border border-gray-200 p-3">{action.remarks || "-"}</td>
                            <td className="border border-gray-200 p-3">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(category, action)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                  <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(action.id!, category.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedModule === 'station-settings' && <StationConfiguration />}
      </div>
    </div>
  );
}