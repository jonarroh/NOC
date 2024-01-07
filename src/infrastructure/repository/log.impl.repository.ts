import {
	LogEntity,
	LogSeverityLevel
} from '../../domain/entities/log.entity';
import { LogRepository } from '../../domain/repository/log.repository';

export class LogRepositoryImpl extends LogRepository {
	constructor(private readonly logDataSource: LogRepository) {
		super();
	}

	public async saveLog(log: LogEntity): Promise<void> {
		return this.logDataSource.saveLog(log);
	}
	public async getLogs(
		severityLevel: LogSeverityLevel
	): Promise<LogEntity[]> {
		return this.logDataSource.getLogs(severityLevel);
	}
}
