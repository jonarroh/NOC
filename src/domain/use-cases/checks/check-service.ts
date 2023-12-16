interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly successCallback: SuccessCallback,
		private readonly errorCallback: ErrorCallback
	) {}

	async execute(url: string): Promise<boolean> {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(
					`HTTP error! status: ${response.status} on url: ${url}`
				);
			}
		} catch (error) {
			this.errorCallback(String(error));
			return false;
		}
		this.successCallback();

		return true;
	}
}
