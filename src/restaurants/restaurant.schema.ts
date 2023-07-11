import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from 'src/cities/city.schema';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class Location {
  @ApiProperty()
  type: string;

  @ApiProperty()
  coordinates: [number, number];
}

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true, versionKey: false })
export class Restaurant {
  @ApiProperty()
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

RestaurantSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
