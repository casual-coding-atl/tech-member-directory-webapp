const transporter = require("../../config/nodemailer.config");
const { User, Verification } = require("../../models");

const postRegister = async function (req, res) {
  const { username, email, password } = req.body;

  try {
    const user = await User.register({ username, email }, password);
    await user.save();

    const code = Math.floor(100000 + Math.random() * 900000);

    const verification = new Verification({
      code,
      user: user._id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
    });

    await verification.save();

    await transporter({
      from: `"Casual Coding" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Casual Coding verification code",
      text: `Verification Code: ${verification.code}`,
    });
    res.redirect(`/verify?userid=${user._id.toString()}`);
  } catch (error) {
    console.log("[REGISTRATION ERROR]", error);
    res.redirect("register?error=something went wrong");
  }
  // User.register({ username: req.body.username, email: req.body.email }, req.body.password, function (err, user) {
  //   if (err) {
  //     console.log(err);
  //     res.redirect("/register");
  //   } else {
  //     passport.authenticate("local")(req, res, function () {
  //       res.redirect("/projects/cards");
  //     });
  //   }
  // });
};

module.exports = {
  postRegister,
};
