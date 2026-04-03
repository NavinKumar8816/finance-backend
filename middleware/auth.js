export const mockAuth = (req, res, next) => {
  const role = req.headers.role;

  if (!role) {
    return res.status(401).json({ message: "No role provided" });
  }

  req.user = {
    role,
  };

  next();
};