import app from './';<% if (filters.mongoose) { %>
import mongoose from 'mongoose';<% } %>

after(function(done) {
  app.angularFullstack.on('close', () => done());<% if (filters.mongoose) { %>
  mongoose.connection.close();<% } %>
  app.angularFullstack.close();
});
