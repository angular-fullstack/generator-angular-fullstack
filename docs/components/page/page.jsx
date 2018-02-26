import React from 'react';
import Interactive from 'antwar-interactive';
import Container from '../container/container';
import Sidebar from '../sidebar/sidebar';
import Sidecar from '../sidecar/sidecar';
import Contributors from '../contributors/contributors';
import './page-style';
import '../sidebar/sidebar-style';
import { trimEnd } from 'lodash';

export default ({ section, page }) => {
  let edit = page.edit || `https://github.com/angular-fullstack/generator-angular-fullstack/edit/master/docs/content/${trimEnd(page.url, '/')}${page.type === 'index' ? '/index' : ''}.md`;

  return (
    <Container className="page">
      <Sidecar />
      <Interactive
        id="components/sidebar/sidebar.jsx"
        component={Sidebar}
        sectionName={section.name}
        pages={section.pages().map(page => ({
          url: page.url,
          title: page.title,
          anchors: page.anchors
        }))}
        currentPage={ page.url.replace("/index", "") }
      />

      <section className="page__content">
        <h1>{ page.title }</h1>

        <a className="page__edit" href={ edit }>
          Edit this Page
          &nbsp;&nbsp;
          <i className="icon-edit" />
        </a>

        <div dangerouslySetInnerHTML={{ __html: page.content }} />


        <hr style={{ display: page.contributors.length ? 'block' : 'none' }} />
        <h3 style={{ display: page.contributors.length ? 'block' : 'none' }}>Contributors</h3>
        <Contributors contributors={ page.contributors } />
      </section>
    </Container>
  );
};
