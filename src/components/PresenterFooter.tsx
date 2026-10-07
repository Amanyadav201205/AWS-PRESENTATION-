import React from 'react';

export const PresenterFooter: React.FC = () => {
  return (
    <footer className="executive-footer-clean" role="contentinfo" aria-label="Architecture Capstone Authors">
      <div className="footer-clean-authors-row">
        <span className="footer-byline">
          BY{' '}
          <span className="highlight-author author-devarsh">Devarsh Patel</span>
          {' '}&amp;{' '}
          <span className="highlight-author author-aman">Aman Kumar Yadav</span>
        </span>
      </div>
    </footer>
  );
};

export default PresenterFooter;
