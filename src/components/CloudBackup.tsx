import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { CloudStorageService } from '../utils/cloudStorage';

export function CloudBackup() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);

  const cloudService = CloudStorageService.getInstance();

  useEffect(() => {
    loadLastBackupTime();
    
    // Enable auto backup
    cloudService.enableAutoBackup();
    setAutoBackupEnabled(true);
  }, []);

  const loadLastBackupTime = async () => {
    const time = await cloudService.getLastBackupTime();
    setLastBackup(time);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const success = await cloudService.backup();
      if (success) {
        await loadLastBackupTime();
        alert('✅ Backup completed successfully!');
      } else {
        alert('❌ Backup failed. Please try again.');
      }
    } catch (error) {
      alert('❌ Backup failed. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm('This will replace your current data with the backup. Continue?')) {
      return;
    }

    setIsRestoring(true);
    try {
      const success = await cloudService.restore();
      if (success) {
        alert('✅ Data restored successfully! Please refresh the page.');
        window.location.reload();
      } else {
        alert('❌ No backup found or restore failed.');
      }
    } catch (error) {
      alert('❌ Restore failed. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
          <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cloud Backup</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Secure your data in the cloud</p>
        </div>
      </div>

      {/* Backup Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Backup Status</span>
          {autoBackupEnabled ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Auto-backup enabled</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Manual backup only</span>
            </div>
          )}
        </div>
        
        {lastBackup ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last backup: {lastBackup.toLocaleDateString()} at {lastBackup.toLocaleTimeString()}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No backup found</p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleBackup}
          disabled={isBackingUp}
          className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isBackingUp ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Backing up...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Backup Now
            </>
          )}
        </button>

        <button
          onClick={handleRestore}
          disabled={isRestoring || !lastBackup}
          className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isRestoring ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Restoring...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Restore Data
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start">
          <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Cloud Backup Features:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Automatic daily backups of all your data</li>
              <li>Secure encryption and storage</li>
              <li>Cross-device synchronization</li>
              <li>Easy restore with one click</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}