import { asyncHandler } from "../middleware/asyncHandler.js";
import { authService } from "../services/authService.js";

export const authController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: { code: "VALIDATION_ERROR", message: "Email and password are required" },
      });
    }

    const result = await authService.login({ email, password });
    res.json({
      data: {
        user: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      error: null,
    });
  }),

  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.json({
      data: {
        user: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      error: null,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);
    res.json({
      data: { message: "Successfully logged out" },
      error: null,
    });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
    res.json({
      data: user,
      error: null,
    });
  }),
};
