/**
 * AccessibilityTestPanel - Interactive testing panel for accessibility compliance
 * 
 * Features:
 * - Run automated accessibility tests
 * - Manual testing tools
 * - Real-time accessibility reporting
 * - Export test results
 * - Visual accessibility indicators
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import React, { useState, useEffect } from 'react';
import { AccessibilityTester, manualTesting, AccessibilityReport } from '../../utils/accessibilityTesting';
import { useAccessibility } from './AccessibilityProvider';
import AccessibleButton from './AccessibleButton';
import AccessibleModal from './AccessibleModal';
import { colors, spacing, typography, borderRadius } from '../../styles/design-system/tokens';

interface AccessibilityTestPanelProps {
  /** Whether the panel is visible */
  isVisible?: boolean;
  /** Container to test (defaults to document.body) */
  testContainer?: HTMLElement;
  /** Callback when tests complete */
  onTestComplete?: (report: AccessibilityReport) => void;
}

const AccessibilityTestPanel: React.FC<AccessibilityTestPanelProps> = ({
  isVisible = false,
  testContainer,
  onTestComplete,
}) => {
  const { settings, updateSettings, announce } = useAccessibility();
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [activeManualTest, setActiveManualTest] = useState<string | null>(null);
  const [manualTestCleanup, setManualTestCleanup] = useState<(() => void) | null>(null);
  
  // Run automated tests
  const runAutomatedTests = async () => {
    setIsRunning(true);
    announce('Starting accessibility tests', 'polite');
    
    try {
      const tester = new AccessibilityTester(testContainer);
      const testReport = await tester.runAllTests();
      
      setReport(testReport);
      setShowReport(true);
      onTestComplete?.(testReport);
      
      announce(`Accessibility tests completed. Score: ${testReport.overall.score}%`, 'polite');
    } catch (error) {
      console.error('Accessibility test error:', error);
      announce('Accessibility tests failed', 'assertive');
    } finally {
      setIsRunning(false);
    }
  };
  
  // Start manual test
  const startManualTest = (testType: string) => {
    // Clean up previous test
    if (manualTestCleanup) {
      manualTestCleanup();
      setManualTestCleanup(null);
    }
    
    let cleanup: (() => void) | undefined;
    
    switch (testType) {
      case 'keyboard':
        cleanup = manualTesting.testKeyboardNavigation();
        announce('Keyboard navigation test started. Use Tab to navigate.', 'polite');
        break;
      case 'screenReader':
        cleanup = manualTesting.testScreenReader();
        announce('Screen reader test started. Enable your screen reader.', 'polite');
        break;
      case 'contrast':
        manualTesting.testColorContrast();
        announce('Color contrast test started. Check the overlay.', 'polite');
        break;
      case 'textScaling':
        manualTesting.testTextScaling();
        announce('Text scaling test started. Use the control panel.', 'polite');
        break;
    }
    
    if (cleanup) {
      setActiveManualTest(testType);
      setManualTestCleanup(() => cleanup);
    }
  };
  
  // Stop manual test
  const stopManualTest = () => {
    if (manualTestCleanup) {
      manualTestCleanup();
      setManualTestCleanup(null);
    }
    setActiveManualTest(null);
    announce('Manual test stopped', 'polite');
  };
  
  // Export report
  const exportReport = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    announce('Accessibility report exported', 'polite');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (manualTestCleanup) {
        manualTestCleanup();
      }
    };
  }, [manualTestCleanup]);
  
  if (!isVisible) return null;
  
  const panelStyles = {
    position: 'fixed' as const,
    top: spacing[4],
    right: spacing[4],
    width: '320px',
    maxHeight: '80vh',
    backgroundColor: colors.semantic.background,
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: borderRadius.lg,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    zIndex: 1000,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  };
  
  const headerStyles = {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.gray[50],
  };
  
  const contentStyles = {
    padding: spacing[4],
    overflowY: 'auto' as const,
    flex: 1,
  };
  
  const sectionStyles = {
    marginBottom: spacing[6],
  };
  
  const buttonGroupStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[2],
  };
  
  return (
    <>
      <div style={panelStyles} role="region" aria-label="Accessibility Testing Panel">
        {/* Header */}
        <div style={headerStyles}>
          <h3 style={{ margin: 0, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Accessibility Testing
          </h3>
        </div>
        
        {/* Content */}
        <div style={contentStyles}>
          {/* Settings Section */}
          <div style={sectionStyles}>
            <h4 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
              Settings
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <input
                  type="checkbox"
                  checked={settings.prefersReducedMotion}
                  onChange={(e) => updateSettings({ prefersReducedMotion: e.target.checked })}
                />
                <span style={{ fontSize: typography.fontSize.sm }}>Reduced Motion</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <input
                  type="checkbox"
                  checked={settings.prefersHighContrast}
                  onChange={(e) => updateSettings({ prefersHighContrast: e.target.checked })}
                />
                <span style={{ fontSize: typography.fontSize.sm }}>High Contrast</span>
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Font Size Scale: {settings.fontSizeScale}x
                </span>
                <input
                  type="range"
                  min="0.8"
                  max="2"
                  step="0.1"
                  value={settings.fontSizeScale}
                  onChange={(e) => updateSettings({ fontSizeScale: parseFloat(e.target.value) })}
                />
              </label>
            </div>
          </div>
          
          {/* Automated Tests Section */}
          <div style={sectionStyles}>
            <h4 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
              Automated Tests
            </h4>
            
            <div style={buttonGroupStyles}>
              <AccessibleButton
                variant="primary"
                size="sm"
                loading={isRunning}
                onClick={runAutomatedTests}
                disabled={isRunning}
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </AccessibleButton>
              
              {report && (
                <AccessibleButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowReport(true)}
                >
                  View Report (Score: {report.overall.score}%)
                </AccessibleButton>
              )}
              
              {report && (
                <AccessibleButton
                  variant="tertiary"
                  size="sm"
                  onClick={exportReport}
                >
                  Export Report
                </AccessibleButton>
              )}
            </div>
          </div>
          
          {/* Manual Tests Section */}
          <div style={sectionStyles}>
            <h4 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
              Manual Tests
            </h4>
            
            <div style={buttonGroupStyles}>
              <AccessibleButton
                variant={activeManualTest === 'keyboard' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => activeManualTest === 'keyboard' ? stopManualTest() : startManualTest('keyboard')}
              >
                {activeManualTest === 'keyboard' ? 'Stop' : 'Test'} Keyboard Navigation
              </AccessibleButton>
              
              <AccessibleButton
                variant={activeManualTest === 'screenReader' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => activeManualTest === 'screenReader' ? stopManualTest() : startManualTest('screenReader')}
              >
                {activeManualTest === 'screenReader' ? 'Stop' : 'Test'} Screen Reader
              </AccessibleButton>
              
              <AccessibleButton
                variant="secondary"
                size="sm"
                onClick={() => startManualTest('contrast')}
              >
                Test Color Contrast
              </AccessibleButton>
              
              <AccessibleButton
                variant="secondary"
                size="sm"
                onClick={() => startManualTest('textScaling')}
              >
                Test Text Scaling
              </AccessibleButton>
            </div>
          </div>
          
          {/* Quick Stats */}
          {report && (
            <div style={sectionStyles}>
              <h4 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
                Quick Stats
              </h4>
              
              <div style={{ fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.relaxed }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                  <span>Overall Score:</span>
                  <span style={{ fontWeight: typography.fontWeight.semibold, color: report.overall.score >= 80 ? colors.success[600] : report.overall.score >= 60 ? colors.warning[600] : colors.error[600] }}>
                    {report.overall.score}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                  <span>Passed:</span>
                  <span style={{ color: colors.success[600] }}>{report.overall.passed}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                  <span>Failed:</span>
                  <span style={{ color: colors.error[600] }}>{report.overall.failed}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Warnings:</span>
                  <span style={{ color: colors.warning[600] }}>{report.overall.warnings}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Modal */}
      {report && (
        <AccessibleModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          title="Accessibility Test Report"
          size="lg"
        >
          <div style={{ fontSize: typography.fontSize.sm }}>
            {/* Overall Score */}
            <div style={{ marginBottom: spacing[6], textAlign: 'center' }}>
              <div style={{ 
                fontSize: typography.fontSize['3xl'], 
                fontWeight: typography.fontWeight.bold,
                color: report.overall.score >= 80 ? colors.success[600] : report.overall.score >= 60 ? colors.warning[600] : colors.error[600],
                marginBottom: spacing[2]
              }}>
                {report.overall.score}%
              </div>
              <div style={{ color: colors.gray[600] }}>
                Overall Accessibility Score
              </div>
            </div>
            
            {/* Summary */}
            <div style={{ marginBottom: spacing[6] }}>
              <h5 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Summary
              </h5>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[4] }}>
                {Object.entries(report.summary).map(([category, stats]) => (
                  <div key={category} style={{ 
                    padding: spacing[3], 
                    border: `1px solid ${colors.gray[200]}`, 
                    borderRadius: borderRadius.md 
                  }}>
                    <div style={{ fontWeight: typography.fontWeight.medium, marginBottom: spacing[2], textTransform: 'capitalize' }}>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      <div>Total: {stats.total}</div>
                      <div style={{ color: colors.success[600] }}>Passed: {stats.passed}</div>
                      <div style={{ color: colors.error[600] }}>Failed: {stats.failed}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <div style={{ marginBottom: spacing[6] }}>
                <h5 style={{ marginBottom: spacing[3], fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                  Recommendations
                </h5>
                
                <ul style={{ paddingLeft: spacing[4], margin: 0 }}>
                  {report.recommendations.map((recommendation, index) => (
                    <li key={index} style={{ marginBottom: spacing[2] }}>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Timestamp */}
            <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], textAlign: 'center' }}>
              Report generated: {new Date(report.timestamp).toLocaleString()}
            </div>
          </div>
        </AccessibleModal>
      )}
    </>
  );
};

export default AccessibilityTestPanel;