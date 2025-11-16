import {read} from './lib';
document.body.innerHTML = read();
document.body.innerHTML += `Node version is: ${process.version}`;