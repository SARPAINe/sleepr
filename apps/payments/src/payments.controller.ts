import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    // const channel = context.getChannelRef();
    // console.log('🚀 ~ PaymentsController ~ channel:', channel);
    // const originalMessage = context.getMessage();
    // console.log('🚀 ~ PaymentsController ~ originalMessage:', originalMessage);
    // channel.ack(originalMessage);
    // throw new Error('Not implemented');
    return this.paymentsService.createCharge(data);
  }
}
