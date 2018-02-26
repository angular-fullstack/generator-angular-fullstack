import React from 'react';
import './contributors-style';

export default ({contributors}) => {
  if (!contributors.length) {
    return <noscript />;
  }

  return (
    <div className="contributors">
      <div className="contributors__list">
        {
          contributors.map(contributor => (
            <a key={ contributor }
              className="contributor"
              href={ `https://github.com/${contributor}` }>
              <img src={ `https://github.com/${contributor}.png?size=90` } />
              <span className="contributor__name"> {contributor}</span>
            </a>
          ))
        }
      </div>
    </div>
  );
};
