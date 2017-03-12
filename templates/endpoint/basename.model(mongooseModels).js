'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './<%= basename %>.events';

var <%= classedName %>Schema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(<%= classedName %>Schema);
export default mongoose.model('<%= classedName %>', <%= classedName %>Schema);
