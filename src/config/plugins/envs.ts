import { from, logger } from 'env-var';

const env = from(Bun.env);

export const ENVS = {
	PORT: env.get('PORT').required().asString(),
	PROD: env.get('PROD').required().asBool(),
	MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
	MAILER_PASSWORD: env.get('MAILER_SECRET_KEY').required().asString(),
	MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString()
};
