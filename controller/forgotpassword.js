const Forgotpassword = require("../models/forgotpassword");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.postForgotpasswaord = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });
    console.log(user, "user in forgotpassword");
    if (user) {
      const id = uuidv4;
      const forgot = await Forgotpassword.create({
        id: id,
        userId: user.id,
        isactive: true,
      });

      sgMail.setApiKey(process.env.SENGRID_API_KEY);

      const msg = {
        to: email,
        from: "abc@gmail.com",
        subject: "Forgot password",
        text: "forgot password link generated successfully click on th e;ink to reset password",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      };

      const response = await sgMail.send(msg);
      res.status(response[0].statusCode).json({
        message: "Link to reset your password sent to your mail ",
        sucess: true,
      });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (error) {
    console.log(error, "error in postforgotpassword");
  }
};

exports.postResetpassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({
      where: { id: id },
    });
    console.log(
      forgotpasswordrequest,
      "forgotpasswordrequest in reset password"
    );
    if (forgotpasswordrequest.isactive) {
      forgotpasswordrequest.update({ isactive: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
    } else {
      throw new Error("forgotpasswordrequest expired doesnt exist");
    }
  } catch (error) {
    connsole.log(error, "error in post resetpassword");
  }
};

exports.postUpdatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    const resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });
    console.log(resetpasswordid, "resetpasswordid in get update");
    const user = await User.findOne({
      where: { id: resetpasswordrequest.userId },
    });
    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
        if (err) {
          throw new Error("new password doent encrypted in postupdatepassword");
        } else {
          // Store hash in your password DB.
          const data = await User.update(
            { password: hash },
            { where: { id: user.id } }
          );
          res
            .status(201)
            .json({ message: "Successfuly updated the new password" });
        }
      });
    } else {
      console.log("user not defined in postUpdatepassword");
    }
  } catch (error) {
    console.log(error, "error in get update password");
    return res.status(403).json({ error, success: false });
  }
};
