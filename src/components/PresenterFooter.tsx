import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-container">
        <div className="footer-clean-authors-row">
          <span className="footer-author-name">Devarsh Patel</span>
          <span className="footer-separator">&amp;</span>
          <span className="footer-author-name">Aman Kumar</span>
          <span className="footer-divider-bullet">•</span>
          <span className="footer-academic-meta">Cloud Architecture Capstone</span>
          <span className="footer-divider-bullet">•</span>
          <span className="footer-year">2026</span>
        </div>
        <div className="footer-clean-disclaimer">
          Independent educational architecture defense study. Not affiliated with Amazon Web Services, Inc.
        </div>
      </div>
    </footer>
  );
};

export default PresenterFooter;
