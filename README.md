# inventaro

## Introduction
Inventaro is a simple inventory web application for healthcare supplies, built by Jimmy Emanuelsson as a demo project. The application helps a healthcare center track stock levels, update balances, and receive warnings when supplies are running low.  

---

## Requirements / features
- Allow the user to create and list articles with name, quantity in stock, and unit (for example, `"face mask", 200, "pcs"`).  
- Enable updating the quantity when material is used or replenished.  
- Display a clear warning (for example, color coding) for articles with low stock levels.  
- Prevent the stock balance from becoming negative.  

## Main Technologies used
- **Backend:** Java (Spring Boot), CRUD for articles and a dedicated endpoint for updating stock balance  
- **Frontend:** React + Vite + TypeScript  
- **Database:** H2 (in-memory)  
- **Communication:** JSON
  
---

## Installation Instructions

1. Clone the repository
```bash
git clone https://github.com/jimmsi/inventaro.git
cd inventaro
```
2. Backend (Spring Boot)

Prerequisites
- Java 21 (JDK) – download from [Adoptium Temurin](https://adoptium.net/) or another OpenJDK provider (Oracle, Amazon Corretto, Azul Zulu, etc.)  
- Maven - [installation guide](https://maven.apache.org/install.html)

Start the backend:
```bash
cd backend
mvn clean spring-boot:run
```
The backend will run at http://localhost:8080.
It uses an in-memory H2 database with demo seed data that resets on restart.

3. Frontend (React + Vite)
Prerequisites
- Node.js - (https://nodejs.org/) (v18 or later recommended)
Installing Node.js also installs **npm** (Node Package Manager) by default.

Start the frontend:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at http://localhost:5173.

CORS is configured in the backend (CorsConfig.java) to allow requests from http://localhost:5173.
No proxy setup is required — the frontend communicates directly with the backend API.

---

## Git Strategy 

This project follows a simplified trunk-based development workflow. For a project of this size, feature branches, detailed issue-descriptions and pull requests are not strictly necessary. However, I chose to use them here to demonstrate how I normally work with Git in a structured and methodical way. 

- Single common branch: All development is integrated directly into main.
- Small, focused commits: Each commit addresses one purpose only (e.g., a fix or a feature, not both at the same time).
- Self-contained changes: No commit should break the build. Every commit should leave the system in a working state.

Commit messages: Written in English, present tense, and as concise as possible. If a commit is connected to an issue, the issue number is referenced (e.g., solves #2).

---

## Development workflow  
When building this application I applied a flow-first (vertical slice) strategy consistently across backend and frontend. Instead of developing layer by layer in isolation, each feature was implemented end-to-end in one flow — from data model, repository, and service logic to controller, tests, and finally the corresponding frontend components.

I chose to complete the backend first, still using this flow-first approach feature by feature, and then moved on to the frontend. This way the backend was stable and fully testable before the UI was connected.

The motivation for this strategy is that it allows each feature to be tested, demonstrated, and delivered incrementally, while keeping commits and pull requests tightly aligned with user stories (for example Create Article). For a short demo project, this approach makes progress more visible and ensures that even at an early stage, the application can showcase working functionality. 

---

## Backend design choices and architecture  
### Database choice  
For this demo I chose H2, an in-memory relational database.  
- **Advantages:** lightweight, requires no setup, integrates seamlessly with Spring Boot, resets automatically for tests and demos.  
- **Trade-off:** data is not persistent between restarts. This is acceptable for a demo, but in production a persistent database like PostgreSQL would be used.

### Layered architecture
The backend follows a layered architecture with clear separation of concerns:

- Controller – handles HTTP requests and responses.
- DTO (Data Transfer Objects) – define the data that flows in and out of the API, and handle validation.
- Service – contains the business logic of the application.
- Repository – provides database access through JPA.
- Database – stores the actual data.

This structure makes the codebase easier to understand, test, and maintain. Each layer has a single responsibility: controllers don’t mix in database logic, and services don’t deal with HTTP details. It also makes it simpler to extend or change parts of the application in the future (for example swapping database, adding new endpoints, or reusing business logic).

### Database schema  
The table `article` represents an item in the inventory.  

| Column             | Type    | Properties                           |  
|--------------------|---------|--------------------------------------|  
| id                 | UUID    | Primary key (auto-generated)         |  
| name               | VARCHAR | Not null                             |  
| quantity           | INT     | Not null, must not be negative       |  
| unit               | VARCHAR | Not null (e.g. "pcs", "box")         |  
| low_stock_threshold| INT     | Not null, threshold for low stock    |  

**Motivation for `low_stock_threshold`**  
To meet the requirement *“show a warning for low stock”*, I added a `low_stock_threshold` field.  
This allows each article to define its own threshold for when a warning should be triggered.  

Examples:  
- Face masks → `low_stock_threshold = 100`  
- Gloves → `200`  
- Thermometers → `2`  

A simpler design could have used a single hardcoded threshold (e.g. always `10`), but by storing the threshold per article the system is more flexible. It is also possible to update the threshold value later for an article if you notice that it was initially set too low or too high in practice. 

### Constructing update endpoints  
The backend defines two separate endpoints for updating an article:
- PUT /{id} – updates structural attributes: name, unit, and low stock threshold (but not quantity).
- PATCH /{id}/quantity – updates only the stock quantity.

The reasoning behind this split is that quantity changes (stock adjustments) are very different from updates to the article’s essential attributes.
- Changing quantity is an operational task that almost anyone in the organization might perform (e.g. a nurse or assistant who takes supplies from storage). For that reason, it makes sense to have a dedicated endpoint with potentially simpler access rules.
- Changing attributes like name, unit, or threshold values are decisions that affect the overall structure and logic of the system. These changes are less frequent and should be reserved for users with higher privileges, such as administrators or procurement managers.
Why not allow updating everything in a single PUT endpoint? Technically, that would be possible of course, but separating quantity ensures that stock adjustments do not accidentally slip in when structural changes (name, unit, or threshold) are made. In the end, it comes down to how strictly one wants to separate these types of updates.

Note: When creating a new article, both quantity and essential attributes can be set at once. This might appear to conflict with the separation of responsibilities, but one possible solution is to require admin-level permissions for creating new articles.

### A comment on DTOs and validation  
For input validation I used `Integer` in the DTOs together with `@NotNull`.  
This ensures that missing fields in the request body are properly rejected with a `400 Bad Request` instead of being silently defaulted to `0`.  

In the entity, however, I kept the fields as `int` since the corresponding database columns are `NOT NULL` and should always contain a value. This approach makes validation stricter at the API level while still keeping the database model clean and aligned with its constraints.  

### Tests  
I added integration tests using Spring Boot and MockMvc to verify:  
- Happy path scenarios (creating, updating, deleting, adjusting stock).  
- Validation errors return `400`.  
- Non-existing resources return `404`.  

---

## Frontend design choices and architecture

### Vite + React + TypeScript
I chose these technologies mainly because of prior experience. TypeScript fits my preference for structure and order — it helps keep track of types and reduces simple mistakes during development.

### ShadCN
ShadCN provides simple, clean, and modern UI components. Under the hood, it is Radix components styled with Tailwind. 

### Fetch API (instead of Axios)
I decided to use the native Fetch API for data fetching. For a small demo application, Fetch is sufficient and avoids extra dependencies, keeping the setup simple.

### Separation between service, page and "dumb" components
To structure the frontend I used a separation between service, page, and “dumb” components.
- articleService handles all API requests to the backend.
- ArticlesPage works as the coordinator. It decides when to open dialogs, when to show a toast, and how to update state based on backend responses.

ArticleForm / ArticleTable are dumb components.
- ArticleForm: a generic form component for both creating and editing articles. It takes props such as mode (create or edit) and callbacks for what happens on submit. The same component can therefore be reused in multiple contexts.
- ArticleTable: purely responsible for rendering the table. It doesn’t know about API calls or state management — instead, it triggers callbacks (onEdit, onUpdateQuantity, onDelete) and leaves it to ArticlesPage to handle the logic.

In this implementation, too much logic still lives inside ArticlesPage. Ideally, a page should remain thin — mostly responsible for layout — while data flow and logic are delegated to more specialized hooks or components. For the scope of this demo, I prioritized functionality, but I am aware of this trade-off.

---

## Error handling and validation
The application implements error handling and validation both in the backend and frontend.

### Backend
Request data is validated with Jakarta Bean Validation annotations:
- @NotBlank on article name and unit.
- @NotNull + @Min(0) on quantity and low stock threshold (to ensure no negative values and to catch missing fields).

The controller catches validation errors (MethodArgumentNotValidException) and returns a 400 Bad Request with the validation message. If an article with a given ID cannot be found, an IllegalArgumentException is thrown and mapped to 404 Not Found. Quantity updates are isolated in their own endpoint (PATCH /{id}/quantity), which further enforces that stock levels cannot go negative.

### Frontend
Forms use HTML validation (required, min={0}) to prevent empty or invalid inputs before submitting. If the backend rejects a request, error messages are surfaced in the UI:
- Inline error messages are displayed in ArticleForm.
- Toast notifications are used for feedback on failed operations (create, update, delete, or quantity changes).
Also, the frontend ensures quantity cannot drop below zero (decrement button disabled if quantity <= 0).

Together, this results in a system that handles invalid input and provides clear feedback. Validation rules prevent invalid data from being stored, and users receive responses when something goes wrong, either via inline messages in forms or toast notifications.

---

## What could have been better
There are several aspects I am aware of that could be improved in the current implementation:
- **Unique article names**: there is no validation preventing duplicate names when creating or updating articles.
- **Logging**: no logging is currently implemented; even basic INFO-level logging would improve observability.
- **Centralized error handling**: instead of handling exceptions locally in the controller, it would have been better to collect all error handling in a global @RestControllerAdvice.
- **CSS/Tailwind usage**: some styling is duplicated, and the Tailwind setup could be made more efficient and consistent.
- **Responsiveness**: the UI looks fine on larger screens and tablets, but there is no proper mobile layout yet.

## Possible further improvements  
Beyond the original requirements, the application could be extended:
- **User management and roles**: Adding authentication and authorization with Spring Security (e.g. JWT tokens with refresh support) would allow different access levels. For example, ordinary staff could adjust stock quantities, while only administrators could edit structural article data or create new items. This would make the system more realistic for real-world use in a healthcare setting.
- **TanStack Query in the frontend**: Currently, data fetching is handled manually with useEffect and local state. TanStack Query would simplify this by providing built-in caching, automatic refetching, and better loading/error state management. This would be especially valuable if the application grew larger and required more complex data flows.
- **Zod validation in the frontend**: Right now, forms rely on HTML validation and backend responses. Adding Zod schemas would make validation declarative and reusable in the frontend. This ensures consistent rules across the stack and prevents invalid requests from ever reaching the backend.
