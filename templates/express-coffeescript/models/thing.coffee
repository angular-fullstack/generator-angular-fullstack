'use strict'

mongoose = require 'mongoose'
Schema = mongoose.Schema
    
###
  Thing Schema
###
ThingSchema = new Schema
  name: String
  info: String
  awesomeness: Number

###
  Validations
###
ThingSchema.path('awesomeness').validate (num) ->
  num >= 1 && num <= 10;
, 'Awesomeness must be between 1 and 10'

mongoose.model 'Thing', ThingSchema
