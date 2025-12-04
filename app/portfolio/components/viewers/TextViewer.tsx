'use client';

import * as React from 'react';
import styles from '../../styles/terminal.module.scss';
import { FileNode } from '../../types';

interface TextViewerProps {
  file: FileNode;
  onClose: () => void;
}

const renderContent = (content: string): React.ReactNode => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`}>
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={index}>{line.slice(2)}</h1>);
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={index}>{line.slice(3)}</h2>);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index}>{line.slice(4)}</h3>);
      return;
    }

    if (line.startsWith('- ')) {
      elements.push(<li key={index}>{renderInline(line.slice(2))}</li>);
      return;
    }

    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<strong key={index}>{line.slice(2, -2)}</strong>);
      return;
    }

    if (line.trim() === '') {
      elements.push(<br key={index} />);
      return;
    }

    elements.push(<p key={index}>{renderInline(line)}</p>);
  });

  return elements;
};

const renderInline = (text: string): React.ReactNode => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => (
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  ));
};

const TextViewer: React.FC<TextViewerProps> = ({ file, onClose }) => {
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

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <span>{file.name}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            [esc]
          </button>
        </header>
        <div className={styles.modalContent}>
          {renderContent(file.content || '')}
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
