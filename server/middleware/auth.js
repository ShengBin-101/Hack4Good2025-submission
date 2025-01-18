import jwt from'jsonwebtoken';

/* Token for User */
export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization"); //grabs the token from the front end request

        if (!token) {
            return res.status(403).send("Access Denied!");
        }

        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimLeft();
        } //take token from right side of Bearer

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/* Token for Admin User */
export const verifyAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.admin) {
            return res.status(403).json({ msg: "Admin access required." }); // Deny access if the user is not an admin
        }
        next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

/* This file protects your api calls, only authorised users can use ur api endpoints
*/