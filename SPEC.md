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
  "bgImageUrl": "String (optional, URL of the item's AI-generated background)",
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
  - The board displays all available tags on each card (up to six) and supports filtering by tag.
- `services/`:
  - `api.js`: `fetch`/`axios` functions for backend REST calls.

### 4.2. User Flow

1. **Initial Load:** Fetch all items from API and render them in a responsive card grid.
2. **Add Item:** User inputs text in form -> `POST` request sent -> Backend tags with AI & saves -> UI re-renders updated list.
3. **Filter:** Typing or selecting a tag in the board search, or clicking a tag on a card, filters the already-loaded items in the client. Search matches tag text without case sensitivity; one query is active at a time, and clearing it restores the full collection. All tags are searchable, including tags displayed on cards.

## 5. Future Roadmap

Features are organized into phases. Each phase should be completed and tested before moving to the next.

### Phase 1: Strengthen the Spring Boot Foundation
- Add request DTOs and input validation for item creation and updates.
- Add centralized exception handling with consistent API error responses.
- Add pagination and sorting to `GET /api/items`.
- Write unit tests for services and integration tests for REST endpoints and MongoDB.

### Phase 2: Make AI Tagging Reliable
- Move AI provider credentials and model settings to environment-based configuration.
- Require structured AI responses and validate the returned tags.
- Add request timeouts and clear error handling for AI provider failures.
- Allow users to edit tags or request new tag suggestions.

### Phase 3: Add Semantic Search
- Generate embeddings for inspiration items.
- Add an endpoint to find items with similar meaning, even when they do not share the same tags.
- Display similar items in the frontend.
- Evaluate a vector-search solution compatible with the chosen database and deployment environment.

### Phase 4: Add Asynchronous AI Processing
- Save new items before starting AI tagging.
- Track tagging status, such as `PENDING`, `COMPLETED`, or `FAILED`.
- Process tagging asynchronously and let the frontend display the current status.
- Add a way to retry failed tagging requests.

### Phase 5: Prepare for Real-World Use
- Add user accounts and secure endpoints with Spring Security.
- Ensure each user can only access their own items.
- Add Docker-based local setup, health checks, and basic application logging.
- Add a CI workflow to run backend and frontend tests on each change.

### Phase 6: Generate AI Backgrounds

Generate an optional visual background for an inspiration item based on its content. The user can request a background after creating an item and regenerate it when desired.

- Add a `BackgroundGenerationService` that calls an image-generation provider. Keep provider credentials in environment-based configuration and never expose them to the frontend.
- Build the generation prompt from the item's content, with appropriate length limits and instructions to produce a clean background that keeps text readable.
- Store the generated image in an image or object-storage service and save its URL in `bgImageUrl`; do not store image bytes in MongoDB.
- Expose an endpoint such as `POST /api/items/{id}/background` to request generation. Return the updated item or its generation status.
- Handle provider errors and timeouts explicitly, and allow users to retry failed requests.
- Update `ItemCard` to show the background when available and retain a readable fallback when generation has not completed or no image is available.
- Add tests for prompt construction, provider failures, persistence of the image URL, and the API endpoint.
- If generation makes requests too slow for a normal HTTP response, process it asynchronously and track its status, building on Phase 4.
