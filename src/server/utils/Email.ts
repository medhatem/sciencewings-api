import { container, provideSingleton } from '@di/index';

import { EmailMessage } from '../types/types';
import { MailService } from '@sendgrid/mail';
import { getConfig } from '../configuration/Configuration';

@provideSingleton()
export class Email extends MailService {
  public from = getConfig('email.from');

  constructor() {
    super();
    // TODO: should use the config instead
    this.setApiKey(getConfig('email.sendGridApiKey'));
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
