// const { Router } = require("express");
// const User = require("../models/user");

// const router = Router();

// router.get("/signin", (req, res) => {
//   return res.render("signin");
// });

// router.get("/signup", (req, res) => {
//   return res.render("signup");
// });

// router.post("/signin", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const token = await User.matchPasswordAndGenerateToken(email, password);
//     return res.cookie("token", token).redirect("/");
//   } catch (error) {
//     return res.render("signin", {
//       error: "Incorrect Email or Password",
//     });
//   }
// });

// router.get("/logout", (req, res) => {
//   res.clearCookie("token").redirect("/");
// });

// router.post("/signup", async (req, res) => {
//   const { fullName, email, password } = req.body;
//   await User.create({
//     fullName,
//     email,
//     password,
//   });
//   return res.redirect("/");
// });

// module.exports = router;

const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

router.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, "$uperMan@123");
      const user = await User.findById(decoded.id);

      if (user) {
        console.log("User from database:", user);
        res.locals.user = user;
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res.locals.user = null;
  }
  next();
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/user/signin");
});

module.exports = router;
