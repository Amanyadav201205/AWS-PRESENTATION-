import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-authors-row">
        <span className="footer-byline">
          <span className="footer-by-label">BY</span>
          <span className="highlight-author author-devarsh">Devarsh Patel</span>
          <span className="footer-ampersand">&amp;</span>
          <span className="highlight-author author-aman">Aman Kumar Yadav</span>
        </span>
      </div>
    </footer>
  );
};

export default PresenterFooter;
