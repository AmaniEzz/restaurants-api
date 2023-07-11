import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from 'src/users/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'Jeanpier',
    description: 'The name of the user',
  })
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @ApiProperty({
    example: 'jeanpi3rm@gmail.com',
    description: 'The email of the user',
  })
  @Prop({
    required: true,
    index: { unique: true },
    lowercase: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: 'admin',
    description: "User's role",
    required: true,
  })
  @Prop({ required: true, enum: Role, default: Role.USER })
  role: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
