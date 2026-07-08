/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [displayName]
 * @property {string} [avatarUrl]
 * @property {'google' | 'apple' | 'email'} authProvider
 */

/**
 * @typedef {Object} CareRecipient
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {'male' | 'female' | 'other' | 'prefer_not_to_say'} gender
 * @property {string} [healthDescription]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} Caregiver
 * @property {string} id
 * @property {string} userId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {'male' | 'female' | 'other' | 'prefer_not_to_say'} gender
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {'manual' | 'voice' | 'ai_summary'} NoteType
 */

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} careRecipientId
 * @property {string} authorId
 * @property {string} content
 * @property {NoteType} type
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} [page]
 * @property {number} [limit]
 * @property {string} [search]
 * @property {'createdAt' | 'updatedAt'} [sortBy]
 * @property {'asc' | 'desc'} [sortOrder]
 */

/**
 * @template T
 * @typedef {Object} PaginatedResult
 * @property {T[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 * @property {boolean} hasMore
 */

/**
 * @template T
 * @typedef {Object} ServiceResult
 * @property {T} [data]
 * @property {import('./errors.js').ServiceError} [error]
 */

export {};
