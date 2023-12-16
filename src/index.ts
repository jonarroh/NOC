import { Server } from './presentation/server';

(() => {
	main();
})();

function main(): void {
	Server.start();
}
