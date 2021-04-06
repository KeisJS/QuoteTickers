import { WebSocketApp } from '../../../utils';

export default function socketConnect(): Promise<WebSocketApp> {
  return new Promise<WebSocketApp>(resolve => {
    const ws = new WebSocket('wss://api.exchange.bitcoin.com/api/2/ws');
    
    ws.addEventListener('open', () => {
      resolve(ws);
    })
  })
}
