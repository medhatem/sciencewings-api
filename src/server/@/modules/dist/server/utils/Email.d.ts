import { EmailMessage } from '../types/types';
import { MailService } from '@sendgrid/mail';
export declare class Email extends MailService {
    from: any;
    constructor();
    static getInstance(): Email;
    setFrom(from: string): void;
    sendEmail(message: EmailMessage): Promise<void>;
}
