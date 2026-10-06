declare module 'ws' {
  import { EventEmitter } from 'events';
  export default class WebSocket extends EventEmitter {
    constructor(address: string, options?: any);
    send(data: any): void;
    close(code?: number, reason?: string): void;
    on(event: string, listener: (...args: any[]) => void): this;
  }
}
