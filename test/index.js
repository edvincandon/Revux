const testsContext = require.context('.', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

const revuxContext = require.context('../src', true, /\.js$/)
revuxContext.keys().forEach(revuxContext);
