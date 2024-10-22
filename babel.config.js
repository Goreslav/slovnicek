module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        targets: {
          ie: '11',
          browsers: [
            '> 1%',
            'last 2 versions',
            'not dead',
            'ie 11'
          ]
        }
      }
    ]
  ]
}
