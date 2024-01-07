import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { FileSystemDataSource } from '../infrastructure/datasources/file-system.datasource';

import { LogRepositoryImpl } from '../infrastructure/repository/log.impl.repository';

const fileSystemRepository = new LogRepositoryImpl(
	new FileSystemDataSource()
);

export class Server {
	public static start(): void {
		const job = CronService.createJob('*/5 * * * * *', () => {
			// new CheckService().execute('http://localhost:3000/profile');
			// const url = 'https://www.google.com';
			const url = 'http://localhost:3000/profile';
			new CheckService(
				fileSystemRepository,
				() => {
					console.log(`Success on url: ${url}`);
				},
				error => {
					console.log(`Error on url: ${url} because: ${error}`);
				}
			).execute(url);
		});
	}
}
