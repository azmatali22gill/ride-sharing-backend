import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import "reflect-metadata";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: "*" });

  const port = process.env.PORT ?? 3010;
  await app.listen(port);
  console.log(`Ride-sharing backend running on http://localhost:${port}`);
  console.log(`WebSocket namespace: ws://localhost:${port}/realtime`);
}
bootstrap();
