import { container, provideSingleton } from '@di/index';
import { Configuration } from '../configuration/Configuration';

import { EmailMessage } from '../types/types';
import { MailService } from '@sendgrid/mail';

@provideSingleton()
export class Email extends MailService {
  private emailConfig = Configuration.getInstance().getConfiguration().email;
  public from = this.emailConfig.from;

  constructor() {
    super();
    // TODO: should use the config instead
    this.setApiKey(this.emailConfig.key);
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
