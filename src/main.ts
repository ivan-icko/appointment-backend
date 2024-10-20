import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv, getEnvArray } from './common/utils/string.util';
import { DEFAULT_FRONT_ORIGIN, DEFAULT_PORT } from './common/constants/global';
import dotenv from 'dotenv';
import process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENVIRONMENTS } from './common/enums/global';

dotenv.config();

const frontOriginFromEnv: string[] = getEnvArray('FRONT_APP_ORIGIN', [
  DEFAULT_FRONT_ORIGIN,
]);

const port: number = +getEnv('PORT', DEFAULT_PORT);
const appName: string = getEnv('APP_NAME', 'backend');
const docPath: string = getEnv('DOCS_PATH', 'docs');
const env = getEnv('NODE_ENV', ENVIRONMENTS.DEVELOPMENT);
const origins: RegExp[] = frontOriginFromEnv.map(
  (origin) => new RegExp(origin),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: origins,
    methods: ['PUT', 'GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['origin', 'content-type'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  });

  if (env === ENVIRONMENTS.DEVELOPMENT) {
    // swagger setup (path: http://$host:$port/docs)
    const swaggerOptions = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(`${appName} api`)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup(docPath, app, document);
  }

  await app.listen(port);
  console.log(
    `Server is up and running on port ${port} on node version ${process.version}`,
  );
}
bootstrap();
