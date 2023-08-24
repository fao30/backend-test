import {
  Controller,
  Get,
  Res,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import { NotesService } from "./notes.services";
import { Note } from "./note.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateNoteDto, EditNoteDto } from "./classNotes";
import { Response } from "express";

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
  async findAll(
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: string
  ): Promise<Note[]> {
    if (sortBy) {
      const sortByArray = sortBy.split(",");
      const sortOrderArray = sortOrder.split(",");

      const sortFields = sortByArray.map((field, index) => ({
        field,
        order: sortOrderArray[index] || "asc",
      }));

      return this.notesService.findAll(sortFields);
    }
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

  @Post("download")
  async exportNotesToExcel(@Res() res: Response) {
    const notes = await this.notesService.findAll(); // Adjust this to get your notes data
    const buffer = await this.notesService.exportToExcel(notes);
    res.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.set("Content-Disposition", "attachment; filename=notes.xlsx");
    res.send(buffer);
  }
}
