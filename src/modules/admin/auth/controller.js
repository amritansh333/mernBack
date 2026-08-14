import User from "../users/User.js";
import bcrypt from "bcryptjs";
import env from "../../../config/env.js";
import { generateSessionToken, COOKIE_NAME } from "../../../middleware/requireAuth.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  path: '/api/admin',
};

export const login = async (req, res) => {
  const { email, password, remember } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, message: 'email and password required' });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  if (user.status !== 'Active') return res.status(403).json({ success: false, message: 'User inactive' });

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  // create session token
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

  const session = { token, createdAt: now.toISOString(), expiresAt: expiresAt.toISOString(), ip: req.ip };
  user.meta = {
    ...(user.meta || {}),
    sessions: [...(user.meta?.sessions || []), session],
    lastLoginAt: now.toISOString(),
  };
  user.markModified('meta');
  await user.save();

  res.cookie(COOKIE_NAME, token, Object.assign({ maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : undefined }, COOKIE_OPTS));

  // return sanitized user
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.meta?.lastLoginAt,
  };

  return res.json({ success: true, message: 'OK', data: { user: safeUser } });
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (token) {
      // remove session token from user
      await User.updateOne({ "meta.sessions.token": token }, { $pull: { "meta.sessions": { token } } });
      res.clearCookie(COOKIE_NAME, COOKIE_OPTS);
    }
  } catch (err) {
    // ignore
  }
  return res.json({ success: true, message: 'Logged out' });
};

export const me = async (req, res) => {
  // requireAuth middleware attaches authUser
  const authUser = req.authUser;
  if (!authUser) return res.status(401).json({ success: false, message: 'Unauthorized' });
  return res.json({ success: true, message: 'OK', data: authUser });
};

export default { login, logout, me };
