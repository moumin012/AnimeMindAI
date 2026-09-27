import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';

// Firebase's Node test build expects these web primitives. Browsers provide them.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;
