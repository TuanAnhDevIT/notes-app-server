import jwt from "jsonwebtoken";
import { promisify } from "util";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export const generateToken = async (
  payload: object,
  secretSignature: string,
  tokenLife: string
) => {
  try {
    if (typeof secretSignature !== "string" || !secretSignature) {
      throw new Error("Secret signature is required");
    }

    if (typeof tokenLife !== "string" || !tokenLife) {
      throw new Error("Token life is required");
    }
    return await jwt.sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token: ${error}`);
    return null;
  }
};
