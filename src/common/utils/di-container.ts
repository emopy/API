import { Container } from 'inversify';
import { Model } from 'mongoose';
import { IMongoUser } from '../../models/user/interfaces/IMongoUser';
import { IUserRepository } from '../../models/user/interfaces/IUserRepository';
import { MongoUserRepository } from '../../models/user/repositories/mongo.repository';
import { MongoUser } from '../../models/user/schemes/mongo.schema';
import { UserSeeder } from '../../models/user/seeder/user.seeder';
import { AuthController } from '../../routes/auth/auth.controller';
import { AuthRouter } from '../../routes/auth/auth.router';
import { AuthService } from '../../routes/auth/auth.service';
import { IMailProvider } from '../../services/email/interfaces/IMailProvider';
import { MailService } from '../../services/email/mail.service';
import { GmailProvider } from '../../services/email/providers/gmail.provider';
import { Constants } from '../constants';

const container = new Container();

container.bind<AuthController>(Constants.DEPENDENCY.AUTH_CONTROLLER).to(AuthController);
container.bind<AuthRouter>(Constants.DEPENDENCY.AUTH_ROUTER).to(AuthRouter);
container.bind<AuthService>(Constants.DEPENDENCY.AUTH_SERVICE).to(AuthService);

container.bind<IUserRepository>(Constants.DEPENDENCY.USER_REPOSITORY).to(MongoUserRepository);
container.bind<Model<IMongoUser>>(Constants.DEPENDENCY.MONGO_USER_MODEL).toConstantValue(MongoUser);
container.bind<UserSeeder>(Constants.DEPENDENCY.USER_SEEDER).to(UserSeeder);

container.bind<MailService>(Constants.DEPENDENCY.MAIL_SERVICE).to(MailService);
container.bind<IMailProvider>(Constants.DEPENDENCY.MAIL_PROVIDER).to(GmailProvider);

export { container };