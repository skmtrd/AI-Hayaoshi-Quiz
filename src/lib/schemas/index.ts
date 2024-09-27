import { z } from 'zod';

export const RoomSchema = z.object({
  id: z.string(),
  theme: z.string(),
  ownerId: z.string(),
  status: z.enum(['WAITING', 'PLAYING', 'FINISHED']),
  numberOfUser: z.number().nullable(),
  maxPlayer: z.number().nullable(),
  types: z.string().nullable(),
  currentSolverId: z.string().nullable(),
  inviteId: z.string(),
  difficulty: z.number().nullable(),
  answerTimeLimit: z.number().nullable(),
  thinkingTimeLimit: z.number().nullable(),
  currentQuestionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RoomWithResultsSchema = RoomSchema.extend({
  results: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      roomId: z.string(),
      questionId: z.string(),
      answer: z.string(),
      isCorrect: z.boolean(),
      time: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  comment: z.string(),
  roomId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SolverSchema = z.object({
  id: z.string(),
  isCorrect: z.boolean(),
  userId: z.string(),
  questionId: z.string(),
  answer: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResultSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  ratingDelta: z.number().nullable().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResultWithRoomSchema = ResultSchema.extend({
  room: RoomSchema,
});

// 新しく追加されたRoomUserスキーマ
export const RoomUserSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  isHost: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  rating: z.number().nullable(),
});

export const UserProfileSchema = UserSchema.extend({
  results: z.array(ResultWithRoomSchema),
});
