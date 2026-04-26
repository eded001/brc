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
          '@screens': './src/presentation',
          '@navigation': './src/app/navigation',
          '@debug': './src/presentation/debug',
          '@test': './src/presentation/debug/test',
          '@firebase-client': './src/libs/firebase',
        },
      },
    ],
  ],
};
