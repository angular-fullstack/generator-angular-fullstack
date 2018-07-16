<% if(filters.ts) { %>export * from '../../server/config/environment/shared';<% } else { %>
// https://github.com/babel/babel/issues/2877
import * as shared from '../../server/config/environment/shared';

export const env = shared.env;
export const port = shared.port;
export const userRoles = shared.userRoles;<% } %>
