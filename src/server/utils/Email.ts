import { container, provideSingleton } from '@di/index';
import { getConfig } from '../configuration/Configuration';

import { EmailMessage } from '../types/types';
import { MailService } from '@sendgrid/mail';

@provideSingleton()
export class Email extends MailService {
  public from = getConfig('email.from');

  constructor() {
    super();
    this.setApiKey(getConfig('email.key'));
  }

  static getInstance(): Email {
    return container.get(Email);
  }

  setFrom(from: string) {
    this.from = from;
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    await this.send(message);
  }
}
