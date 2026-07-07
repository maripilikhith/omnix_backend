/**
 * Database seed script.
 * Populates the database with sample data for development.
 *
 * Usage: npm run seed
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { CourseModel } from '../src/features/courses/course.model.js';
import { ModuleModel } from '../src/features/modules/module.model.js';
import { TopicModel } from '../src/features/topics/topic.model.js';
import { StoryModel } from '../src/features/stories/story.model.js';
import { logger } from '../src/utils/logger.js';

const sampleCourses = [
  {
    courseSlug: 'calculus-iv-dynamics',
    title: 'Calculus IV: Dynamics',
    description: 'Master the intricate flows of dynamic systems in this advanced mathematical journey.',
    genre: 'Math',
    difficulty: 'Advanced',
    tags: ['calculus', 'dynamics', 'systems'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    isPublished: true,
    isFeatured: true,
    xpReward: 1500,
    instructorName: 'Dr. Jane Doe',
  },
  {
    courseSlug: 'neural-architectures',
    title: 'Neural Architectures',
    description: 'Dive deep into the structural paradigms of modern deep learning.',
    genre: 'Computer Science',
    difficulty: 'Intermediate',
    tags: ['AI', 'machine learning', 'neural networks'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    isPublished: true,
    isFeatured: false,
    xpReward: 1200,
    instructorName: 'Alan Turing AI',
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnquest';
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      CourseModel.deleteMany({}),
      ModuleModel.deleteMany({}),
      TopicModel.deleteMany({}),
      StoryModel.deleteMany({}),
    ]);
    logger.info('Cleared existing data');

    for (const courseData of sampleCourses) {
      const course = await CourseModel.create(courseData);

      const module = await ModuleModel.create({
        courseId: course._id,
        courseSlug: course.courseSlug,
        moduleSlug: `${course.courseSlug}-intro`,
        number: 1,
        title: `Introduction to ${course.title}`,
        description: `Foundation concepts for ${course.title}.`,
        isPublished: true,
      });

      const topic = await TopicModel.create({
        courseId: course._id,
        moduleId: module._id,
        courseSlug: course.courseSlug,
        topicSlug: `${course.courseSlug}-principles`,
        number: 1,
        title: `Core Principles of ${course.genre}`,
        description: 'The fundamental axioms and principles.',
        hasAssessment: true,
        xpReward: 500,
        isPublished: true,
      });

      await StoryModel.create({
        courseId: course._id,
        moduleId: module._id,
        topicId: topic._id,
        storySlug: `${course.courseSlug}-genesis`,
        title: `The Genesis of ${course.title}`,
        synopsis: 'A cinematic introduction.',
        order: 1,
        durationSeconds: 120,
        thumbnailUrl: course.thumbnailUrl,
        videoUrl: 'https://example.com/video.mp4',
      });

      logger.info(`Seeded course: ${course.title}`);
    }

    logger.info(`Seeding completed — ${sampleCourses.length} courses created`);
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed', { error: error.message });
    process.exit(1);
  }
}

seed();
