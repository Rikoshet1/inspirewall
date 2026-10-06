# 📋 PRD - InspireWall (Smart Inspiration Board)

## 1. Project Overview
**InspireWall** is a personal inspiration board application that allows users to collect, manage, and categorize quotes, insights, and thoughts. The system integrates with an AI model for automatic content tagging and displays the data in a modern, card-based client interface.

## 2. Architecture & Directory Structure
The system is built on a completely decoupled architecture:

- **`backend/`**: A **Java & Spring Boot** REST API server connected to **MongoDB**.
- **`frontend/`**: A **React** web application (powered by Vite).

```text
inspirewall/
├── SPEC.md
├── backend/
└── frontend/
```

## 3. Technical Specification - Backend (Spring Boot & MongoDB)

### 3.1. Data Model (Entity: `InspirationItem`)
Defined under `com.inspirewall.model.InspirationItem` stored in MongoDB:

```json
{
  "_id": "String (ObjectId)",
  "content": "String (required)",
  "author": "String (optional, default: Anonymous)",
  "tags": ["String"],
  "bgImageUrl": "String (optional, for future AI image generation)",
  "createdAt": "LocalDateTime"
}
```

### 3.2. Repository Layer

- `InspirationRepository` interface extending `MongoRepository<InspirationItem, String>`.
- Custom derived query method: `findByTagsContaining(String tag)` for tag filtering.

### 3.3. Service Layer & AI Integration

- **`AiTaggingService`**: Responsible for calling an external AI API (e.g., Gemini/OpenAI API) to extract 3–5 relevant tags based on the item's `content`.
- **`InspirationService`**:
  - Upon item creation: Receives content and author, calls `AiTaggingService` to extract tags, merges any user-provided manual tags, and saves the document into MongoDB.
  - Fetching all items or filtering by a specific tag.

### 3.4. REST API Endpoints (`InspirationController`)

- `GET /api/items` – Retrieve all items (sorted by creation date descending).
- `GET /api/items/search?tag={tag}` – Retrieve items containing a specific tag.
- `POST /api/items` – Add a new item (accepting `content`, `author`, and optional initial tags in request body).
- `DELETE /api/items/{id}` – Delete an item by ID.

### 3.5. Security & CORS Configuration

- Enable `@CrossOrigin(origins = "http://localhost:5173")` to allow seamless communication from the React frontend.

## 4. Technical Specification - Frontend (React)

### 4.1. Structure in `frontend/src/`

- `components/`:
  - `ItemCard.jsx`: Displays content, author, tags, and date.
  - `ItemForm.jsx`: Form to submit a new quote/thought.
  - `TagFilter.jsx`: Tag bar to filter items on the board.
- `services/`:
  - `api.js`: `fetch`/`axios` functions for backend REST calls.

### 4.2. User Flow

1. **Initial Load:** Fetch all items from API and render them in a responsive card grid.
2. **Add Item:** User inputs text in form -> `POST` request sent -> Backend tags with AI & saves -> UI re-renders updated list.
3. **Filter:** Clicking a tag filters displayed items via backend search endpoint.
