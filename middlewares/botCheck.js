import { FriendlyCaptcha } from "@friendlycaptcha/server-sdk";

const fc = new FriendlyCaptcha({
  secretKey: process.env.FC_SECRET
});

export async function botCheck(req, res, next) {
  try {
    await fc.verify(req.body.captchaToken);
    return next();
  } catch {
    return res.status(400).json({ error: "Captcha verification failed" });
  }
}
