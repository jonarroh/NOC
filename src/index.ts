import { Server } from './presentation/server';
import { ENVS } from './config/plugins/envs';
import { EmailService } from './presentation/email/email.service';
import { LogRepositoryImpl } from './infrastructure/repository/log.impl.repository';
import { FileSystemDataSource } from './infrastructure/datasources/file-system.datasource';
import { sendMailWithLogs } from './domain/use-cases/email/sendEmail-service';

(() => {
	main();
})();

function main(): void {
	// console.log(ENVS.MAILER_EMAIL, ENVS.MAILER_PASSWORD);
	// Server.start();

	const sendEmail = new sendMailWithLogs(
		new LogRepositoryImpl(new FileSystemDataSource()),
		new EmailService()
	);

	sendEmail.execute(['jonarrodi99@gmail.com']);
}
