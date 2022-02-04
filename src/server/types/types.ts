export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export type Json = { [key: string]: any };
