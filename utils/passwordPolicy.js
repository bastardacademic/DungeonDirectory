import zxcvbn from "@zxcvbn-ts/core";
import hibp   from "haveibeenpwned-js";

export async function validatePassword(pw) {
  const { score } = zxcvbn(pw);
  if (score < 3) throw new Error("Password is too weak");

  const pwned = await hibp.pwnedPassword(pw);
  if (pwned.count > 0) throw new Error("Password appears in data breaches");

  return true;
}
