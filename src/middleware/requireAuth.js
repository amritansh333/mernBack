import User from "../modules/admin/users/User.js";
import Role from "../modules/admin/roles/Role.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// cookie name for session token
const COOKIE_NAME = "polyrib_admin_session";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    // find user with matching session token
    const user = await User.findOne({ "meta.sessions.token": token }).lean();
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    // find the session
    const session = (user.meta && user.meta.sessions || []).find((s) => s.token === token);
    if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, message: "Session expired" });
    }

    // attach user (without sensitive fields)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || user.meta?.lastLoginAt,
    };

    req.authUser = safeUser;
    req.authRaw = user; // full user object if controllers need it (but avoid sending passwordHash)
    return next();
  } catch (err) {
    // do not leak internals
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const authUser = req.authUser;
      if (!authUser) return res.status(401).json({ success: false, message: "Unauthorized" });

      // super_admin bypass
      if (authUser.role === 'super_admin') return next();

      // load role
      const role = await Role.findOne({ slug: authUser.role }).lean();
      if (!role) return res.status(403).json({ success: false, message: "Forbidden" });

      const perms = role.permissions || [];
      if (perms.includes(permission)) return next();

      return res.status(403).json({ success: false, message: "Forbidden" });
    } catch (err) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
  };
}

export function generateSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

export { COOKIE_NAME };
