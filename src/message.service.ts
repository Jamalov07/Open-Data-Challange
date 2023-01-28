import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './models/address.model';
import { Driver } from './models/drivers.model';
import { Search } from './models/searches.model';
import { Taxi } from './models/taxi.model';
import { User } from './models/users.model';
import { UserAddress } from './models/user_address.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    @InjectModel(Taxi) private readonly taxiRepo: typeof Taxi,
    @InjectModel(Search) private readonly searchRepo: typeof Search,
    @InjectModel(Address) private readonly addressRepo: typeof Address,
    @InjectModel(UserAddress) private readonly usAddrRepo: typeof UserAddress,
    @InjectModel(Driver) private readonly driverRepo: typeof Driver,
  ) { }
}
