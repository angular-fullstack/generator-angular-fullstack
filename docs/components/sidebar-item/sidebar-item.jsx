import React from 'react';
import Link from '../link/link';

export default class SidebarItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {
    let { index, url, title, anchors = [], currentPage } = this.props;

    let emptyMod = !anchors.length ? 'sidebar-item--empty' : '';
    let active = `/${currentPage}` === url;
    let openMod = (active || this.state.open) ? 'sidebar-item--open' : '';
    let anchorUrl = (active) ? '#' : url + '#';

    return (
      <div className={ `sidebar-item ${emptyMod} ${openMod}` }>
        <Link className="sidebar-item__title" to={ url }>{ title }</Link>
        <i className="sidebar-item__toggle icon-chevron-down" onClick={ this.toggle.bind(this) } />
        <ul className="sidebar-item__anchors">
          {
            anchors.map((anchor, j) => (
              <li className="sidebar-item__anchor" key={ `anchor-${index}-${j}` }>
                <a href={ anchorUrl + anchor.id }>{ anchor.title}</a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  toggle(e) {
    this.setState({
      open: !this.state.open
    });
  }
}