const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
        fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { 
            '@primary-color': '#546e7a',
            '@layout-header-background': '#263238'
        },
    }),
);