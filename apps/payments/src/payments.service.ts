import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpcProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2025-03-31.basil',
      },
    );
  }

  async createCharge({ card, amount }: CreateChargeDto) {
    // stripe doesnt allow to use raw card details
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        currency: 'usd',
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        // payment_method_types: ['card'],
      });

      return paymentIntent;
    } catch (e) {
      console.log('🚀 ~ PaymentsService ~ createCharge ~ e:', e);
    }
  }
}
