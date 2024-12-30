import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('development')
    .description('The application environment.'),
  PORT: Joi.number().default(3000).description('Port to listen on'),
  JWT_SECRET: Joi.string().required().description('JWT Secret'),
  JWT_EXPIRY: Joi.string().default('24h').description('JWT Expiry'),
  MONGO_URI: Joi.string().required().description('MongoDB URI'),
  AWS_BUCKET : Joi.string().required().description('AWS Bucket name'),
  AWS_REGION : Joi.string().required().description('AWS Bucket name'),
  AWS_SECRET_KEY : Joi.string().required().description('AWS Bucket name'),
  AWS_ACCESS_KEY : Joi.string().required().description('AWS Bucket name'),
  TWILIO_ACCOUNT_SID : Joi.string().required().description('Twilio Account SID'),
  TWILIO_AUTH_TOKEN : Joi.string().required().description('Twilio Auth Token'),
  // TWILIO_SERVICE_SID : Joi.string().required().description('Twilio Service SID'),
  REDIS_HOST:Joi.string(),
  REDIS_PORT:Joi.string(),
  REDIS_PASSWORD:Joi.string(),
  REDIS_URL:Joi.string().optional().description('Redis URL')
});



