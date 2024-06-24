import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';
import { amenityRegistry } from '@/common/routes/amenityRouter';
import { apartmentRegistry } from '@/common/routes/apartmentRouter';
import { authRegistry } from '@/common/routes/authRouter';
import { bookingRegistry } from '@/common/routes/bookingRouter';
import { imageRegistry } from '@/common/routes/imageRouter';
import { userRegistry } from '@/common/routes/userRouter';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    authRegistry,
    apartmentRegistry,
    amenityRegistry,
    bookingRegistry,
    imageRegistry,
  ]);

  registry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
    security: [{ BearerAuth: [] }],
  });
}
