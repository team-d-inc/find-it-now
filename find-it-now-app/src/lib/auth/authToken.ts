import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRATION = '90d';

export function generateToken(reportId: string) {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  return jwt.sign({ reportId }, JWT_SECRET, { expiresIn: EXPIRATION });
}

export function verifyToken(token: string, reportId: string) {
  if (!process.env.JWT_SECRET) {
    return false;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { reportId: string };
    return payload.reportId === reportId;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return false;
  }
}
