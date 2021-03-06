import { Mail } from './mail';

export class BorrowRequestMail extends Mail {
    protected readonly _subject = 'Someone wants to borrow your book';
    protected readonly _templateName = 'borrow-request-mail.html';

    constructor(to: string) {
        super(to);
    }
}
