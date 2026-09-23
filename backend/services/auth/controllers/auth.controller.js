import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
import crypto from "crypto";

export const login = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    // Ensure plan & credits defaults exist for existing user records
    let userModified = false;
    if (!user.plan) {
      user.plan = "free";
      userModified = true;
    }
    if (user.credits === undefined) {
      user.credits = 100;
      userModified = true;
    }
    if (user.totalCredits === undefined) {
      user.totalCredits = 100;
      userModified = true;
    }
    if (!user.planExpiresAt) {
      user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      userModified = true;
    }
    if (userModified) {
      await user.save();
    }

    const sessionId = crypto.randomUUID();
    const sessionData = {
      _id: user._id,
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan || "free",
      credits: user.credits ?? 100,
      totalCredits: user.totalCredits ?? 100,
      planExpiresAt: user.planExpiresAt,
    };

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify(sessionData),
      "EX",
      7 * 24 * 60 * 60,
    );

    // Save mapping from user ID to active session ID for inter-service sync
    await redis.set(
      `user-session-${user._id}`,
      sessionId,
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `login error ${error}`,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const sessionId =
      req.cookies?.session ||
      req.headers.cookie?.match(/(?:^|;\s*)session=([^;]+)/)?.[1];

    if (sessionId) {
      const session = await redis.get(`session-${sessionId}`);
      if (session) {
        try {
          const parsed = JSON.parse(session);
          const uid = parsed.userId || parsed._id;
          if (uid) {
            await redis.del(`user-session-${uid}`);
          }
        } catch {
          // ignore parse error on logout
        }
      }
      await redis.del(`session-${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `logout error ${error}`,
    });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId, sessionId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan;
    user.credits = (user.credits || 0) + (credits || 0);
    user.totalCredits = (user.totalCredits || 0) + (credits || 0);
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    // Determine the active sessionId from request body, cookies, or Redis user-session mapping
    const activeSessionId =
      sessionId ||
      req.cookies?.session ||
      (await redis.get(`user-session-${user._id}`));

    if (activeSessionId) {
      await redis.set(
        `session-${activeSessionId}`,
        JSON.stringify({
          _id: user._id,
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        7 * 24 * 60 * 60,
      );
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      message: `update user payment error ${error}`,
    });
  }
};