# CareNest — API & Service Contracts

**Status:** Frozen (contracts defined; implementations phased)

Service contracts use **JSDoc typedefs** in `src/services/types.js`. Mock and Supabase implementations must match these signatures exactly.

---

## Type Definitions (`services/types.js`)

```js
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [displayName]
 * @property {string} [avatarUrl]
 * @property {string} authProvider - 'google' | 'apple' | 'mock'
 */

/**
 * @typedef {Object} CareRecipient
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth - ISO date string (YYYY-MM-DD)
 * @property {string} gender - 'male' | 'female' | 'other' | 'prefer_not_to_say'
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
 * @property {string} dateOfBirth - ISO date string
 * @property {string} gender
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
 * @property {number} [page=1]
 * @property {number} [limit=20]
 * @property {string} [search]
 * @property {'createdAt' | 'updatedAt'} [sortBy='createdAt']
 * @property {'asc' | 'desc'} [sortOrder='desc']
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {Array} data
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
```

---

## Error Classes (`services/errors.js`)

```js
/**
 * @typedef {Object} ServiceErrorOptions
 * @property {string} code
 * @property {string} message
 * @property {number} [statusCode]
 * @property {unknown} [cause]
 */

// ServiceError     — base class, code: 'SERVICE_ERROR'
// AuthError        — extends ServiceError, code: 'AUTH_ERROR'
// ValidationError  — extends ServiceError, code: 'VALIDATION_ERROR'
```

---

## Auth Service (`services/auth/authService.js`)

| Function           | Signature                                       | Returns                       |
| ------------------ | ----------------------------------------------- | ----------------------------- |
| `signInWithGoogle` | `() => Promise<ServiceResult<User>>`            | Mock: sessionStorage session  |
| `signInWithApple`  | `() => Promise<ServiceResult<User>>`            | Phase 10                      |
| `signOut`          | `() => Promise<ServiceResult<void>>`            | Clears session + client state |
| `getCurrentUser`   | `() => Promise<ServiceResult<User \| null>>`    |                               |
| `getSession`       | `() => Promise<ServiceResult<Session \| null>>` | Phase 10                      |

---

## Care Recipient Service (`services/profiles/careRecipientService.js`)

| Function              | Signature                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `getCareRecipient`    | `(id: string) => Promise<ServiceResult<CareRecipient>>`                                     |
| `createCareRecipient` | `(data: Omit<CareRecipient, 'id' \| 'createdAt'>) => Promise<ServiceResult<CareRecipient>>` |
| `updateCareRecipient` | `(id: string, data: Partial<CareRecipient>) => Promise<ServiceResult<CareRecipient>>`       |

---

## Caregiver Service (`services/profiles/caregiverService.js`)

| Function          | Signature                                                                           |
| ----------------- | ----------------------------------------------------------------------------------- |
| `getCaregiver`    | `(userId: string) => Promise<ServiceResult<Caregiver>>`                             |
| `createCaregiver` | `(data: Omit<Caregiver, 'id' \| 'createdAt'>) => Promise<ServiceResult<Caregiver>>` |
| `updateCaregiver` | `(id: string, data: Partial<Caregiver>) => Promise<ServiceResult<Caregiver>>`       |

---

## Notes Service (`services/notes/notesService.js`)

Pagination/search/sort in API shape from day one. Mock may ignore params; Supabase will use them.

| Function      | Signature                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `getNotes`    | `(careRecipientId: string, params?: PaginationParams) => Promise<ServiceResult<PaginatedResult<Note>>>` |
| `getNoteById` | `(id: string) => Promise<ServiceResult<Note>>`                                                          |
| `createNote`  | `(data: Omit<Note, 'id' \| 'createdAt' \| 'updatedAt'>) => Promise<ServiceResult<Note>>`                |
| `updateNote`  | `(id: string, data: Partial<Pick<Note, 'content'>>) => Promise<ServiceResult<Note>>`                    |
| `deleteNote`  | `(id: string) => Promise<ServiceResult<void>>`                                                          | Soft delete |

### PaginationParams defaults

```js
{ page: 1, limit: 20, search: '', sortBy: 'createdAt', sortOrder: 'desc' }
```

---

## Storage Adapter (`services/storage/sessionStorageAdapter.js`)

**Mock persistence only.** Never use `localStorage` for health information.

| Function | Signature                              |
| -------- | -------------------------------------- |
| `get`    | `(key: string) => string \| null`      |
| `set`    | `(key: string, value: string) => void` |
| `remove` | `(key: string) => void`                |
| `clear`  | `() => void`                           |

Replaced by Supabase in Phase 10. Services must not import this after swap.

---

## HTTP Client (`services/api/client.js`)

**Axios instance for Supabase Edge Functions only** — not for Supabase CRUD.

| Usage                     | Phase |
| ------------------------- | ----- |
| AI transcription endpoint | 11    |
| AI summary endpoint       | 11    |
| Twilio webhook proxy      | 11    |

Inject auth token from Supabase session in Phase 10.

---

## TanStack Query (Phase 10)

Server state hooks will wrap services:

```js
// hooks/useNotes.js — Phase 10 addition
// useQuery(['notes', careRecipientId, params], () => notesService.getNotes(...))
// useMutation for create/update/delete with cache invalidation
```

---

## Related Documents

- [Architecture.md](./Architecture.md)
- [Database.md](./Database.md)
- [AI.md](./AI.md)
