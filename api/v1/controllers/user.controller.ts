import md5 from "md5";
import { Request, Response } from "express";
import User from "../models/user.model";

import { generateRandomString } from "../../../helpers/generate";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  req.body.password = md5(req.body.password);

  const exitsEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  console.log(exitsEmail);

  if (exitsEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateRandomString(30),
    });

    user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công!",
      token: token,
    });
  }
};
