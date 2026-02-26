/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import { LibraryService } from './library.service';

import { CreateBookDto } from './dto/create-book.dto';
import { AssignBookDto } from './dto/assign-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

import { BookResponseDto } from './dto/book-response.dto';
import { RecordResponseDto } from './dto/record-response.dto';

@Controller('library')
export class LibraryController {
 public constructor(private readonly service: LibraryService) {}

  @Post('books')
  public async addBook(
    @Body() dto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return await this.service.addBook(dto);
  }

  @Get('books')
  public async getBooks(): Promise<BookResponseDto[]> {
    return await this.service.getBooks();
  }

  @Get('records')
  public async getRecords(): Promise<RecordResponseDto[]> {
    return await this.service.findAllRecords();
  }

  @Get('records/:id')
  public async getSingle(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecordResponseDto> {
    return await this.service.getSingleRecord(id);
  }

  @Post('assign')
  public async assign(
    @Body() dto: AssignBookDto,
  ): Promise<RecordResponseDto> {
    return await this.service.assignBook(dto);
  }

  @Post('return')
  public async returnBook(
    @Body() dto: ReturnBookDto,
  ): Promise<RecordResponseDto> {
    return await this.service.returnBook(dto);
  }

  @Patch('records/:id')
  public async updateRecord(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecordDto,
  ): Promise<RecordResponseDto> {
    return await this.service.updateRecord(id, dto);
  }

  @Delete('records/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteRecord(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.deleteRecord(id);
  }
}