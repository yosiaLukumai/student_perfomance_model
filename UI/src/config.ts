const config = {
  IP_ADDRESS: import.meta.env.IP_ADDRESS || '172.20.10.2',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3400',
  PIPELINE_URL: 'http://localhost:3450',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3400',
  MAP_API_KEY: import.meta.env.VITE_MAP_API_KEY || '',
  MAP_STYLE: import.meta.env.VITE_MapStyleID
  // Add other configuration variables as needed
};

export default config;