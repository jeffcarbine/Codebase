export default (req) => {
  if (req.user) {
    return true;
  }

  return false;
};
