import React, { PropTypes } from 'react';

export default class TextRotater extends React.PureComponent {

  constructor(props) {
    super(props);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.calculateContentHeight = this.calculateContentHeight.bind(this);

    this.state = {
      currentIndex: 0,
      contentHeight: 0,
    };
  }

  componentDidMount() {
    const { delay } = this.props;

    setTimeout(() => {
      this.calculateContentHeight();
    }, 50);

    setTimeout(() => {
      this.textRotatorWrap.classList.add('text-rotater--slide-up');
    }, delay);

    window.addEventListener('resize', this.calculateContentHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateContentHeight);
  }

  calculateContentHeight() {
    this.setState({
      contentHeight: this.content.clientHeight,
    });
  }

  handleTransitionEnd() {
    const { children, repeatDelay } = this.props;
    this.textRotatorWrap.classList.remove('text-rotater--slide-up');
    this.setState({
      currentIndex: (this.state.currentIndex + 1) % React.Children.count(children),
    }, () => {
      setTimeout(() => {
        this.textRotatorWrap.classList.add('text-rotater--slide-up');
      }, repeatDelay);
    });
  }

  render() {
    const { children, maxWidth } = this.props;
    const { currentIndex, contentHeight } = this.state;
    const childrenCount = React.Children.count(children);

    const currentChild = React.cloneElement(children[currentIndex], { ref: c => (this.content = c)});

    const nextChild = React.cloneElement(children[(currentIndex + 1) % childrenCount]);

    return (
      <div className="text-rotater">
        <div
          className="text-rotater__wrap"
          ref={ trw => (this.textRotatorWrap = trw) }
          onTransitionEnd={ this.handleTransitionEnd }
          style={ { height: contentHeight, width: maxWidth } }
        >
          { currentChild }
          { nextChild }
        </div>
      </div>
    );
  }
}

TextRotater.defaultProps = {
  delay: 0,
  repeatDelay: 3000,
};


TextRotater.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  delay: PropTypes.number,
  repeatDelay: PropTypes.number,
  // Needed to prevent jump when
  // rotating between texts of different widths
  maxWidth: PropTypes.number,
};

