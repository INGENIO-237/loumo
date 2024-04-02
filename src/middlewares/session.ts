import { NextFunction, Request, Response } from "express";
import { reIssueAccessToken, verifyJwt } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import HTTP from "../constants/http.responses";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, "") ?? "";
  const refreshToken = req.headers["x-refresh"] ?? "";

  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    const { user } = decoded as JwtPayload;

    res.locals.user = user;

    return next();
  }

  if (expired && refreshToken) {
    const { decoded: refreshTokenDecoded, expired: refreshTokenExpired } =
      verifyJwt(refreshToken as string, true);

    if (refreshTokenExpired)
      return res
        .status(HTTP.UNAUTHORIZED)
        .json([{ message: "You session has expired" }]);

    const session = refreshTokenDecoded as JwtPayload;

    // Removing unnecessary extra information
    delete session.iat;
    delete session.exp;

    const newAccessToken = reIssueAccessToken(session);

    res.setHeader("x-access-token", newAccessToken);

    return next();
  } else {
    return res
      .status(HTTP.UNAUTHORIZED)
      .json([{ message: "You session has expired" }]);
  }
}
