'use strict';

import mongoose from 'mongoose';

var <%= classedName %>Schema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('<%= classedName %>', <%= classedName %>Schema);
