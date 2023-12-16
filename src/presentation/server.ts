import { CronJob } from 'cron';
import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';

export class Server {
	public static start(): void {
		const job = CronService.createJob('*/5 * * * * *', () => {
			// new CheckService().execute('http://localhost:3000/profile');
			const url = 'https://www.google.com';
			new CheckService(
				() => console.log(`Success on url: ${url}`),
				error => console.log(error)
			).execute(url);
		});
	}
}
