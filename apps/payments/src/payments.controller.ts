import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @EventPattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const result = await this.paymentsService.createCharge(data);
      channel.ack(originalMessage); // Acknowledge the message
      return result;
    } catch (error) {
      console.error('Error processing message:', error.message);
      channel.nack(originalMessage, false, true); // Requeue the message for retry
    }
  }
}
