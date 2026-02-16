/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateBookDto } from './dto/create-book.dto';
import { AssignBookDto } from './dto/assign-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
  import { Patch, Param } from "@nestjs/common";
  import { Delete } from "@nestjs/common";

@Controller('library')
export class LibraryController {
  constructor(private readonly service: LibraryService) {}

  @Post('books')
  addBook(@Body() dto: CreateBookDto) {
    return this.service.addBook(dto);
  }

  @Get('books')
  getBooks() {
    return this.service.getBooks();
  }

  // ✅ ADD THIS
  @Get('records')
  getRecords() {
    return this.service.findAllRecords();
  }

  @Post('assign')
  assign(@Body() dto: AssignBookDto) {
    return this.service.assignBook(dto);
  }

  @Post('return')
  returnBook(@Body() dto: ReturnBookDto) {
    return this.service.returnBook(dto);
  }


@Patch("records/:id")
updateRecord(
  @Param("id") id: string,
  @Body() body: any
) {
  return this.service.updateRecord(id, body);
}

@Get("records/:id")
getSingle(@Param("id") id: string) {
  return this.service.getSingleRecord(id);
}



@Delete("records/:id")
deleteRecord(@Param("id") id: string) {
  return this.service.deleteRecord(id);
}

@Get("records/:id")
getSingleRecord(@Param("id") id: string) {
  return this.service.getRecordById(id);
}
}
