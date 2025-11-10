import asyncHandler from 'express-async-handler';

const admin = asyncHandler((req, res, next) => {
  if (req.user && req.user.role === 'Custodian') {
    next();
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as a Custodian');
  }
});

export { admin };
