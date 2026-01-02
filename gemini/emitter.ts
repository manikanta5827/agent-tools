import EventEmitter from "events";

export const myEmitter = new EventEmitter({ captureRejections: true });
