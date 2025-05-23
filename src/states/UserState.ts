import { CognitoService } from "../services";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { effect, signal } from "@preact/signals-react";

export type User = {
  email: string;
  sub: string;
  email_verified: boolean;
};

export const user = signal<User | undefined>(undefined);
export const session = signal<CognitoUserSession | undefined>(undefined);

export const getCurrentUser = async () => {
  try {
    const _user = await CognitoService.getCurrentUser();
    user.value = _user;
  } catch (err) {
    user.value = undefined;
  }
};

export const getUserSession = async () => {
  try {
    const _session = await CognitoService.getSession();
    session.value = _session;
  } catch (err) {
    session.value = undefined;
  }
};

export const signUp = async (email: string, password: string) => {
  await CognitoService.amplifySignUp(email, password);
};

export const signIn = async (username: string, password: string) => {
  await CognitoService.amplifySignIn(username, password);
  await getCurrentUser();
};

export const confirmSignUp = async (email: string, code: string) => {
  await CognitoService.amplifyConfirmSignUp(email, code);
};

export const signOut = async () => {
  await CognitoService.amplifySignOut();
  user.value = undefined;
};

export const resendConfirmationCode = async (email: string) => {
  await CognitoService.amplifyResendConfirmationCode(email);
};

effect(() => {
  getCurrentUser()
    .then(() => {
      getUserSession();
    })
    .catch(() => {});
});
