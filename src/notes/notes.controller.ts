import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { NotesService } from "./notes.services";
import { Note } from "./note.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateNoteDto, EditNoteDto } from "./classNotes";

@Controller("notes")
export class NotesController {
  constructor(private notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateNoteDto: EditNoteDto
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.notesService.remove(id);
  }
}
