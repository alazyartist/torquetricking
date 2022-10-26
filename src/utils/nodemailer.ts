import nodemailer from "nodemailer";
import { env } from "../env/server.mjs";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token: env.GMAIL_REFRESH_TOKEN,
});
export const myAccessToken: any = myOAuth2Client.getAccessToken();

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAUTH2",
    user: "torquetricking@gmail.com",
    clientId: env.GMAIL_CLIENT_ID,
    clientSecret: env.GMAIL_CLIENT_SECRET,
    refreshToken: env.GMAIL_REFRESH_TOKEN,
    accessToken: myAccessToken,
  },
});
