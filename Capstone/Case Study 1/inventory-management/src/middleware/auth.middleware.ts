import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const userService = new UserService();

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Missing authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization header format');
    }

    const token = parts[1];
    const payload = userService.verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message, code: error.code });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const apiKeyMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw new UnauthorizedError('Missing API key');
    }

    // For now, validate against a hardcoded secret (replace with database lookup)
    const validKeys = process.env.API_KEYS?.split(',') || ['test-key-123'];
    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedError('Invalid API key');
    }

    // Set a default user context for API key auth
    req.user = {
      id: 'api-client',
      email: 'api@client.local',
      role: 'STAFF',
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'API key authentication failed' });
  }
};
