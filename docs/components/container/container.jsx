import React from 'react';

export default (props = {}) => {
  let { className = '' } = props;

  return (
    <div className={ `container ${className}` }>
      { props.children }
    </div>
  );
};
