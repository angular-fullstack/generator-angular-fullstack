import { AdminComponent } from './admin.component';

<%_ if(filters.uirouter) { -%>
export const STATES = [{
  name: 'admin',
  url: '/admin',
  component: AdminComponent,
}];<% } %>
<%_ if(filters.ngroute) { -%><% } %>
