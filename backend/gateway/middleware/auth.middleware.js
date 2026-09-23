import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionId =
      req.cookies?.session ||
      req.headers.cookie?.match(/(?:^|;\s*)session=([^;]+)/)?.[1];

    if (!sessionId) {
      return res.status(401).json({
        message: "unauthorized",
      });
    }

    const session = await redis.get(`session-${sessionId}`);

    if (!session) {
      return res.status(401).json({
        message: "session expired",
      });
    }

    req.user = JSON.parse(session);
    if (req.user) {
      if (!req.user._id && req.user.userId) req.user._id = req.user.userId;
      if (!req.user.userId && req.user._id) req.user.userId = req.user._id;
      if (!req.user.plan) req.user.plan = "free";
      if (req.user.credits === undefined) req.user.credits = 100;
      if (req.user.totalCredits === undefined) req.user.totalCredits = 100;
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: `protect error ${error}`,
    });
  }
};

export default protect;
