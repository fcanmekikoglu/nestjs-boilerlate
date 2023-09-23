import { UserRole } from "src/user/user-role.enum";

export type JwtPayload = {
  sub: string;
  email: string;
  roles: UserRole[];
};
