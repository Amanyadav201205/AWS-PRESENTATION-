import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-authors-row">
        <span className="footer-capstone-label">AWS Well-Architected Capstone</span>
        <span className="footer-divider-bullet">·</span>
        <span className="highlight-author author-devarsh">Devarsh Patel</span>
        <span className="footer-divider-bullet">&amp;</span>
        <span className="highlight-author author-aman">Aman Kumar Yadav</span>
      </div>
    </footer>
  );
};

export default PresenterFooter;
