import React, { useState } from 'react';
import { QrCode, Upload, X } from 'lucide-react';
import { PageHeader, ConfirmationModal } from '../../components/shared';

export const ScanQRPage: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Simulated QR code scanner
  const simulateScan = () => {
    const mockQRData = {
      machineId: 'MACH_' + Math.random().toString(36).substring(7).toUpperCase(),
      machineName: 'CNC Machine A',
      lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      nextMaintenanceDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };
    setScannedCode('QR_CODE_' + Date.now());
    setScannedData(mockQRData);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate QR code detection from uploaded image
      simulateScan();
    }
  };

  const handleProcessData = () => {
    if (scannedData) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    console.log('QR data processed:', scannedData);
    setShowConfirm(false);
    // Could navigate to maintenance page here
  };

  return (
    <div className="w-full p-6">
      <PageHeader title="Scan QR Code" subtitle="Scan machine QR codes to track maintenance and issues" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Scanner</h2>

          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-4">
            <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold mb-4">
              {scannedCode ? 'QR Code Detected!' : 'Ready to scan QR code'}
            </p>
            {scannedCode && (
              <p className="text-sm text-gray-500 mb-4">
                Code: {scannedCode}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={simulateScan}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Simulate Scan
            </button>

            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <div className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Image
              </div>
            </label>

            {scannedCode && (
              <button
                onClick={() => {
                  setScannedCode(null);
                  setScannedData(null);
                }}
                className="w-full bg-red-100 text-red-800 py-2 rounded-md hover:bg-red-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Scan
              </button>
            )}
          </div>
        </div>

        {/* Scanned Data Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Scanned Machine Information</h2>

          {scannedData ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Machine ID</p>
                <p className="font-bold text-gray-800">{scannedData.machineId}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Machine Name</p>
                <p className="font-bold text-gray-800">{scannedData.machineName}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Last Maintenance</p>
                <p className="font-bold text-gray-800">{scannedData.lastMaintenance}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Next Maintenance Due</p>
                <p className="font-bold text-gray-800">{scannedData.nextMaintenanceDue}</p>
              </div>

              <button
                onClick={handleProcessData}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold mt-6"
              >
                Process & Continue
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCode className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Scan a QR code to view machine information</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Process Scanned Data"
        message={`Process maintenance task for ${scannedData?.machineName}?`}
        type="confirm"
        confirmText="Continue"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
