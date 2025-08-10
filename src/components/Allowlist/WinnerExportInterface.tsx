'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Chip, Divider } from '@nextui-org/react';
import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, WinnerExportInterfaceProps, WinnerExportData, ExportFormat } from './types';

/**
 * WinnerExportInterface Component
 * 
 * Interface for exporting winner data in various formats (JSON, CSV)
 * with social media data and claim status information.
 */
const WinnerExportInterface: React.FC<WinnerExportInterfaceProps> = ({
  allowlistId,
  allowlist,
  onExport,
  className = ''
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<WinnerExportData | null>(null);

  const exportFormats = [
    {
      key: 'csv',
      label: 'CSV (Spreadsheet)',
      description: 'Comma-separated values for Excel/Google Sheets',
      icon: <TableCellsIcon className="w-4 h-4" />
    },
    {
      key: 'json',
      label: 'JSON (Data)',
      description: 'Structured data format for developers',
      icon: <DocumentTextIcon className="w-4 h-4" />
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch(`/api/allowlists/${allowlistId}/export-winners?format=${exportFormat}`);
      
      if (response.ok) {
        if (exportFormat === 'csv') {
          // Handle CSV download
          const csvData = await response.text();
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `allowlist-${allowlistId}-winners.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          const exportData: WinnerExportData = {
            format: 'csv',
            data: csvData,
            filename: `allowlist-${allowlistId}-winners.csv`,
            generatedAt: new Date().toISOString()
          };
          
          setLastExport(exportData);
          onExport?.(exportData);
        } else {
          // Handle JSON download
          const jsonData = await response.json();
          const blob = new Blob([JSON.stringify(jsonData.data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `allowlist-${allowlistId}-winners.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          const exportData: WinnerExportData = {
            format: 'json',
            data: jsonData.data,
            filename: `allowlist-${allowlistId}-winners.json`,
            generatedAt: new Date().toISOString()
          };
          
          setLastExport(exportData);
          onExport?.(exportData);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export winner data');
      }
    } catch (error) {
      console.error('Error exporting winner data:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    return exportFormats.find(f => f.key === format)?.icon;
  };

  const getFormatDescription = (format: ExportFormat) => {
    return exportFormats.find(f => f.key === format)?.description;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Winner Data</h3>
            <p className="text-sm text-gray-600">
              Download winner information with social media data and claim status
            </p>
          </div>
          <Chip color="primary" variant="flat">
            {allowlist.status === 'completed' ? 'Ready' : 'Pending'}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {allowlist.status !== 'completed' ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <ArrowDownTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Export Not Available</h4>
            <p className="text-sm text-gray-600">
              Winner data can only be exported after the allowlist is completed and winners are selected.
            </p>
          </div>
        ) : (
          <>
            {/* Format Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exportFormats.map((format) => (
                  <Card
                    key={format.key}
                    className={`cursor-pointer transition-all duration-200 ${
                      exportFormat === format.key
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    isPressable
                    onPress={() => setExportFormat(format.key as ExportFormat)}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          exportFormat === format.key
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {format.icon}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{format.label}</h5>
                          <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            {/* Export Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Contents</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Winner Information</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Winner position/rank</li>
                      <li>• Wallet address</li>
                      <li>• Selection date</li>
                      <li>• Claim status</li>
                      <li>• Claim date (if applicable)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Social Media Data</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Twitter username</li>
                      <li>• Discord username</li>
                      <li>• Telegram username</li>
                      <li>• Task completion status</li>
                      <li>• Verification timestamps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Export Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {exportFormat === 'csv' ? (
                  <span>Export as CSV file for spreadsheet applications</span>
                ) : (
                  <span>Export as JSON file for programmatic use</span>
                )}
              </div>

              <AccessibleButton
                color="primary"
                onPress={handleExport}
                isLoading={isExporting}
                startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
              >
                {isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
              </AccessibleButton>
            </div>

            {/* Last Export Info */}
            {lastExport && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-green-900">Export Completed</h5>
                    <p className="text-sm text-green-700 mt-1">
                      Winner data exported as {lastExport.format.toUpperCase()} on{' '}
                      {new Date(lastExport.generatedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      File: {lastExport.filename}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Export Guidelines</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Winner data is only available after allowlist completion</li>
                <li>• Social media usernames are provided when available</li>
                <li>• Claim status is updated in real-time</li>
                <li>• Export data for external NFT minting or distribution</li>
                <li>• Keep winner data secure and respect privacy</li>
              </ul>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default WinnerExportInterface;