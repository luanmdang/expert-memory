'use client';

import * as React from 'react';
import styles from '../../styles/terminal.module.scss';
import { FileNode } from '../../types';

interface PDFViewerProps {
  file: FileNode;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const pdfUrl = file.metadata?.url || '';

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${styles.pdfModal}`}>
        <header className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <span>{file.name}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <button
              className={styles.closeButton}
              onClick={handleDownload}
              style={{ borderRight: 'none' }}
            >
              [↓]
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              [×]
            </button>
          </div>
        </header>
        <div className={styles.modalContent} style={{ padding: 0, flex: 1 }}>
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'var(--theme-background)',
            }}
            title={file.name}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
