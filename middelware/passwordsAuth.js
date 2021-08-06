import jwt from "jsonwebtoken";

export const passwordAuth = (req, res, next) => {

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        res.json({ auth: false });
      } else {
        req.token = decodedToken;
        next();
      }
    });
  } else {
    res.json({ auth: false });
  }
};
