export interface Message {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}
