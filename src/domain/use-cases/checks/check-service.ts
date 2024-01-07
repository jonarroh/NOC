import {
	LogEntity,
	LogSeverityLevel
} from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
	batchExecute(urls: string[]): Promise<boolean[]>;
}

type SuccessCallback = () => void | undefined;
type ErrorCallback = (error: string) => void | undefined;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly logRepository: LogRepository,
		private readonly successCallback: SuccessCallback,
		private readonly errorCallback: ErrorCallback
	) {}
	async batchExecute(urls: string[]): Promise<boolean[]> {
		try {
			// Mapea cada URL a una Promesa que ejecuta la función `execute`
			const promises = urls.map(url => this.execute(url));

			// Espera a que todas las Promesas se resuelvan
			const results = await Promise.all(promises);

			// Verifica si todos los resultados son verdaderos (todas las peticiones fueron exitosas)
			const allSuccess = results.every(result => result);

			// Llama al callback correspondiente basado en el resultado
			if (allSuccess) {
				this.successCallback();
			} else {
				this.errorCallback('Some requests failed.');
			}

			return results;
		} catch (error) {
			// Manejo de errores generales
			this.errorCallback(String(error));
			return [];
		}
	}

	async execute(url: string): Promise<boolean> {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(
					`HTTP error! status: ${response.status} on url: ${url}`
				);
			}
		} catch (error) {
			this.logRepository.saveLog(
				new LogEntity({
					level: LogSeverityLevel.CRITICAL,
					message: `Error on url: ${url} because: ${error}`,
					origin: 'CheckService.ts'
				})
			);
			this.errorCallback && this.errorCallback(String(error));
			return false;
		}
		const log = new LogEntity({
			level: LogSeverityLevel.LOW,
			message: `Success on url: ${url}`,
			origin: 'CheckService.ts'
		});
		this.logRepository.saveLog(log);
		this.successCallback && this.successCallback();

		return true;
	}
}
