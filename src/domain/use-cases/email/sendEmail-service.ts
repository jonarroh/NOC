import {
	EmailConfig,
	EmailService
} from '../../../presentation/email/email.service';
import {
	LogEntity,
	LogSeverityLevel
} from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface SendLogEmailUseCase {
	execute: (to: string | string[]) => Promise<boolean>;
}

export class sendMailWithLogs implements SendLogEmailUseCase {
	constructor(
		private readonly logRepository: LogRepository,
		private readonly emailService: EmailService
	) {}

	async execute(to: string | string[]): Promise<boolean> {
		try {
			const send =
				await this.emailService.sendEmailWithLogsAttachment(to);
			if (!send) {
				throw new Error('Error sending email');
			}

			const log = new LogEntity({
				level: LogSeverityLevel.LOW,
				message: `Email sent to ${to}`,
				origin: 'sendEmail-service.ts'
			});
			this.logRepository.saveLog(log);

			return true;
		} catch (error) {
			const log = new LogEntity({
				level: LogSeverityLevel.CRITICAL,
				message: `Error sending email because: ${error}`,
				origin: 'sendEmail-service.ts'
			});
			this.logRepository.saveLog(log);
			return false;
		}
	}
}
