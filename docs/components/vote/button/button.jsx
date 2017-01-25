import React, {Component} from 'react';

export default class NewButton extends Component {
  handleClick (n) {
    const {maxUp, maxDown, onVote} = this.props;
    onVote(Math.min(maxUp, Math.max(n, -maxDown)));
    return false;
  }

  titleText (n, maxUp, maxDown) {
    n = Math.min(maxUp, Math.max(n, -maxDown));
    if(n === 0)
      return "";
    return n > 0 ? "+" + n : "" + n;
  }

  makeTriangle (n, fn, size, minForEnabled, increase) {
    const {maxUp, maxDown, color} = this.props;
    const enabled = n !== 0 && (n > 0 ? (maxUp >= minForEnabled) : (maxDown >= minForEnabled));
    const className = "vote-new-button__upDown";

    if(enabled) {
      return <span
        title={this.titleText(n, maxUp, maxDown)}
        onClick={() => this.handleClick(n)}
        onMouseDown={() => this.startCounter(increase)}
        onMouseUp={() => this.stopCounter()}
        onMouseOut={() => this.stopCounter()}
        onTouchStart={() => this.startCounter(increase)}
        onTouchEnd={() => this.stopCounter()}
        onTouchCancel={() => this.stopCounter()}
        className={className}
      >
        {fn({size: size, color: color})}
      </span>;
    } else {
      return <span
        className={className}
      >
        {fn({size: size, color: "#eee"})}
      </span>;
    }
  }

  startCounter(increase) {
    let current = 0;
    let add = 0;
    const that = this;

      if (this.interval) {
          clearInterval(this.interval);
      }

    this.interval = setInterval(function() {
        // increase for 1 between 0 and 5
      if(current <= 5) {
          current++;
          add = 1;
      }
      // increase for 2 between 6 and 10
      else if(current <= 10) {
          current+=2;
          add = 2;
      }
      // increase for 5 between 11 and 40
      else if(current <= 40) {
          current+=5;
          add = 5;
      }
      // increase for 10 between 41 and 70
      else if(current <= 70) {
          current+=10;
          add = 10;
      }
      // increase for 15 after 71
      else {
          current+=15;
          add = 15;
      }

      if(!increase) {
          add *= -1;
      }

      that.handleClick(add);
    }, 200);
  }

  stopCounter() {
      if (this.interval) {
        clearInterval(this.interval);
      }
  }

  render() {
    const {color, className, value, myValue, isLoggedIn} = this.props;
    return isLoggedIn ? (<div className="vote-new-button" style={{color: color}}>
    <div className="vote-new-button__arrows">
      {this.makeTriangle(1, triangleUp, 10, 1, true)}
      {this.makeTriangle(-1, triangleDown, 10, 1, false)}
    </div>
    <div className="vote-new-button__value" title={value + " was voted in total by all users."}>
      <span className={className}>{value}</span>
    </div>
    <div className="vote-new-button__my-value" title={myValue + " was voted by you."}>
      (<span className={className}>{myValue}</span>)
    </div>
  </div>): (<div className="vote-new-button" style={{color: color}}>
    <div className="vote-new-button__logout-value" title={value + " was voted in total by all users."}>
      <span className={className}>{value}</span>
    </div>
  </div>);
  }
}

function triangleUp({color, size}) {
  let path = `m ${size},0 -${size},${size / 3 * 2} ${size*2},0 z`;
  return <svg width={size*2} height={size/3*2}>
    <path d={path} style={{
      fill: color
    }}/>
  </svg>;
}

function triangleDown({color, size}) {
  let path = `m ${size},${size / 3 * 2} ${size},-${size / 3 * 2} -${size*2},0 z`;
  return <svg width={size*2} height={size/3*2}>
    <path d={path} style={{
      fill: color
    }}/>
  </svg>;
}