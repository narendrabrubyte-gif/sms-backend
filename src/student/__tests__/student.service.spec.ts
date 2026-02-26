import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../student.service';
import { EntityManager } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { StudentDto } from '../dto/student.dto';

describe('StudentService', () => {
  let service: StudentService;
  let entityManager: EntityManager;

  // 🔹 EntityManager mock
  const mockEntityManager = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. Service defined
  it('StudentService defined honi chahiye', () => {
    expect(service).toBeDefined();
  });

  // ✅ 2. createStudent success
  it('student create hona chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue(null);
    mockEntityManager.create.mockReturnValue({ email: 'test@gmail.com' });
    mockEntityManager.save.mockResolvedValue({ student_id: '1', email: 'test@gmail.com' });

    jest.spyOn(StudentDto, 'createFromEntity').mockReturnValue({
      student_id: '1',
      email: 'test@gmail.com',
    } as any);

    const result = await service.createStudent({
      email: 'test@gmail.com',
      first_name: 'Test',
      last_name: 'User',
    } as any);

    expect(result.email).toBe('test@gmail.com');
  });

  // ❌ 3. createStudent duplicate email
  it('duplicate email par error aani chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue({ email: 'test@gmail.com' });

    await expect(
      service.createStudent({ email: 'test@gmail.com' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  // ✅ 4. getStudentById success
  it('student id se milna chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue({ student_id: '1' });

    jest.spyOn(StudentDto, 'createFromEntity').mockReturnValue({
      student_id: '1',
    } as any);

    const result = await service.getStudentById('1');

    expect(result.student_id).toBe('1');
  });

  // ❌ 5. getStudentById not found
  it('student nahi mila to error aani chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue(null);

    await expect(service.getStudentById('99')).rejects.toThrow(
      NotFoundException,
    );
  });

  // ✅ 6. updateStudent
  it('student update hona chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue({ student_id: '1' });
    mockEntityManager.save.mockResolvedValue({ student_id: '1', first_name: 'Updated' });

    jest.spyOn(StudentDto, 'createFromEntity').mockReturnValue({
      student_id: '1',
      first_name: 'Updated',
    } as any);

    const result = await service.updateStudent('1', {
      first_name: 'Updated',
    } as any);

    expect(result.first_name).toBe('Updated');
  });

  // ❌ 7. deleteStudent not found
  it('delete me student na mile to error aani chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue(null);

    await expect(service.deleteStudent('5')).rejects.toThrow(
      NotFoundException,
    );
  });

  // ✅ 8. deleteStudent success
  it('student delete hona chahiye', async () => {
    mockEntityManager.findOne.mockResolvedValue({ student_id: '1' });
    mockEntityManager.remove.mockResolvedValue(true);

    await expect(service.deleteStudent('1')).resolves.not.toThrow();
  });
});
