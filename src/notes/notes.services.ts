import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.model';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: Partial<Note>): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(id: string, updateNoteDto: Partial<Note>): Promise<Note> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }
    return updatedNote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Note not found');
    }
  }
}
