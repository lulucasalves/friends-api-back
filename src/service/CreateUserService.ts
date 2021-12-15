import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { UsersRepositories } from '../repositories/UsersRepositories'

interface IUserRequest {
  name: string
  email: string
  admin?: boolean
  password: string
}

class CreateUserService {
  async execute({ name, email, admin = false, password }: IUserRequest) {
    const usersRepository = getCustomRepository(UsersRepositories)

    if (!email) {
      throw new Error('Email incorreto')
    }

    const passwordHash = await hash(password, 8)

    const userExist = await usersRepository.findOne({ email })

    if (userExist) {
      throw new Error('User exist')
    }

    const user = usersRepository.create({
      name,
      email,
      admin,
      password: passwordHash
    })

    await usersRepository.save(user)

    return user
  }
}

export { CreateUserService }
