module.exports = (err, _req, res, _next) => {
  console.log(err);
  return res.status(500).json({
    message: err.message,
    err,
  });
};
