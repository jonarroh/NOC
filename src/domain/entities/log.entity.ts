export enum LogSeverityLevel {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	CRITICAL = 'CRITICAL'
}

export interface LogEntityOptions {
	level: LogSeverityLevel;
	message: string;
	origin: string;
	createdAt?: string;
}

export class LogEntity {
	public level: LogSeverityLevel;
	private message: string;
	private createdAt: string;
	public origin: string;

	constructor(options: LogEntityOptions) {
		const {
			level,
			message,
			origin,
			createdAt = new Date()
		} = options;
		this.level = level;
		this.message = message;
		this.createdAt = createdAt.toLocaleString();
		this.origin = origin;
	}

	public toString(): string {
		return `${this.createdAt} - ${this.level} - ${this.message}`;
	}

	static fromJSON(json: string): LogEntity | null {
		if (json === '') {
			return null;
		}
		const { level, message, createdAt, origin } = JSON.parse(json);
		const log = new LogEntity({
			level,
			message,
			origin,
			createdAt
		});
		return log;
	}
}
