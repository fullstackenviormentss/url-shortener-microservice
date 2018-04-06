const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UrlSchema = new schema({
  original_url: {
    type: String,
    required: true},
  short_url: {
    type: String,
    required: true}
});

const User = mongoose.model('url', UrlSchema);
module.exports = User;