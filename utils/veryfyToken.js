import jwt from "jsonwebtoken"
import { createErrorMsg } from "./errorResponse.js";

const veryfyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log('token = ', token)
  if (token === undefined) {
    return next(createErrorMsg(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return next(createErrorMsg(403, "Token is not valid!"));
    }
    req.user = user;
    next();
  })
}

export const verifyUser = (req, res, next) => {
  veryfyToken(req, res, () => {
    // console.log("req.user.id = ", req.user.id);
    // console.log("req.params.userId = ", req.params.userId);

    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    }
    else {
      return next(createErrorMsg(403, "You are not authorized!"));
    }
  })
}
