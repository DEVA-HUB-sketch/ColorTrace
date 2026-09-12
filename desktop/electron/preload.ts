import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('colortrace', {
  appVersion: '0.1.0',
  platform: process.platform,
});
