import React from 'react';
import Link from '../link/link';

let initialTouchPosition = {};
let lastTouchPosition = {};

export default class SidebarMobile extends React.Component {
  constructor(props) {
    super(props);

    this._handleBodyClick = this._handleBodyClick.bind(this);
  }

  render() {
    return (
      <nav
        className="sidebar-mobile"
        ref={ ref => this.container = ref }
        onTouchStart={this._handleTouchStart.bind(this)}
        onTouchMove={this._handleTouchMove.bind(this)}
        onTouchEnd={this._handleTouchEnd.bind(this)}>

        <div
          className="sidebar-mobile__toggle"
          onTouchStart={this._handleTouchStart.bind(this)}
          onTouchMove={this._handleOpenerTouchMove.bind(this)}
          onTouchEnd={this._handleTouchEnd.bind(this)} />

        <div className="sidebar-mobile__content">
          <i
            className="sidebar-mobile__close icon-cross"
            onClick={ this._close.bind(this) } />

          { this._getSections() }
        </div>
      </nav>
    );
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this._handleBodyClick);
      window.addEventListener('touchstart', this._handleBodyClick);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this._handleBodyClick);
      window.removeEventListener('touchstart', this._handleBodyClick);
    }
  }

  /**
   * Get markup for each section
   *
   * @return {array} - Markup containing sections and links
   */
  _getSections() {
    let pathname = '';

    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    }

    return this.props.sections.map(section => {
      let active = pathname === section.url || pathname.includes(`/${section.url}`),
          absoluteUrl = `/${section.url}`;
      return (
        <div
          className={ `sidebar-mobile__section ${active ? 'sidebar-mobile__section--active' : ''}` }
          key={ absoluteUrl }>
          <Link
            className="sidebar-mobile__section-header"
            key={ absoluteUrl }
            to={ absoluteUrl }
            onClick={ this._close.bind(this) }>
            <h3>{ section.title }</h3>
          </Link>

          { this._getPages(section.pages) }
        </div>
      );
    });
  }

  /**
   * Retrieve markup for page links
   *
   * @param {array} pages - A list of page objects
   * @return {array} - Markup containing the page links
   */
  _getPages(pages) {
    let pathname = '';

    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    }

    return pages.map(page => {
      let url = `/${page.url}`,
        active = pathname === url || pathname.includes(`${url}/`);

      return (
        <Link
          key={ url }
          className={ `sidebar-mobile__page ${active ? 'sidebar-mobile__page--active' : ''}` }
          to={ url }
          onClick={ this._close.bind(this) }>
          { page.title }
        </Link>
      );
    });
  }

  /**
   * Handle clicks on content
   *
   * @param {object} e - Native click event
   */
  _handleBodyClick(e) {
    if (
      !e.target.classList.contains('icon-menu') &&
      !this.container.contains(e.target)
    ) {
      this._close();
    }
  }

  /**
   * Hide the sidebar
   *
   */
  _close() {
    this.container.classList.remove(
      'sidebar-mobile--visible'
    );
  }

  _open() {
    this.container.classList.add(
      'sidebar-mobile--visible'
    );
  }

  _handleTouchStart(e){
    initialTouchPosition.x = e.touches[0].pageX;
    initialTouchPosition.y = e.touches[0].pageY;

    // For instant transform along with the touch
    this.container.classList.add('no-delay');
  }

  _handleTouchMove(e){
    let xDiff = initialTouchPosition.x - e.touches[0].pageX;
    let yDiff = initialTouchPosition.y - e.touches[0].pageY;
    let factor = Math.abs(yDiff / xDiff);

    // Factor makes sure horizontal and vertical scroll dont take place together
    if (xDiff>0 && factor < 0.8) {
      e.preventDefault();
      this.container.style.transform = `translateX(-${xDiff}px)`;
      lastTouchPosition.x = e.touches[0].pageX;
      lastTouchPosition.y = e.touches[0].pageY;
    }
  }

  _handleOpenerTouchMove(e){
    let xDiff = e.touches[0].pageX - initialTouchPosition.x;
    let yDiff = initialTouchPosition.y - e.touches[0].pageY;
    let factor = Math.abs(yDiff / xDiff);

    // Factor makes sure horizontal and vertical scroll dont take place together
    if (xDiff > 0 && xDiff < 295 && factor < 0.8) {
      e.preventDefault();
      this.container.style.transform = `translateX(calc(-100% + ${xDiff}px))`;
      lastTouchPosition.x = e.touches[0].pageX;
      lastTouchPosition.y = e.touches[0].pageY;
    }
  }

  _handleTouchEnd(e){
    // Free up all the inline styling
    this.container.classList.remove('no-delay');
    this.container.style.transform = '';

    if (initialTouchPosition.x - lastTouchPosition.x > 100) {
      this._close();
    } else if (lastTouchPosition.x - initialTouchPosition.x > 100) {
      this._open();
    }
  }
}
