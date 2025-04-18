import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Stripe from 'stripe';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;
  /**
   * Two-digit number representing the card's expiration month.
   */
  @IsNumber()
  exp_month: number;
  /**
   * Four-digit number representing the card's expiration year.
   */
  @IsNumber()
  exp_year: number;
  /**
   * The card number, as a string without any separators.
   */
  @IsCreditCard()
  number: string;
}
