import mongoose from 'mongoose';
import setupTestDB from '../jest/setupTestDB';
import { toJSON } from '../toJSON';
import paginate from './paginate';
import { IProject, IProjectDoc, IProjectModel, ITaskDoc, ITaskModel } from './paginate.types';

const projectSchema = new mongoose.Schema<IProjectDoc, IProjectModel>({
  name: {
    type: String,
    required: true,
  },
  milestones: {
    type: Number,
    default: 1,
  },
});

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.plugin(paginate);
projectSchema.plugin(toJSON);
const Project = mongoose.model<IProjectDoc, IProjectModel>('Project', projectSchema);

const taskSchema = new mongoose.Schema<ITaskDoc, ITaskModel>({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    ref: 'Project',
    required: true,
  },
});

taskSchema.plugin(paginate);
taskSchema.plugin(toJSON);
const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', taskSchema);

setupTestDB();

describe('paginate plugin', () => {
  describe('populate option', () => {
    test('should populate the specified data fields', async () => {
      const project = await Project.create({ name: 'Project One' });
      const task = await Task.create({ name: 'Task One', project: project._id });

      const taskPages = await Task.paginate({ _id: task._id }, { populate: 'project' });

      expect(taskPages.results[0]).toMatchObject({ project: { _id: project._id, name: project.name } });
    });
  });

  describe('sortBy option', () => {
    test('should sort results in ascending order using createdAt by default', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two' });
      const projectThree = await Project.create({ name: 'Project Three' });

      const projectPages = await Project.paginate({}, {});

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
    });

    test('should sort results in ascending order if ascending sort param is specified', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two', milestones: 2 });
      const projectThree = await Project.create({ name: 'Project Three', milestones: 3 });

      const projectPages = await Project.paginate({}, { sortBy: 'milestones:asc' });

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
    });

    test('should sort results in descending order if descending sort param is specified', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two', milestones: 2 });
      const projectThree = await Project.create({ name: 'Project Three', milestones: 3 });

      const projectPages = await Project.paginate({}, { sortBy: 'milestones:desc' });

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectThree.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectOne.name });
    });
  });

  describe('limit option', () => {
    const projects: IProject[] = [
      { name: 'Project One', milestones: 1 },
      { name: 'Project Two', milestones: 2 },
      { name: 'Project Three', milestones: 3 },
    ];
    beforeEach(async () => {
      await Project.insertMany(projects);
    });

    test('should limit returned results if limit param is specified', async () => {
      const projectPages = await Project.paginate({}, { limit: 2 });

      expect(projectPages.results).toHaveLength(2);
      expect(projectPages.results[0]).toMatchObject({ name: 'Project One' });
      expect(projectPages.results[1]).toMatchObject({ name: 'Project Two' });
    });
  });

  describe('page option', () => {
    const projects: IProject[] = [
      { name: 'Project One', milestones: 1 },
      { name: 'Project Two', milestones: 2 },
      { name: 'Project Three', milestones: 3 },
    ];
    beforeEach(async () => {
      await Project.insertMany(projects);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      const projectPages = await Project.paginate({}, { limit: 2, page: 2 });

      expect(projectPages.results).toHaveLength(1);
      expect(projectPages.results[0]).toMatchObject({ name: 'Project Three' });
    });
  });

  describe('projectBy option', () => {
    const projects: IProject[] = [
      { name: 'Project One', milestones: 1 },
      { name: 'Project Two', milestones: 2 },
      { name: 'Project Three', milestones: 3 },
    ];
    beforeEach(async () => {
      await Project.insertMany(projects);
    });

    test('should exclude a field when the hide param is specified', async () => {
      const projectPages = await Project.paginate({}, { projectBy: 'milestones:hide' });

      expect(projectPages.results[0]).not.toMatchObject({ milestones: expect.any(Number) });
    });

    test('should exclude multiple fields when the hide param is specified', async () => {
      const projectPages = await Project.paginate({}, { projectBy: 'milestones:hide,name:hide' });

      expect(projectPages.results[0]).not.toMatchObject({ milestones: expect.any(Number), name: expect.any(String) });
    });

    test('should include a field when the include param is specified', async () => {
      const projectPages = await Project.paginate({}, { projectBy: 'milestones:include' });

      expect(projectPages.results[0]).not.toMatchObject({ name: expect.any(String) });
      expect(projectPages.results[0]).toMatchObject({ milestones: expect.any(Number) });
    });

    test('should include multiple fields when the include param is specified', async () => {
      const projectPages = await Project.paginate({}, { projectBy: 'milestones:include,name:include' });

      expect(projectPages.results[0]).toHaveProperty('milestones');
      expect(projectPages.results[0]).toHaveProperty('name');
    });

    test('should always include id when the include param is specified', async () => {
      const projectPages = await Project.paginate({}, { projectBy: 'milestones:include' });

      expect(projectPages.results[0]).not.toMatchObject({ name: expect.any(String) });
      expect(projectPages.results[0]).toMatchObject({ id: expect.any(String), milestones: expect.any(Number) });
    });
  });
});
