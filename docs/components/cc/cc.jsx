import React from 'react';
import Link from '../link/link';
import './cc-style.scss';

const CC = () => {
  return (
    <Link to="https://creativecommons.org/licenses/by/4.0/" className="footer__license">
      <img
        alt="Creative Commons License"
        src="https://i.creativecommons.org/l/by/4.0/88x31.png"
      />
    </Link>
  );
};

export default CC;
