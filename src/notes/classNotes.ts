import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(0, 250)
  description?: string;
}

export class EditNoteDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(0, 250)
  description?: string;
}
