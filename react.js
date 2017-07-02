var decss = require('.')
var React = require('react')

module.exports = decss.bind(null, React.createElement.bind(React))
