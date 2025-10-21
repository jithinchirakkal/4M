

import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from '../../assets/logo.png';

type TrackingStatus = "noplan" | "nochange" | "change";

interface TrackingCell {
    id?: number;
    category_id: number;
    category?: { id: number; name: string };
    day: number;
    month: string;
    status: TrackingStatus;
}

interface ChangeDetail {
    date: string;
    time: string;
    mc_no: string;
    change_description: string;
    nature_of_change: string;
    action_taken: string;
    part_name_no: string;
    control_no: string;
    lot_no_batch_no: string;
    tracking_no_serial: string;
    retro_qty: string;
    retro_wh_no: string;
    retro_assy: string;
    retro_moog: string;
    retro_cust: string;
    retro_ott_pn: string;
    containment_assy: string;
    containment_ship: string;
    containment_lot_invoice: string;
    sl_op: string;
    sl_production: string;
    sl_plant_impl: string;
    material_details_1: string;
    material_details_2: string;
    remarks: string;
    id?: number;
}

const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1);

const categories = [
    { id: 1, name: "MAN" },
    { id: 2, name: "MACHINE" },
    { id: 3, name: "MATERIAL" },
    { id: 4, name: "METHOD" }
];

const emptyChangeDetail: ChangeDetail = {
    date: "",
    time: "",
    mc_no: "",
    change_description: "",
    nature_of_change: "",
    action_taken: "",
    part_name_no: "",
    control_no: "",
    lot_no_batch_no: "",
    tracking_no_serial: "",
    retro_qty: "",
    retro_wh_no: "",
    retro_assy: "",
    retro_moog: "",
    retro_cust: "",
    retro_ott_pn: "",
    containment_assy: "",
    containment_ship: "",
    containment_lot_invoice: "",
    sl_op: "",
    sl_production: "",
    sl_plant_impl: "",
    material_details_1: "",
    material_details_2: "",
    remarks: "",
};

export default function FourMChangeTrackSheet() {
    const [month, setMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    const [trackingMatrix, setTrackingMatrix] = useState<TrackingCell[][]>(
        categories.map(cat =>
            dayColumns.map(day => ({
                category_id: cat.id,
                day,
                month: `${month}-01`,
                status: "noplan",
            }))
        )
    );

    const [changeDetails, setChangeDetails] = useState<ChangeDetail[]>([
        { ...emptyChangeDetail },
        { ...emptyChangeDetail },
        { ...emptyChangeDetail },
    ]);

    useEffect(() => {
        axios
            .get<TrackingCell[]>("http://localhost:8000/api/trackings/", { params: { month: `${month}-01` } })
            .then(res => {
                const data = res.data;
                setTrackingMatrix(
                    categories.map(cat =>
                        dayColumns.map(day => {
                            const found = data.find(
                                (cell: TrackingCell) =>
                                    (cell.category?.id ?? cell.category_id) === cat.id && cell.day === day
                            );
                            return (
                                found
                                    ? {
                                        ...found,
                                        category_id: found.category?.id ?? found.category_id,
                                    }
                                    : {
                                        category_id: cat.id,
                                        day,
                                        month: `${month}-01`,
                                        status: "noplan",
                                    }
                            );
                        })
                    )
                );
            });
    }, [month]);

    const handleStatusChange = async (categoryIndex: number, dayIndex: number) => {
        const cell = trackingMatrix[categoryIndex][dayIndex];
        let newStatus: TrackingStatus =
            cell.status === "noplan"
                ? "nochange"
                : cell.status === "nochange"
                    ? "change"
                    : "noplan";
        let updatedCell: TrackingCell = { ...cell, status: newStatus };

        const newMatrix = trackingMatrix.map((row, i) =>
            i === categoryIndex
                ? row.map((c, j) => (j === dayIndex ? { ...updatedCell } : c))
                : row
        );
        setTrackingMatrix(newMatrix);

        const payload = {
            category_id: cell.category_id,
            day: cell.day,
            month: cell.month,
            status: newStatus,
        };

        try {
            if (cell.id) {
                await axios.put(
                    `http://localhost:8000/api/trackings/${cell.id}/`,
                    payload
                );
            } else {
                const res = await axios.post<TrackingCell>(
                    "http://localhost:8000/api/trackings/",
                    payload
                );
                const updatedMatrix = trackingMatrix.map((row, i) =>
                    i === categoryIndex
                        ? row.map((c, j) =>
                            j === dayIndex ? { ...updatedCell, id: res.data.id } : c
                        )
                        : row
                );
                setTrackingMatrix(updatedMatrix);
            }
        } catch (err: any) {
            alert(
                `Error for ${categories[categoryIndex].name} day ${cell.day}: ` +
                JSON.stringify(err.response?.data || err.message)
            );
        }
    };

    const getStatusBg = (status: TrackingStatus) =>
        status === "nochange"
            ? "bg-green-500"
            : status === "change"
                ? "bg-red-500"
                : "bg-blue-100";

    const handleChangeDetailInput = (
        rowIdx: number,
        field: keyof ChangeDetail,
        value: string
    ) => {
        const newDetails = [...changeDetails];
        newDetails[rowIdx] = { ...newDetails[rowIdx], [field]: value };
        setChangeDetails(newDetails);
    };

    const submitChangeDetails = async () => {
        for (let i = 0; i < changeDetails.length; i++) {
            const row = changeDetails[i];
            if (row.date && row.time) {
                try {
                    if (row.id) {
                        await axios.put(
                            `http://localhost:8000/api/change-details/${row.id}/`,
                            row
                        );
                    } else {
                        const res = await axios.post<ChangeDetail>(
                            "http://localhost:8000/api/change-details/",
                            row
                        );
                        changeDetails[i].id = res.data.id;
                    }
                } catch (err: any) {
                    alert(
                        `Error for row ${i + 1}: ` +
                        JSON.stringify(err.response?.data || err.message)
                    );
                }
            }
        }
        setChangeDetails([...changeDetails]);
        alert("Change details submitted!");
    };

    return (
        <div className="max-w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-2 md:px-8">
            <div className="max-w-full  shadow-2xl rounded-2xl bg-white p-6 md:p-10 border border-gray-200">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b-2 pb-4 mb-6">
                    <div className="">
                        <div className="w-104 h-200 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                            {/* <img
                                src={logo}
                                alt="Logo"
                                className="max-w-[80%] max-h-[80%] object-contain"
                            /> */}
                        </div>
                    </div>
                    <div className="max-w-full flex-1 ">
                        <h1 className="text-3xl text-center font-extrabold text-indigo-700 mb-1">4M CHANGE TRACKING SHEET</h1>
                        {/* <div className="text-lg text-center font-bold text-green-900 tracking-wide">NL TECHNOLOGIES</div> */}
                    </div>
                    {/* <div className="flex-1 flex flex-col items-end text-xs text-gray-600">
                        <div className="border-b border-gray-300 w-full py-1 px-2">Doc No.</div>
                        <div className="border-b border-gray-300 w-full py-1 px-2">Rev No.</div>
                        <div className="w-full py-1 px-2">Rev Date:</div>
                    </div> */}
                </div>

                {/* Tracking Matrix */}
                <div className="overflow-x-auto rounded-lg shadow-inner bg-white">
                    <table className="w-full border-collapse text-sm">
                        <thead className="sticky top-0 z-10 bg-indigo-50">
                            <tr className="text-center">
                                <th className="border border-gray-300 p-2 w-10" rowSpan={2}>No.</th>
                                <th className="border border-gray-300 p-2 w-28" rowSpan={2}>
                                    Category<br />of Change
                                </th>
                                <th colSpan={31} className="border border-gray-300 p-2">
                                    <span className="font-semibold">Month:</span>
                                    <input
                                        type="month"
                                        value={month}
                                        onChange={e => setMonth(e.target.value)}
                                        className="ml-2 border border-indigo-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300 transition"
                                    />
                                </th>
                                <th className="border border-gray-300 p-2 w-40" rowSpan={2}>Remarks</th>
                            </tr>
                            <tr className="text-center h-8">
                                {dayColumns.map(day => (
                                    <th key={day} className="border border-gray-300 p-0 w-6">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id} className="text-center h-12 hover:bg-indigo-50 transition">
                                    <td className="border border-gray-200 font-semibold">{category.id}</td>
                                    <td className="border border-gray-200 font-medium">{category.name}</td>
                                    {trackingMatrix[index] &&
                                        trackingMatrix[index].map((cell, dayIndex) => (
                                            <td key={dayIndex} className="border border-gray-200 p-0">
                                                <button
                                                    className={`w-7 h-7 rounded-full border-2 mx-auto transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400
                            ${getStatusBg(cell.status)}
                            ${cell.status === "change" ? "border-red-400" : cell.status === "nochange" ? "border-green-400" : "border-blue-200"}
                            hover:scale-110`}
                                                    onClick={() => handleStatusChange(index, dayIndex)}
                                                    aria-label={`Change status for ${category.name} day ${cell.day}`}
                                                ></button>
                                            </td>
                                        ))}
                                    <td className="border border-gray-200 text-left pl-2">
                                        {index === 0 && (
                                            <div className="font-medium text-gray-700">Legends:</div>
                                        )}
                                        {index === 1 && (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-5 h-5 rounded-full border border-green-600 bg-green-500"></span>
                                                <span className="text-gray-600">No Change</span>
                                            </div>
                                        )}
                                        {index === 2 && (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-5 h-5 rounded-full border border-red-600 bg-red-500"></span>
                                                <span className="text-gray-600">Change</span>
                                            </div>
                                        )}
                                        {index === 3 && (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-5 h-5 rounded-full border border-blue-400 bg-blue-100"></span>
                                                <span className="text-gray-600">No Plan</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4M Change Detail */}
                <div className="mt-10 mb-2">
                    <div className="w-full text-center font-bold text-lg p-2 border-t-2 border-b-2 border-indigo-300 bg-indigo-50 rounded-t-lg">
                        4M Change Detail
                    </div>
                    <div className="flex justify-end my-3">
                        <button
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
                            onClick={submitChangeDetails}
                        >
                            Submit Change Details
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg shadow-inner bg-white">
                        <table className="w-full border-collapse text-xs">
                            <thead className="bg-indigo-50 sticky top-0 z-10">
                                <tr className="text-center border border-gray-300">
                                    <th className="border border-gray-300 p-1" rowSpan={2}>Date</th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>Time</th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>M/C No.</th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>Change Description</th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>
                                        Nature of Change<br />
                                        (Part/Supplier & dimension)
                                    </th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>Action Taken</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>Part Name/No.</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>Control No.</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>Lot No./Batch No.</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>Tracking No./Serial</th>
                                    <th className="border border-gray-300 p-1" colSpan={6}>Retroactive</th>
                                    <th className="border border-gray-300 p-1" colSpan={2}>
                                        Containment<br />
                                        Suspected/
                                    </th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>SL/OP</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>SL Production</th>
                                    <th className="border border-gray-300 p-1 writing-vertical transform -rotate-90" rowSpan={2}>SL Plant Impl</th>
                                    <th className="border border-gray-300 p-1" colSpan={2}>Material Details</th>
                                    <th className="border border-gray-300 p-1" rowSpan={2}>Remarks</th>
                                </tr>
                                <tr className="text-center border border-gray-300">
                                    <th className="border border-gray-300 p-1">QTY</th>
                                    <th className="border border-gray-300 p-1">W/H No.</th>
                                    <th className="border border-gray-300 p-1">Assy</th>
                                    <th className="border border-gray-300 p-1">Moog</th>
                                    <th className="border border-gray-300 p-1">Cust</th>
                                    <th className="border border-gray-300 p-1">OTT P/N</th>
                                    <th className="border border-gray-300 p-1">Assy</th>
                                    <th className="border border-gray-300 p-1">Ship</th>
                                    <th className="border border-gray-300 p-1">
                                        Lot No.<br />
                                        /Invoice No.
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {changeDetails.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="h-12 hover:bg-indigo-50 transition">
                                        {Object.keys(emptyChangeDetail).map((col, colIdx) =>
                                            colIdx < 25 ? (
                                                <td key={col} className="border border-gray-200">
                                                    <input
                                                        type={col === "date" ? "date" : col === "time" ? "time" : "text"}
                                                        value={row[col as keyof ChangeDetail]}
                                                        onChange={e => handleChangeDetailInput(rowIdx, col as keyof ChangeDetail, e.target.value)}
                                                        className="w-full h-8 px-2 py-1 rounded border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-white transition"
                                                    />
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}