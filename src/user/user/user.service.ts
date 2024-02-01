/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user-entity/user-entity';
import { UserDto } from '../user-dto/user-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../user-dto/update-user-dto';
import { ChangePasswordDto } from 'src/change-password-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(userDto: UserDto): Promise<UserEntity> {
    if (await this.userAlreadyExists(userDto.email)) {
      throw new BadRequestException(
        'A user with the same email already exists',
      );
    }

    userDto.motDePasse = await this.encodePassword(
        userDto.motDePasse,
    );
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  private async userAlreadyExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
    
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
    
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }
    
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<UserEntity> {
    if (!changePasswordDto) {
      throw new BadRequestException(
        'Aucune information n\'a été fournie pour pouvoir changer le mot de passe',
      );
    }

    if (!changePasswordDto.id) {
      throw new BadRequestException('USER ID IS NULL');
    }

    if (!changePasswordDto.motDePasse || !changePasswordDto.confirmMotDePasse) {
      throw new BadRequestException('PASSWORD IS NULL');
    }

    if (changePasswordDto.motDePasse !== changePasswordDto.confirmMotDePasse) {
      throw new BadRequestException('PASSWORD CONFIRMATION IS INCORRECT');
    }

    const user = await this.findOne(changePasswordDto.id);

    if (!user) {
      throw new NotFoundException(
        `Aucun user n'a été trouvé avec l'ID ${changePasswordDto.id}`,
      );
    }

    user.motDePasse = await this.encodePassword(changePasswordDto.motDePasse);
    return await this.userRepository.save(user);
  }
}
