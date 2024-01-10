import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class BoardRepository extends Repository<Board> {
   constructor(@InjectRepository(Board) private dataSource: DataSource) {
     super(Board, dataSource.manager);
   }
   async getBoardById(id: number) {
      return await this.findOneBy({ id: id });
   }
}

