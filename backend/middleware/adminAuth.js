import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token contains the correct admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not Authorized.",
      });
    }

    // Attach admin details to the request object for further use
    req.admin = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default adminAuth;
