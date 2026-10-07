import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-container">
        <div className="footer-clean-authors-row" style={{ justifyContent: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>
            BY <span className="footer-author-name">Devarsh Patel</span> and <span className="footer-author-name">Aman Kumar Yadav</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default PresenterFooter;
