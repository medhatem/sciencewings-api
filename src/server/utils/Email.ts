import { container, provideSingleton } from '@di/index';

import { EmailMessage } from '../types/types';
import { MailService } from '@sendgrid/mail';

@provideSingleton()
export class Email extends MailService {
  public from = process.env.SENDGRID_FROM;

  constructor() {
    super();
    // TODO: should use the config instead
    this.setApiKey(process.env.SENDGRID_API_KEY);
  }

  static getInstance(): Email {
    return container.get(Email);
  }

  setFrom(from: string) {
    this.from = from;
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    console.log({ message });

    await this.send(message);
  }
}
