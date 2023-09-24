import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayloadWithRefreshToken } from "../types/jwt-payload-with-refresh-token.type";

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRefreshToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
