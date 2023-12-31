import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: "*" });

  // For API versioning. its v1 except auth route
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix("v1", { exclude: ["auth"] });

  // For class validator. Enables payload whitelisting globally.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // OpenAPI Swagger Section
  const config = new DocumentBuilder()
    .setTitle("NestJs API")
    .setDescription("Docs")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", name: "AccessToken" }, "access-token")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", name: "RefreshToken" }, "refresh-token")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  // Serve on 3000
  await app.listen(3000);
}
bootstrap();
