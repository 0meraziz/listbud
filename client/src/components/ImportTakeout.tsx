import React, { useState } from 'react';
import { importService } from '../services/api';

const ImportTakeout: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; imported: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const importResult = await importService.importFromGoogleTakeout(file);
      setResult({
        success: importResult.success || true,
        imported: importResult.imported || 0,
        errors: importResult.errors || []
      });
    } catch (error: any) {
      setResult({
        success: false,
        imported: 0,
        errors: [error.response?.data?.error || 'Import failed']
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Import from Google Takeout</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            To import your Google Maps saved places:
          </p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Takeout</a></li>
            <li>Select "Maps (your places)" from the list</li>
            <li>Choose CSV format and download the archive</li>
            <li>Extract the archive and upload the CSV file from the "Saved Places" folder</li>
          </ol>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Google Takeout CSV file
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              Selected: {file.name}
            </span>
            <button
              onClick={handleImport}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Importing...' : 'Import'}
            </button>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.success ? (
              <div>
                <p className="font-semibold">Import successful!</p>
                <p>Imported {result.imported} places</p>
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Warnings:</p>
                    <ul className="text-sm list-disc list-inside">
                      {result.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-semibold">Import failed</p>
                <ul className="text-sm list-disc list-inside">
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportTakeout;
