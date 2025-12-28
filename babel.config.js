module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src/shared',
          '@screens': './src/features',
          '@navigation': './src/app/navigation',
          '@test': './src/features/debug/test',
        },
      },
    ]
  ],
};
