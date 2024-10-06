import React from 'react';
import { WebView } from 'react-native-webview';
const Map = () => {
  const mapUrl = "https://www.google.com/maps/d/u/0/embed?mid=1wwCHLNx0boMxqLPsISNsYNeyCWdWW1I&ehbc=2E312F";

  return (
    <WebView
      source={{ uri: mapUrl }}
      style={{ flex: 1 }}
    />
  );
};

export default Map;
