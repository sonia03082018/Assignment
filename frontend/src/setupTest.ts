/// <reference types = "jest" />
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

