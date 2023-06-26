const {
  override,
  useBabelRc,
  // fixBabelImports
} = require("customize-cra");
module.exports = override(
  // fixBabelImports('import', {
  // 	libraryName: 'antd',
  // 	libraryDirectory: 'es',
  // 	style: 'css'
  // }),
  useBabelRc()
);