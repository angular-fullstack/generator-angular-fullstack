import React from 'react';
import Interactive from 'antwar-interactive';
import Container from '../container/container';
import SplashViz from '../splash-viz/splash-viz';
import Support from '../support/support';
import './splash-style';
import '../splash-viz/splash-viz-style';
import '../cube/cube-style';
import '../text-rotater/text-rotater-style.scss';
import BigLogo from '../../assets/angular-fullstack-logo.svg';

export default props => {
  let { page } = props;

  return (
    <div className="splash">
      <div className="splash-logo">
        <img src={ BigLogo } />
      </div>

      <Container className="splash__section">
        <h1>{ page.title }</h1>
        <div dangerouslySetInnerHTML={{
          __html: page.content
        }} />
      </Container>

      <Container className="splash__section">
        <h1>Support the Team</h1>

        <p>Through contributions, donations, and sponsorship, you allow this project to thrive.</p>

        <h2>Sponsors</h2>
        <Support number={ 20 } type="sponsor" />

        <h2>Backers</h2>
        <Support number={ 100 } type="backer" />
      </Container>
    </div>
  );
};
