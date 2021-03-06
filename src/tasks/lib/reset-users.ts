import { Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Constants } from '../../common/constants';
import { logger } from '../../common/utils/logger/logger';
import { PrismaService } from '../../database/prisma.service';

export class ResetUsersTask {
    constructor(@Inject(Constants.DEPENDENCY.DATABASE_SERVICE) private readonly _databaseService: PrismaService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    public async handle(): Promise<void> {
        const users = await this._databaseService.user.findMany({ where: { isConfirmed: false }, select: { joinedAt: true, id: true } });

        await this._deleteUsers(users);

        logger.info('Unconfirmed users have been removed from the database');
    }

    private async _deleteUsers(users: { joinedAt: Date; id: string }[]): Promise<void> {
        for (const user of users) {
            const accountHasMoreThanTwoHours = Date.now() - user.joinedAt.getTime() > Constants.TIME.HOURS_2;
            if (accountHasMoreThanTwoHours) await this._databaseService.user.delete({ where: { id: user.id } });
        }
    }
}
