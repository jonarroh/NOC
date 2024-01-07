import { LogDataSource } from '../../domain/datasource/log.datasource';
import {
	LogEntity,
	LogSeverityLevel
} from '../../domain/entities/log.entity';

import fs from 'fs/promises';
import process from 'process';

export class FileSystemDataSource implements LogDataSource {
	public readonly logPath = `${process.cwd()}/logs`;
	public readonly lowLogPath = `${this.logPath}/low.log`;
	public readonly mediumLogPath = `${this.logPath}/medium.log`;
	public readonly highLogPath = `${this.logPath}/high.log`;
	private logPaths: Record<LogSeverityLevel, string>;

	constructor() {
		console.log('Creating logs folder');
		this.createLogsFiles();
		this.logPaths = {
			[LogSeverityLevel.LOW]: this.lowLogPath,
			[LogSeverityLevel.MEDIUM]: this.mediumLogPath,
			[LogSeverityLevel.HIGH]: this.highLogPath,
			[LogSeverityLevel.CRITICAL]: this.highLogPath
		};
	}
	private createLogsFiles = async () => {
		try {
			await fs.access(this.logPath);
		} catch (error) {
			console.log('Creating logs folder');
			await fs.mkdir(this.logPath, { recursive: true });
		}

		const pathsToCreate = [
			this.lowLogPath,
			this.mediumLogPath,
			this.highLogPath
		];
		for (const path of pathsToCreate) {
			try {
				await fs.access(path);
			} catch (error) {
				await fs.writeFile(path, '');
			}
		}
	};

	async saveLog(log: LogEntity): Promise<void> {
		const logAsJSON = `${JSON.stringify(log)}\n`;

		const logPath = this.logPaths[log.level];
		if (!logPath) {
			throw new Error('Invalid log level');
		}

		await fs.appendFile(logPath, logAsJSON);
	}
	public async getLogs(
		severityLevel: LogSeverityLevel
	): Promise<LogEntity[]> {
		const logPath = this.logPaths[severityLevel];
		if (!logPath) {
			throw new Error('Invalid log level');
		}

		const logs = await fs.readFile(logPath, 'utf-8');
		if (logs === '') {
			return [];
		}

		const logsAsJSON = logs.split('\n').map(log => {
			return LogEntity.fromJSON(log);
		});

		if (logsAsJSON[logsAsJSON.length - 1] === null) {
			logsAsJSON.pop();
		}

		return logsAsJSON as LogEntity[];
	}
}
