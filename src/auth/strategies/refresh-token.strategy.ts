import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/jwt-payload.type";
import { JwtPayloadWithRefreshToken } from "../types/jwt-payload-with-refresh-token.type";
import { JWT_CONSTANTS } from "../constants";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONSTANTS.REFRESH_TOKEN_SECRET, // fix this
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req?.get("authorization")?.replace("Bearer", "")?.trim();

    if (!refreshToken) throw new ForbiddenException("Refresh token is not valid");

    return { ...payload, refreshToken };
  }
}
