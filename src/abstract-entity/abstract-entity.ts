/* eslint-disable prettier/prettier */
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date | null;
}
