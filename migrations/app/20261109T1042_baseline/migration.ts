#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/00abff98e9bfe8f2a11881b99d5f410a737c2e6ecdd912e6b95bc0325fcc6174/contract';
import endContract from '../../snapshots/00abff98e9bfe8f2a11881b99d5f410a737c2e6ecdd912e6b95bc0325fcc6174/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Algorithm',
        columns: [
          col('algorithmImplementationId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('algorithmTypeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('enable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('link', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('metaDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { default: lit(0), codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AlgorithmImplementation',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('java', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('javaScript', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AlgorithmType',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('enable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('link', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('metaDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DataStructure',
        columns: [
          col('dataStructureImplementationId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('dataStructureTypeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('enable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('link', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('metaDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { default: lit(0), codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DataStructureImplementation',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('java', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('javaScript', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DataStructureType',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('enable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('link', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('metaDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Newsletter',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('avatar', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('settingsId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserFavoriteAlgorithm',
        columns: [
          col('algorithmId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'algorithmId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserFavoriteDataStructure',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('dataStructureId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'dataStructureId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserSetting',
        columns: [
          col('allowNotifications', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Algorithm',
        constraint: 'Algorithm_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Algorithm',
        constraint: 'Algorithm_link_key',
        columns: ['link'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AlgorithmType',
        constraint: 'AlgorithmType_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AlgorithmType',
        constraint: 'AlgorithmType_link_key',
        columns: ['link'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataStructure',
        constraint: 'DataStructure_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataStructure',
        constraint: 'DataStructure_link_key',
        columns: ['link'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataStructureType',
        constraint: 'DataStructureType_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataStructureType',
        constraint: 'DataStructureType_link_key',
        columns: ['link'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Newsletter',
        constraint: 'Newsletter_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Algorithm',
        index: 'Algorithm_algorithmImplementationId_idx_4f9f4551',
        columns: ['algorithmImplementationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Algorithm',
        index: 'Algorithm_algorithmTypeId_idx_c6bff3f0',
        columns: ['algorithmTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'DataStructure',
        index: 'DataStructure_dataStructureImplementationId_idx_71b5379a',
        columns: ['dataStructureImplementationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'DataStructure',
        index: 'DataStructure_dataStructureTypeId_idx_f0f25c07',
        columns: ['dataStructureTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_settingsId_idx_6654474f',
        columns: ['settingsId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserFavoriteAlgorithm',
        index: 'UserFavoriteAlgorithm_algorithmId_idx_bb4a2d7e',
        columns: ['algorithmId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserFavoriteAlgorithm',
        index: 'UserFavoriteAlgorithm_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserFavoriteDataStructure',
        index: 'UserFavoriteDataStructure_dataStructureId_idx_690b5a07',
        columns: ['dataStructureId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserFavoriteDataStructure',
        index: 'UserFavoriteDataStructure_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Algorithm',
        foreignKey: {
          name: 'Algorithm_algorithmImplementationId_fkey',
          columns: ['algorithmImplementationId'],
          references: { schema: 'public', table: 'AlgorithmImplementation', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Algorithm',
        foreignKey: {
          name: 'Algorithm_algorithmTypeId_fkey',
          columns: ['algorithmTypeId'],
          references: { schema: 'public', table: 'AlgorithmType', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DataStructure',
        foreignKey: {
          name: 'DataStructure_dataStructureImplementationId_fkey',
          columns: ['dataStructureImplementationId'],
          references: { schema: 'public', table: 'DataStructureImplementation', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DataStructure',
        foreignKey: {
          name: 'DataStructure_dataStructureTypeId_fkey',
          columns: ['dataStructureTypeId'],
          references: { schema: 'public', table: 'DataStructureType', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'User',
        foreignKey: {
          name: 'User_settingsId_fkey',
          columns: ['settingsId'],
          references: { schema: 'public', table: 'UserSetting', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserFavoriteAlgorithm',
        foreignKey: {
          name: 'UserFavoriteAlgorithm_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserFavoriteAlgorithm',
        foreignKey: {
          name: 'UserFavoriteAlgorithm_algorithmId_fkey',
          columns: ['algorithmId'],
          references: { schema: 'public', table: 'Algorithm', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserFavoriteDataStructure',
        foreignKey: {
          name: 'UserFavoriteDataStructure_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserFavoriteDataStructure',
        foreignKey: {
          name: 'UserFavoriteDataStructure_dataStructureId_fkey',
          columns: ['dataStructureId'],
          references: { schema: 'public', table: 'DataStructure', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
