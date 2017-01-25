import React from 'react';
import Link from '../link/link';
import './sidecar-style';

export default React.createClass({
  getInitialState() {
    return {open: false};
  },

  initChat() {
    this.chat = new window.gitter.Chat({
      room: 'angular-fullstack/generator-angular-fullstack',
      activationElement: '.js-gitter-toggle-chat-button',
      preload: true
    });
    // console.log(this.chat);

    document.addEventListener('gitter-sidecar-instance-started', chat => {
      // console.log('loaded', chat);
      this.chat = chat;
    });

    document.querySelector('.gitter-chat-embed').addEventListener('gitter-chat-toggle', e => {
      this.state.open = e.detail.state;
      // console.log(e.detail.state ? 'Chat Opened' : 'Chat Closed');
    });
  },

  componentDidMount() {
    // console.log('did mount');
    if(window.gitter && typeof window.gitter.Chat === 'function') {
      // console.log('already loaded');

      this.initChat();
    } else {
      // console.log('waiting');

      document.addEventListener('gitter-sidecar-ready', () => {
        // console.log('ready');

        this.initChat();
      });
    }
  },

  openChat() {
    this.state.open = true;
    this.chat.toggleChat(true);
  },

  render() {
    return (
      <aside className="sidecar">
        <Link className="sidecar__link sidecar__link--github" to="//github.com/angular-fullstack/generator-angular-fullstack">
          <span className="sidecar__label">Fork the Repo</span>
          <i className="sidecar__icon icon-github" />
        </Link>
        <a className="sidecar__link sidecar__link--gitter js-gitter-toggle-chat-button" onClick={ this.openChat }>
          <span className="sidecar__label">Find Help</span>
          <i className="sidecar__icon icon-gitter" />
        </a>
        <Link className="sidecar__link sidecar__link--so" to="//stackoverflow.com/questions/tagged/generator-angular-fullstack">
          <span className="sidecar__label">Stack Overflow</span>
          <i className="sidecar__icon icon-stack-overflow" />
        </Link>
      </aside>
    );
  }
});
