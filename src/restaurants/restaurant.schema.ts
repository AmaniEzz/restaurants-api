import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from 'src/cities/city.schema';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

class Location {
  @ApiProperty()
  type: string;

  @ApiProperty()
  coordinates: [number, number];
}

@Schema({ timestamps: true, versionKey: false })
export class Restaurant extends Document {
  @ApiProperty()
  @Prop({
    required: true,
    index: { unique: true },
    default: () => randomUUID(),
  })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;

  @Prop({ required: false })
  image: string;

  @ApiProperty()
  @Prop({ type: { type: String }, coordinates: [Number] })
  location: Location;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
