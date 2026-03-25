const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] }
    });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with that email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, phone, password: hashedPassword }
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error.message] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (!user.password && user.google_id)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or try logging in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);
    res.status(200).json({
        success: true,
        data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error.message] });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'No Google token provided' });
    
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          google_id: googleId,
          avatar_url: picture,
          role: 'CUSTOMER'
        }
      });
    } else if (!user.google_id || !user.avatar_url) {
      user = await prisma.user.update({
        where: { email },
        data: { google_id: googleId, avatar_url: picture }
      });
    }
    
    const jwtToken = generateToken(user.id, user.role);
    
    res.status(200).json({
      success: true,
      message: 'Google Login successful',
      data: {
        token: jwtToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Failed to authenticate with Google' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, avatar_url: true }
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve user profile' });
  }
};
