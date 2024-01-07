import { createTransport } from 'nodemailer';
import { ENVS } from '../../config/plugins/envs';
import { LogRepository } from '../../domain/repository/log.repository';
import {
	LogEntity,
	LogSeverityLevel
} from '../../domain/entities/log.entity';

export interface EmailConfig {
	to: string | string[];
	subject: string;
	htmlBody: string;
	attachments?: Attachment[];
}

interface Attachment {
	filename: string;
	path: string;
}

export class EmailService {
	private readonly transporter = createTransport({
		service: ENVS.MAILER_SERVICE,
		auth: {
			user: ENVS.MAILER_EMAIL,
			pass: ENVS.MAILER_PASSWORD
		}
	});

	async sendEmail(emailConfig: EmailConfig): Promise<boolean> {
		const { to, subject, htmlBody, attachments = [] } = emailConfig;

		try {
			await this.transporter.sendMail({
				from: ENVS.MAILER_EMAIL,
				to,
				subject,
				html: htmlBody,
				attachments
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async sendEmailWithLogsAttachment(to: string | string[]) {
		const subject = 'Logs-Report';
		const htmlBody = '<h1>Logs Report</h1>';

		const attachments: Attachment[] = [
			{
				filename: 'high.log',
				path: 'logs/high.log'
			},
			{
				filename: 'low.log',
				path: 'logs/low.log'
			},
			{
				filename: 'medium.log',
				path: 'logs/medium.log'
			}
		];
		return await this.sendEmail({
			to,
			subject,
			htmlBody,
			attachments
		});
	}
}
