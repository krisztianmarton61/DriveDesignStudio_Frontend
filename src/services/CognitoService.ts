import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { config } from "../config";
import { User } from "../states";
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  ConfirmSignUpInput,
  resendSignUpCode,
  ResendSignUpCodeInput,
} from "@aws-amplify/auth";

interface UserData {
  [key: string]: string;
}

const userPool = new CognitoUserPool({
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId,
});

async function amplifySignIn(email: string, password: string) {
  return signIn({ username: email, password });
}

async function amplifySignUp(email: string, password: string) {
  return await signUp({ username: email, password });
}

async function amplifySignOut() {
  await signOut();
}

async function amplifyConfirmSignUp(email: string, confirmationCode: string) {
  const confirmSignUpInput: ConfirmSignUpInput = {
    username: email,
    confirmationCode,
  };
  const user = await confirmSignUp(confirmSignUpInput);
  return user;
}

async function amplifyResendConfirmationCode(email: string) {
  const resendSignUpCodeInput: ResendSignUpCodeInput = {
    username: email,
  };
  const user = await resendSignUpCode(resendSignUpCodeInput);
  return user;
}

async function ssignUp(email: string, password: string): Promise<CognitoUser> {
  const userAttributes: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, userAttributes, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result) {
          resolve(result.user);
        } else {
          reject(new Error("No user found"));
        }
      }
    });
  });
}

async function sconfirmSignUp(email: string, code: string) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function sresendConfirmationCode(email: string) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function ssignIn(email: string, password: string) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

async function sforgotPassword(username: string) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        resolve(data);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

async function sconfirmPassword(username: string, code: string) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function ssignOut() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}
async function getCurrentUser() {
  return new Promise<User>((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user found"));
      return;
    }

    cognitoUser.getSession((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }
        if (!attributes) {
          reject(new Error("No user found"));
        } else {
          const userData = attributes.reduce(
            (acc: UserData, attribute: CognitoUserAttribute) => {
              acc[attribute.Name] = attribute.Value;
              return acc;
            },
            {}
          );
          resolve(userData as unknown as User);
        }
      });
    });
  });
}

async function getSession(): Promise<CognitoUserSession> {
  const cognitoUser = userPool.getCurrentUser();
  return new Promise((resolve, reject) => {
    if (!cognitoUser) {
      reject(new Error("No user found"));
      return;
    }
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
}

export const CognitoService = {
  ssignUp,
  sconfirmSignUp,
  sresendConfirmationCode,
  ssignIn,
  sforgotPassword,
  sconfirmPassword,
  ssignOut,
  getCurrentUser,
  getSession,
  amplifySignIn,
  amplifySignUp,
  amplifySignOut,
  amplifyConfirmSignUp,
  amplifyResendConfirmationCode,
};
