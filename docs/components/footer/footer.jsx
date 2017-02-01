import React from 'react';
import CC from '../cc/cc';
import Link from '../link/link';
import Container from '../container/container';
import Icon from '../../assets/logo-small.svg';
import './footer-style';

export default (props) => {
  return (
    <div className="footer">
      <Container className="footer__inner">
        <section className="footer__left">
          <Link className="footer__link" to="/get-started">Get Started</Link>
          <Link className="footer__link" to="https://github.com/angular-fullstack">Organization</Link>
          <Link className="footer__link" to="https://github.com/angular-fullstack/generator-angular-fullstack/blob/master/contributing.md">Contribute</Link>
        </section>

        <section className="footer__middle">
          <Link to="/" className="footer__icon">
            <img src={ Icon } />
          </Link>
        </section>

        <section className="footer__right">
          <Link className="footer__link" to="https://gitter.im/angular-fullstack/generator-angular-fullstack">Support</Link>
          <Link className="footer__link" to="https://github.com/angular-fullstack/generator-angular-fullstack/releases">Changelog</Link>
        </section>
      </Container>
    </div>
  );
};
