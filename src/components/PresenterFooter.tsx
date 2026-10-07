import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-authors-row" style={{ justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
          BY <span className="footer-author-name" style={{ color: '#ffffff', fontWeight: 600 }}>Devarsh Patel</span> and <span className="footer-author-name" style={{ color: '#ffffff', fontWeight: 600 }}>Aman Kumar Yadav</span>
        </span>
      </div>
    </footer>
  );
};

export default PresenterFooter;
