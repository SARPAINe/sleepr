import {
  HttpException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy, RmqStatus } from '@nestjs/microservices';
import { catchError, map, timeout } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id }: UserDto,
  ) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        timeout(5000),
        catchError((err) => {
          console.error('Error creating charge:', err);
          throw new ServiceUnavailableException(
            'Payments service is unavailable',
          );
        }),
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: _id,
          });
        }),
      );
  }

  async findAll() {
    return await this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return await this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return await this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateReservationDto },
    );
  }

  async remove(id: string) {
    return await this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
