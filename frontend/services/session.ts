"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  user_type: string;
}

export const saveTokens = async (access: string, refresh: string) => {
  const cookieStore = await cookies();
  cookieStore.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });
  cookieStore.set("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 50,
  });
};

export const getTokens = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  return { access: accessToken, refresh: refreshToken };
};

export const createSession = async () => {
  const tokens = await getTokens();
  const access = tokens.access;
  if (access) {
    try {
      const decoded = jwtDecode<JwtPayload>(access);
      const user = {
        user_id: decoded.user_id,
        email: decoded.email,
        full_name: decoded.full_name,
        username: decoded.username,
        user_type: decoded.user_type,
      };
      return user;
    } catch (error) {
      return { message: error };
    }
  } else {
    return { message: "Access token not found" };
  }
};

export const clearTokens = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
};
