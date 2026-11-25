import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle, ArrowRight, Eye, RefreshCw, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useProducts } from '../../context/ProductContext';

export default function BulkUploadModal({ onClose, onSuccess }) {
  const { bulkImportProducts, totalCount } = useProducts();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'merge' | 'overwrite'
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [importedSuccessCount, setImportedSuccessCount] = useState(null);

  // Generate and download a sample Excel import template
  const handleDownloadSampleTemplate = () => {
    const sampleHeaders = [
      {
        "SKU": "NL-VASE-01",
        "Name": "Hammered Brass Floor Urn",
        "Category": "Vases & Bowls",
        "Description": "Large artisanal floor vase with hand-hammered indentations and brushed gold antique finish.",
        "Material": "Aluminium",
        "Secondary Material": "Brass Plating",
        "Finish": "Antique Brass",
        "Colour": "Gold",
        "Price USD": 45.00,
        "Price INR": 3744.00,
        "MOQ": 20,
        "Lead Time": 30,
        "Length": 30,
        "Width": 30,
        "Height": 75,
        "Dimension Unit": "cm",
        "Image URL": "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/36906fb6-7df7-5eac-ab36-b9fb1a3219aa/packshot-1791572488248.png"
      },
      {
        "SKU": "NL-PLT-02",
        "Name": "Ribbed Iron Tripod Planter",
        "Category": "Planters",
        "Description": "Modern indoor iron planter with ribbed corrugated wall and removable matte black tripod stand.",
        "Material": "Iron",
        "Secondary Material": "Steel Rod",
        "Finish": "Matte Black",
        "Colour": "Black",
        "Price USD": 18.50,
        "Price INR": 1539.00,
        "MOQ": 50,
        "Lead Time": 25,
        "Length": 25,
        "Width": 25,
        "Height": 55,
        "Dimension Unit": "cm",
        "Image URL": "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/dbb73e26-f675-5325-a7e4-381fab85e464/packshot-1791572535053.png"
      },
      {
        "SKU": "NL-TRAY-03",
        "Name": "Natural Mango Wood Serving Platter",
        "Category": "Trays",
        "Description": "Organic live-edge carved mango wood tray with antique brass handles.",
        "Material": "Mango Wood",
        "Secondary Material": "Brass Handles",
        "Finish": "Natural Oil",
        "Colour": "Brown",
        "Price USD": 22.00,
        "Price INR": 1830.00,
        "MOQ": 30,
        "Lead Time": 20,
        "Length": 45,
        "Width": 28,
        "Height": 6,
        "Dimension Unit": "cm",
        "Image URL": "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/e014ecbf-ef46-43ea-8978-bdffb9ec09eb/packshot.png"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product_Template");
    XLSX.writeFile(wb, "SAG_New_Look_Bulk_Upload_Template.xlsx");
  };

  // Parse Excel / CSV file using FileReader & XLSX
  const processFile = (uploadedFile) => {
    setErrorMsg('');
    setFile(uploadedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Take first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON objects
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (!rawJson || rawJson.length === 0) {
          setErrorMsg("The uploaded file does not contain any product rows. Please check the sheet and try again.");
          setIsProcessing(false);
          return;
        }

        // Detect column headers
        const cols = Object.keys(rawJson[0]);
        setColumns(cols);
        setParsedRows(rawJson);
        setIsProcessing(false);
      } catch (err) {
        console.error("Error parsing spreadsheet:", err);
        setErrorMsg("Failed to parse file. Please ensure it is a valid Excel (.xlsx, .xls) or CSV file.");
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error reading the selected file.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Perform bulk import
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      bulkImportProducts(parsedRows, importMode);
      setImportedSuccessCount(parsedRows.length);
      setIsProcessing(false);
      if (onSuccess) onSuccess(parsedRows.length);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-zinc-200">
        
        {/* Header */}
        <div className="p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bulk Product Upload</h3>
              <p className="text-xs text-zinc-400">
                Import and sync products directly into the live website catalog via Excel (.xlsx) or CSV
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {importedSuccessCount !== null ? (
          <div className="p-8 sm:p-12 text-center space-y-5 my-auto max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-extrabold text-zinc-900">Upload Complete!</h4>
              <p className="text-sm font-semibold text-emerald-700">
                {importedSuccessCount} products successfully imported.
              </p>
              <p className="text-xs text-zinc-500 pt-2 leading-relaxed">
                Your website now features <strong>{totalCount} total products</strong>. They are live immediately on the storefront, search, and category pages.
              </p>
            </div>

            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition shadow-md"
              >
                View in Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
            
            {/* Top Info & Download Template Bar */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Excel & CSV Importer</span>
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Supports columns: <code>SKU</code>, <code>Name</code>, <code>Category</code>, <code>Price USD</code>, <code>Dimensions</code>, <code>Material</code>, <code>Image URL</code>, etc.
                </p>
              </div>

              <button
                onClick={handleDownloadSampleTemplate}
                className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Sample Template (.xlsx)</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                    : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-zinc-500 mx-auto mb-4 border border-zinc-200">
                  <UploadCloud className="w-8 h-8 text-zinc-700" />
                </div>

                <h4 className="text-sm font-bold text-zinc-900">
                  Click to select file or drag & drop here
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports Microsoft Excel (.xlsx, .xls) and CSV files
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-xl shadow-sm hover:bg-zinc-800 transition">
                  Browse Computer
                </div>
              </div>
            ) : (
              /* File Selected & Preview Section */
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-2xl border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                      <p className="text-[11px] text-zinc-500">
                        {(file.size / 1024).toFixed(1)} KB · <strong>{parsedRows.length} products detected</strong> across {columns.length} columns
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFile(null);
                      setParsedRows([]);
                      setColumns([]);
                    }}
                    className="text-xs text-zinc-500 hover:text-red-600 font-semibold transition"
                  >
                    Change File
                  </button>
                </div>

                {/* Import Mode Radio Options */}
                <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-2">
                  <label className="text-xs font-bold text-zinc-900 block">
                    Select Import Mode:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className={`p-3 rounded-xl border cursor-pointer text-xs transition flex items-start gap-2 ${
                      importMode === 'append' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}>
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="mt-0.5"
                      />
                      <div>
                        <strong className="block">Append to Catalog</strong>
                        <span className={`text-[10px] ${importMode === 'append' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Add as new products alongside existing items
                        </span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-xs transition flex items-start gap-2 ${
                      importMode === 'merge' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}>
                      <input
                        type="radio"
                        name="importMode"
                        value="merge"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="mt-0.5"
                      />
                      <div>
                        <strong className="block">Update & Merge SKUs</strong>
                        <span className={`text-[10px] ${importMode === 'merge' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Update existing matching SKUs, append new ones
                        </span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-xs transition flex items-start gap-2 ${
                      importMode === 'overwrite' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}>
                      <input
                        type="radio"
                        name="importMode"
                        value="overwrite"
                        checked={importMode === 'overwrite'}
                        onChange={() => setImportMode('overwrite')}
                        className="mt-0.5"
                      />
                      <div>
                        <strong className="block">Replace Entire Catalog</strong>
                        <span className={`text-[10px] ${importMode === 'overwrite' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Replace catalog completely with this sheet
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Data Preview Table */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-800">
                      Previewing First {Math.min(5, parsedRows.length)} of {parsedRows.length} Products:
                    </span>
                    <span className="text-[11px] text-zinc-400">Scroll horizontally to inspect columns</span>
                  </div>

                  <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
                    <div className="overflow-x-auto max-h-56 custom-scrollbar">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-zinc-100 text-zinc-600 font-semibold border-b">
                          <tr>
                            <th className="p-2.5">#</th>
                            {columns.slice(0, 8).map(col => (
                              <th key={col} className="p-2.5 whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          {parsedRows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50">
                              <td className="p-2.5 text-zinc-400 font-bold">{idx + 1}</td>
                              {columns.slice(0, 8).map(col => (
                                <td key={col} className="p-2.5 whitespace-nowrap max-w-[160px] truncate text-zinc-700">
                                  {String(row[col] || '-')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmImport}
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Importing {parsedRows.length} Products…</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Confirm & Import {parsedRows.length} Products</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
