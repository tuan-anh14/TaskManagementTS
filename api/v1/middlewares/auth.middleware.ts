import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split(" ")[1];

      const user = await User.findOne({
        token: token,
        deleted: false,
      }).select("-password");

      if (!user) {
        res.status(400).json({
          code: 400,
          message: "Token không hợp lệ!",
        });
        return;
      }

      req.user = user;

      next();
    } else {
      res.status(400).json({
        code: 400,
        message: "Vui lòng gửi kèm token!",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ!",
    });
  }
};
