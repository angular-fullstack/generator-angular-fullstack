import app from './';<% if (filters.mongoose) { %>
import mongoose from 'mongoose';<% } %>

after(function() {
  return Promise.all([
    // Add any promises here for processes that need to be closed before the tests can finish
    <% if (filters.mongoose) { %>
    new Promise(resolve => {
      mongoose.connection.close(resolve);
    }),<% } %>
    new Promise(resolve => {
      app.angularFullstack.close(resolve);
    }),
    <%_ if(filters.ws) { -%>
    new Promise(resolve => {
      app.primus.end(resolve);
    }),<% } %>
  ]);
});
