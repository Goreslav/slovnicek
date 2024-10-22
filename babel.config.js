module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        targets: {
          browsers: [
            '> 0.25%',
            'last 2 versions',
            'not dead',
            'ie 11',
            'safari >= 10'
          ]
        }
      }
    ]
  ]
}
