import md5 from "md5";
import { Request, Response } from "express";
import User from "../models/user.model";

import { generateRandomString } from "../../../helpers/generate";

interface AuthenticatedRequest extends Request {
  user?: any;
}

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

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  console.log(email);
  console.log(password);

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  console.log(user);

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại !",
    });

    return;
  }

  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu !",
    });

    return;
  }

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token,
  });
};

// [GET] /api/v1/users/detail
export const detail = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    code: 200,
    message: "Thành công!",
    info: req.user,
  });
};
