import { PLUGIN_NAME } from '../defines/constants';

const background1 = '#139140'
const background2 = '#6ec98e'
const textColor = '#e1eaeb'

export class Log {
    static log = (...args: any[]) => {
        console.log(`%c ${PLUGIN_NAME} %c`, `background: ${background1}; color: ${textColor};`, `background: transparent;`, ...args);
    };
    static warn = (...args: any[]) => {
        console.warn(`%c ${PLUGIN_NAME} %c`, `background: ${background1}; color: ${textColor};`, `background: transparent;`, ...args);
    };
    static error = (...args: any[]) => {
        console.error(`%c ${PLUGIN_NAME} %c`, `background: ${background1}; color: ${textColor};`, `background: transparent;`, ...args);
    };

    static logN = (name: string, ...args: any[]) => {
        console.log(`%c ${PLUGIN_NAME} %c ${name} %c`, `background: ${background1}; color: ${textColor};`, `background: ${background2}; color: black;`, 'background: transparent;', ...args);
    }
    static warnN = (name: string, ...args: any[]) => {
        console.warn(`%c ${PLUGIN_NAME} %c ${name} %c`, `background: ${background1}; color: ${textColor};`, `background: ${background2}; color: black;`, 'background: transparent;', ...args);
    }
    static errorN = (name: string, ...args: any[]) => {
        console.error(`%c ${PLUGIN_NAME} %c ${name} %c`, `background: ${background1}; color: ${textColor};`, `background: ${background2}; color: black;`, 'background: transparent;', ...args);
    }
}