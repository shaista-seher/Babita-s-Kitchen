const {getDefaultConfig} = require('expo/metro-config');
const {withNativeWind} = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ignore transient npm temp folders like ".expo-image-xxxxx" that can be
// created and removed during installs, which otherwise crash Metro's watcher.
config.resolver.blockList = /node_modules[/\\]\.expo-[^/\\]+[/\\].*/;

/** @type {import('expo/metro-config').MetroConfig} */
const finalConfig = withNativeWind(config, {input: './global.css'});

module.exports = finalConfig;
