const errorHandler = (err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map((e) => e.message).join(', '),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
