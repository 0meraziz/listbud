import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { importService } from '../services/api';
import { Button, Card, Stack } from './ui';

interface ImportTakeoutProps {
  onImportComplete?: () => void;
}

const ImportTakeout: React.FC<ImportTakeoutProps> = ({ onImportComplete }) => {
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

      // Auto-refresh the dashboard after successful import
      if (onImportComplete) {
        onImportComplete();
      }
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
    <Card padding="lg">
      <Stack spacing="lg">
        <h2 className="text-xl font-semibold text-gray-900">Import from Google Takeout</h2>

        <div>
          <p className="text-sm text-gray-600 mb-3">
            To import your Google Maps saved places:
          </p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google Takeout</a></li>
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
          <Card padding="md" className="bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Selected: {file.name}
              </span>
              <Button
                onClick={handleImport}
                disabled={isLoading}
                leftIcon={Upload}
                variant="primary"
                loading={isLoading}
              >
                {isLoading ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </Card>
        )}

        {result && (
          <Card
            padding="md"
            className={result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
          >
            {result.success ? (
              <div className="text-green-800">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p className="font-semibold">Import successful!</p>
                </div>
                <p>Imported {result.imported} places</p>
                {result.errors.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center mb-1">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <p className="font-medium">Warnings:</p>
                    </div>
                    <ul className="text-sm list-disc list-inside">
                      {result.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-800">
                <div className="flex items-center mb-2">
                  <XCircle className="h-5 w-5 mr-2" />
                  <p className="font-semibold">Import failed</p>
                </div>
                <ul className="text-sm list-disc list-inside">
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </Stack>
    </Card>
  );
};

export default ImportTakeout;
