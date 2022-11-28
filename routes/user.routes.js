const Router = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  refreshUserToken,
} = require("../controllers/user.controller");
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshUserToken);
router.post("/logout", logoutUser);
router.get("/users", getUsers);

module.exports = router;
