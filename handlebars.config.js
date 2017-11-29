// module.exports = {
// 	raw: 'src/templates',
// 	compiled: 'client/templates',
// 	bundle: 'client/templates',
// 	bundleFilename: 'index.js',
// 	minify: true
// };

module.exports = {
  entry: {
    helpers: 'src/templates/helpers',
    partials: 'src/templates/partials',
    templates: 'src/templates/templates',
  },
  output: {
    path: 'client/templates',
    filename: 'index.js',
    minify: true,
  }
}
