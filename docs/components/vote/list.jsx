import React from 'react';
import Interactive from 'antwar-interactive';
import Container from '../container/container';
import VoteApp from './app';
import '../../styles';
import './list-style';
import './app-style';
import './influence-style';
import './button/button-style';

export default ({ section, page }) => {
  let arr = page.url.split('/');
  let name = arr[arr.length - 1];

  return (
    <Container className="vote-list">

      <section className="vote-list__content">
        <Interactive
          id="components/vote/app.jsx"
          component={ VoteApp }
          name={ name === 'vote' ? 'todo' : name }
        />
      </section>
    </Container>
  );
};
