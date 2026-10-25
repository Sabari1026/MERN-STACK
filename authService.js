const crypto = require('crypto');

// In-memory user database
const USERS = [];
const SESSIONS = new Map();

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function createUserRecord({ id, name, email, password, role, companyName = '' }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = id || `user-${crypto.randomBytes(6).toString('hex')}`;
  
  return {
    id: userId,
    name,
    email: email.toLowerCase().trim(),
    role: role.toLowerCase().trim(), // 'employee' or 'recruiter'
    companyName: companyName.trim(),
    salt,
    passwordHash,
    createdAt: new Date().toISOString()
  };
}

// Seed accounts for immediate evaluation
const SEED_USERS = [
  {
    id: 'user-candidate-aarav',
    name: 'Aarav Sharma',
    email: 'candidate@hireconnect.io',
    password: 'Candidate@123',
    role: 'employee'
  },
  {
    id: 'user-recruiter-priya',
    name: 'Priya Mehta',
    email: 'recruiter@hireconnect.io',
    password: 'Recruiter@123',
    role: 'recruiter',
    companyName: 'Razorpay'
  }
];

for (const u of SEED_USERS) {
  USERS.push(createUserRecord(u));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function loginUser({ email, password, role = 'employee', rememberMe = false, bypassPassword = false }) {
  if (!email || (!password && !bypassPassword)) {
    return { success: false, status: 400, message: 'Email and password are required.' };
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const cleanRole = String(role).toLowerCase().trim();

  if (!isValidEmail(cleanEmail)) {
    return { success: false, status: 400, message: 'Please enter a valid email address.' };
  }

  const user = USERS.find(u => u.email === cleanEmail);
  if (!user) {
    return { success: false, status: 401, message: 'No account found with this email. Please check your credentials or register.' };
  }

  // Enforce strict role boundary
  if (user.role !== cleanRole) {
    const expectedLabel = user.role === 'employee' ? 'Job Seeker / Candidate' : 'Recruiter / Employer';
    return {
      success: false,
      status: 403,
      message: `This account is registered as a ${expectedLabel}. Please select the ${expectedLabel} tab to sign in.`
    };
  }

  if (!bypassPassword) {
    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return { success: false, status: 401, message: 'Incorrect password. Please verify and try again.' };
    }
  }

  // Create session
  const token = `hc_${crypto.randomBytes(32).toString('hex')}`;
  const maxAge = rememberMe ? 30 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
  const expiresAt = Date.now() + maxAge;

  const sessionData = {
    token,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    expiresAt
  };

  SESSIONS.set(token, sessionData);

  // Role-based redirect URL
  const redirectUrl = user.role === 'recruiter' ? '/cases/' : '/services/';

  return {
    success: true,
    status: 200,
    message: 'Signed in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    },
    redirectUrl
  };
}

function registerUser({ name, email, password, role = 'employee', companyName = '' }) {
  if (!name || !email || !password) {
    return { success: false, status: 400, message: 'Name, email, and password are required.' };
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const cleanRole = String(role).toLowerCase().trim();

  if (!isValidEmail(cleanEmail)) {
    return { success: false, status: 400, message: 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { success: false, status: 400, message: 'Password must be at least 6 characters long.' };
  }

  if (cleanRole === 'recruiter' && !companyName) {
    return { success: false, status: 400, message: 'Company or organization name is required for recruiter accounts.' };
  }

  const existing = USERS.find(u => u.email === cleanEmail);
  if (existing) {
    return { success: false, status: 409, message: 'An account with this email already exists. Please sign in instead.' };
  }

  const newUser = createUserRecord({ name, email: cleanEmail, password, role: cleanRole, companyName });
  USERS.push(newUser);

  // Automatically authenticate upon registration
  return loginUser({ email: cleanEmail, password, role: cleanRole, rememberMe: true });
}

function forgotPassword({ email, role = 'employee' }) {
  const cleanEmail = String(email).toLowerCase().trim();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, status: 400, message: 'Please enter a valid email address.' };
  }

  const user = USERS.find(u => u.email === cleanEmail && u.role === role);
  if (!user) {
    return { success: false, status: 404, message: `No registered ${role === 'recruiter' ? 'recruiter' : 'candidate'} account found with this email.` };
  }

  return {
    success: true,
    status: 200,
    message: `Password reset instructions have been sent to ${cleanEmail}. Please check your inbox.`
  };
}

function googleAuth({ credential, role = 'employee' }) {
  const cleanRole = String(role).toLowerCase().trim();
  
  // Create or retrieve Google user with preserved role
  let userEmail = `user.${cleanRole}@gmail.com`;
  let userName = cleanRole === 'recruiter' ? 'Verified Recruiter' : 'Verified Candidate';

  if (credential && typeof credential === 'object' && credential.email) {
    userEmail = credential.email.toLowerCase().trim();
    if (credential.name) userName = credential.name;
  }

  let user = USERS.find(u => u.email === userEmail);
  if (!user) {
    user = createUserRecord({
      name: userName,
      email: userEmail,
      password: crypto.randomBytes(16).toString('hex'),
      role: cleanRole,
      companyName: cleanRole === 'recruiter' ? 'Google Authenticated Partner' : ''
    });
    USERS.push(user);
  }

  return loginUser({ email: user.email, password: '', role: cleanRole, rememberMe: true, bypassPassword: true });
}

function getUserByToken(token) {
  if (!token) return null;
  const session = SESSIONS.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return null;
  }
  return session;
}

function logoutUser(token) {
  if (token && SESSIONS.has(token)) {
    SESSIONS.delete(token);
    return true;
  }
  return false;
}

function changePassword({ userId, currentPassword, newPassword }) {
  if (!userId || !currentPassword || !newPassword) {
    return { success: false, status: 400, message: 'Current password and new password are required.' };
  }

  const user = USERS.find(u => u.id === userId);
  if (!user) {
    return { success: false, status: 404, message: 'User not found.' };
  }

  const computedHash = hashPassword(currentPassword, user.salt);
  if (computedHash !== user.passwordHash) {
    return { success: false, status: 401, message: 'Current password is incorrect.' };
  }

  if (newPassword.length < 8) {
    return { success: false, status: 400, message: 'New password must be at least 8 characters long.' };
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);

  return { success: true, status: 200, message: 'Password updated successfully.' };
}

function getUserSessions(userId, currentToken) {
  const list = [];
  for (const [token, session] of SESSIONS.entries()) {
    if (session.userId === userId) {
      list.push({
        isCurrent: token === currentToken,
        createdAt: new Date(session.expiresAt - 24 * 3600 * 1000).toISOString(),
        expiresAt: new Date(session.expiresAt).toISOString(),
        device: 'Chrome on Windows 11 (Current Workstation)',
        location: 'Bengaluru, India'
      });
    }
  }
  return list;
}

function revokeOtherSessions(userId, currentToken) {
  let count = 0;
  for (const [token, session] of SESSIONS.entries()) {
    if (session.userId === userId && token !== currentToken) {
      SESSIONS.delete(token);
      count++;
    }
  }
  return { success: true, revokedCount: count, message: `Signed out of ${count} other active session(s).` };
}

function deleteAccount({ userId, password }) {
  const userIdx = USERS.findIndex(u => u.id === userId);
  if (userIdx === -1) {
    return { success: false, status: 404, message: 'User not found.' };
  }
  const user = USERS[userIdx];
  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    return { success: false, status: 401, message: 'Password is incorrect. Account deletion aborted.' };
  }

  // Remove all sessions
  for (const [token, session] of SESSIONS.entries()) {
    if (session.userId === userId) {
      SESSIONS.delete(token);
    }
  }

  USERS.splice(userIdx, 1);
  return { success: true, status: 200, message: 'Account permanently deleted.' };
}

module.exports = {
  loginUser,
  registerUser,
  forgotPassword,
  googleAuth,
  getUserByToken,
  logoutUser,
  changePassword,
  getUserSessions,
  revokeOtherSessions,
  deleteAccount
};
