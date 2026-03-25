import React, { useState, useEffect } from "react";
import { D } from "./constants";
import { getAvailableSubstitutes, assignSubstitute } from "../HetmapShiftPlan/api_heatmap";
import type { ProcessColumn as Process, CellData } from "./heatmap.types";

interface SubstitutionModalProps {
    date: string;
    shift: string;
    station: Process;
    currentCell: CellData;
    onClose: () => void;
    onSave: () => void;
}

export function SubstitutionModal({ date, shift, station, currentCell, onClose, onSave }: SubstitutionModalProps) {
    const [available, setAvailable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmp, setSelectedEmp] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await getAvailableSubstitutes(date, shift, parseInt(station.id));
            setAvailable(res.data);
            setLoading(false);
        };
        load();
    }, [date, shift]);

    const handleSave = async () => {
        if (!selectedEmp) return;
        await assignSubstitute({
            date,
            shift,
            station_id: parseInt(station.id),
            emp_id: selectedEmp
        });
        onSave();
    };

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(10,24,40,0.8)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 24, width: "100%", maxWidth: 500,
                display: "flex", flexDirection: "column", overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                animation: "fadeUp 0.3s ease-out"
            }}>
                {/* Header */}
                <div style={{ background: D.purple, padding: "20px 24px", color: "#fff" }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>Assign Substitute</div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{station.full} · Shift {shift} · {date}</div>
                </div>

                {/* Content */}
                <div style={{ padding: 24, flex: 1, overflowY: "auto", maxHeight: "60vh" }}>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: D.g400, textTransform: "uppercase", marginBottom: 8 }}>Available Personnel</div>
                        {loading ? (
                            <div style={{ padding: 20, textAlign: "center", color: D.g400 }}>Loading available workers...</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {available.map(emp => (
                                    <div 
                                        key={emp.emp_id}
                                        onClick={() => setSelectedEmp(emp.emp_id)}
                                        style={{
                                            padding: 12, borderRadius: 12, border: `1.5px solid ${selectedEmp === emp.emp_id ? D.purple : D.border}`,
                                            background: selectedEmp === emp.emp_id ? "#f1f5f9" : "#fff",
                                            cursor: "pointer", transition: "all 0.2s",
                                            display: "flex", alignItems: "center", justifyContent: "space-between"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: D.g100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 14 }}>{emp.name}</div>
                                                <div style={{ fontSize: 11, color: D.g500 }}>ID: {emp.emp_id} · {emp.department}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: emp.level < 3 ? D.red : D.green }}>L{emp.level}</div>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: emp.isPresent ? D.green : D.red }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${D.border}`, display: "flex", gap: 12 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${D.border}`, background: "#fff", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={!selectedEmp}
                        style={{ 
                            flex: 1, padding: "12px", borderRadius: 12, border: "none", 
                            background: selectedEmp ? D.purple : D.g300, color: "#fff", fontWeight: 700, 
                            cursor: selectedEmp ? "pointer" : "not-allowed" 
                        }}
                    >
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
}
