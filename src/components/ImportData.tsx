import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface ImportDataProps {
  onImportComplete: () => void;
}

export function ImportData({ onImportComplete }: ImportDataProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          
          // Validate and import JSON data
          if (data.swimmingTimes && Array.isArray(data.swimmingTimes)) {
            const existingTimes = JSON.parse(localStorage.getItem('aquatrack-swimming-times') || '[]');
            const mergedTimes = [...existingTimes, ...data.swimmingTimes];
            localStorage.setItem('aquatrack-swimming-times', JSON.stringify(mergedTimes));
          }
          
          if (data.workouts && Array.isArray(data.workouts)) {
            const existingWorkouts = JSON.parse(localStorage.getItem('aquatrack-workouts') || '[]');
            const mergedWorkouts = [...existingWorkouts, ...data.workouts];
            localStorage.setItem('aquatrack-workouts', JSON.stringify(mergedWorkouts));
          }
          
          alert('Data imported successfully!');
          onImportComplete();
        } else {
          alert('Please select a valid JSON file');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-3 rounded-lg">
          <Upload className="w-6 h-6 text-green-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Restore from backup</p>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Select a JSON backup file to import your data
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Import Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Data will be merged with existing records</li>
              <li>Only JSON files exported from AquaTrack are supported</li>
              <li>Duplicate entries may be created if importing the same data multiple times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}