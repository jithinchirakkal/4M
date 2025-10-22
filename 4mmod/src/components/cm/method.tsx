import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react";

interface FourMCategory {
  id?: number;
  category_type: string;
  description: string;
}

interface FourMAction {
  id?: number;
  category: number;
  action_taken: string;
  set_up_approval: boolean;
  retroactive_inspection: boolean;
  suspected_lot_check: boolean;
  remarks: string;
}

interface CombinedData extends FourMCategory {
  actions: FourMAction[];
}

export default function FourMMethodPage() {
  const [categories, setCategories] = useState<CombinedData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    category_type: "",
    description: "",
    action_taken: "",
    set_up_approval: false,
    retroactive_inspection: false,
    suspected_lot_check: false,
    remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, actionsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/4m-categories/"),
        fetch("http://127.0.0.1:8000/api/actions/"),
      ]);

      const categoriesData = await categoriesRes.json();
      const actionsData = await actionsRes.json();

      // Combine categories with their actions
      const combined = categoriesData.map((cat: FourMCategory) => ({
        ...cat,
        actions: actionsData.filter((action: FourMAction) => action.category === cat.id),
      }));

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

    if (!formData.category_type || !formData.description || !formData.action_taken) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      let categoryId: number;

      if (editingId) {
        // Update existing action
        const existingCategory = categories.find(cat => 
          cat.actions.some(action => action.id === editingId)
        );
        
        if (existingCategory) {
          categoryId = existingCategory.id!;
          
          // Update category if needed
          await fetch(`http://127.0.0.1:8000/api/4m-categories/${categoryId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category_type: formData.category_type,
              description: formData.description,
            }),
          });

          // Update action
          await fetch(`http://127.0.0.1:8000/api/actions/${editingId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: categoryId,
              action_taken: formData.action_taken,
              set_up_approval: formData.set_up_approval,
              retroactive_inspection: formData.retroactive_inspection,
              suspected_lot_check: formData.suspected_lot_check,
              remarks: formData.remarks,
            }),
          });
        }
      } else {
        // Check if category already exists
        const existingCategory = categories.find(
          (cat) =>
            cat.category_type === formData.category_type &&
            cat.description === formData.description
        );

        if (existingCategory) {
          categoryId = existingCategory.id!;
        } else {
          // Create new category
          const categoryRes = await fetch("http://127.0.0.1:8000/api/4m-categories/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category_type: formData.category_type,
              description: formData.description,
            }),
          });
          const categoryData = await categoryRes.json();
          categoryId = categoryData.id;
        }

        // Create new action
        await fetch("http://127.0.0.1:8000/api/actions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: categoryId,
            action_taken: formData.action_taken,
            set_up_approval: formData.set_up_approval,
            retroactive_inspection: formData.retroactive_inspection,
            suspected_lot_check: formData.suspected_lot_check,
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
      category_type: category.category_type,
      description: category.description,
      action_taken: action.action_taken,
      set_up_approval: action.set_up_approval,
      retroactive_inspection: action.retroactive_inspection,
      suspected_lot_check: action.suspected_lot_check,
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

      // Check if category has no more actions, then delete category
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
      category_type: "",
      description: "",
      action_taken: "",
      set_up_approval: false,
      retroactive_inspection: false,
      suspected_lot_check: false,
      remarks: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.category_type === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6 p-6">
          <h1 className="text-3xl font-bold">4M Method Configuration</h1>
          <p className="text-blue-100 mt-2">Manage categories, actions, and activities</p>
        </div>

        {/* Filter and Add Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
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
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel" : "Add New Method"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? "Edit Method" : "Add New Method"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Activities to be done</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="set_up_approval"
                      checked={formData.set_up_approval}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-gray-700">Set-Up Approval</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="retroactive_inspection"
                      checked={formData.retroactive_inspection}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-gray-700">Retroactive Inspection</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="suspected_lot_check"
                      checked={formData.suspected_lot_check}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-gray-700">Suspected Lot Check</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Enter remarks (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-indigo-700 font-semibold transition"
                >
                  <Save size={20} />
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                    S.No.
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                    Category Type
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                    Definition
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                    Action Taken
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700" colSpan={3}>
                    Activities to be done
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                    Remarks
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">
                    Set-Up Approval
                  </th>
                  <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">
                    Retroactive Inspection
                  </th>
                  <th className="border border-gray-300 p-2 text-center text-xs text-gray-600">
                    Suspected Lot Check
                  </th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No data available. Click "Add New Method" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.flatMap((category, catIndex) =>
                    category.actions.map((action, actIndex) => (
                      <tr
                        key={`${category.id}-${action.id}`}
                        className="hover:bg-indigo-50 transition"
                      >
                        <td className="border border-gray-200 p-3 text-center">
                          {catIndex + actIndex + 1}
                        </td>
                        <td className="border border-gray-200 p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            category.category_type === 'Planned' 
                              ? 'bg-blue-100 text-blue-800'
                              : category.category_type === 'Unplanned'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.category_type}
                          </span>
                        </td>
                        <td className="border border-gray-200 p-3">
                          {category.description}
                        </td>
                        <td className="border border-gray-200 p-3">
                          {action.action_taken}
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <span className={`font-semibold ${action.set_up_approval ? 'text-green-600' : 'text-red-600'}`}>
                            {action.set_up_approval ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <span className={`font-semibold ${action.retroactive_inspection ? 'text-green-600' : 'text-red-600'}`}>
                            {action.retroactive_inspection ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <span className={`font-semibold ${action.suspected_lot_check ? 'text-green-600' : 'text-red-600'}`}>
                            {action.suspected_lot_check ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="border border-gray-200 p-3">
                          {action.remarks || "-"}
                        </td>
                        <td className="border border-gray-200 p-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(category, action)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(action.id!, category.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
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
      </div>
    </div>
  );
}