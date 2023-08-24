import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Note, NoteDocument } from "./note.model";
import * as ExcelJS from "exceljs";
@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: Partial<Note>): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(
    sortFields?: { field: string; order: string }[]
  ): Promise<Note[]> {
    const sortOptions = {};

    if (sortFields?.length) {
      for (const sortField of sortFields) {
        const { field, order } = sortField;
        if (
          field === "timestamp" ||
          field === "title" ||
          field === "description"
        ) {
          sortOptions[field] = order === "asc" ? 1 : -1; // Use 1 for ascending, -1 for descending
        }
      }
    }

    return this.noteModel.find().sort(sortOptions).exec();
  }

  async exportToExcel(notes: Note[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Notes");

    worksheet.columns = [
      { header: "Загаловок", key: "title", width: 20 },
      { header: "Описание", key: "description", width: 40 },
    ];

    notes.forEach((note) => {
      worksheet.addRow({
        title: note.title,
        description: note.description,
      });
    });

    const bufferArray = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(bufferArray);
    return buffer;
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException("Note not found");
    }
    return note;
  }

  async update(id: string, updateNoteDto: Partial<Note>): Promise<Note> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException("Note not found");
    }
    return updatedNote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException("Note not found");
    }
  }
}
