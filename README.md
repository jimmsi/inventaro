# Inventaro

## Introduction
Inventaro is a simple inventory web application for healthcare supplies, built by Jimmy Emanuelsson as a demo project.  
The application helps a healthcare center track stock levels, update balances, and receive warnings when supplies are running low.  

---

## Requirements
- Allow the user to create and list articles with name, quantity in stock, and unit (for example, `"face mask", 200, "pcs"`).  
- Enable updating the quantity when material is used or replenished.  
- Display a clear warning (for example, color coding) for articles with low stock levels.  
- Prevent the stock balance from becoming negative.  

---

## Technologies used
- **Backend:** Java (Spring Boot), CRUD for articles and a dedicated endpoint for updating stock balance  
- **Frontend:** React and TypeScript  
- **Database:** H2 (in-memory)  
- **Communication:** JSON

## Git Strategy 

This project follows a simplified trunk-based development workflow. For a project of this size, feature branches, detailed issue-descriptions and pull requests are not strictly necessary. However, I chose to use them here to demonstrate how I normally work with Git in a structured and methodical way. 

- Single common branch: All development is integrated directly into main.
- Small, focused commits: Each commit addresses one purpose only (e.g., a fix or a feature, not both at the same time).
- Self-contained changes: No commit should break the build. Every commit should leave the system in a working state.

Commit messages: Written in English, present tense, and as concise as possible. If a commit is connected to an issue, the issue number is referenced (e.g., solves #2).

---

## Backend design choices and architecture  

### Database choice  
For this demo I chose H2, an in-memory relational database.  
- **Advantages:** lightweight, requires no setup, integrates seamlessly with Spring Boot, resets automatically for tests and demos.  
- **Trade-off:** data is not persistent between restarts. This is acceptable for a demo, but in production a persistent database like PostgreSQL would be used.  

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

A simpler design could have used a single hardcoded threshold (e.g. always `10`), but by storing the threshold per article the system is more flexible.  

### Development workflow  
When organizing the backend, I considered two strategies:  

- **Layer-first:** build repositories, then services, then controllers. This separates concerns clearly, but features remain unfinished until all layers are in place.  
- **Flow-first (vertical slice):** implement one feature at a time across all backend layers (entity, repository, service, controller and tests). This way, a feature can be tested and demonstrated as soon as it is finished.  

For this project I used the **flow-first** approach.  
The goal was to finish small end-to-end features step by step, which works well for a short demo. Many issues represent a user story in some way (for example *Create Article*), and commits/PRs follow that structure.   

### Constructing update endpoints  
I chosed to separate **metadata updates** from **stock updates**:  

- `PUT /articles/{id}` updates metadata (`name`, `unit`, `lowStockThreshold`).  
- `PATCH /articles/{id}/quantity` adjusts stock quantity.  

The reason was that stock updates have domain-specific rules (for example, preventing negative values). By separating them, metadata can be updated safely without accidentally changing stock levels, and stock can be adjusted through a dedicated flow with its own validation.  

### A comment on DTOs and validation  
For input validation I used `Integer` in the DTOs together with `@NotNull`.  
This ensures that missing fields in the request body are properly rejected with a `400 Bad Request` instead of being silently defaulted to `0`.  

In the entity, however, I kept the fields as `int` since the corresponding database columns are `NOT NULL` and should always contain a value. This approach makes validation stricter at the API level while still keeping the database model clean and aligned with its constraints.  

### Tests  
I added integration tests using Spring Boot and MockMvc to verify:  
- Happy path scenarios (creating, updating, deleting, adjusting stock).  
- Validation errors return `400`.  
- Non-existing resources return `404`.  

Tests provide confidence that the API works end-to-end, and in a demo context they show that I care about robustness and correctness.  

---

## Possible further improvements  
Currently, the `isLowStock` logic (`quantity < lowStockThreshold`) is handled on the frontend.  
This keeps the backend focused on business rules (such as preventing negative stock levels) and avoids mixing persistence with presentation concerns.  

As a possible extension, the backend could expose a convenience field `isLowStock` in the API response via a response DTO. This would simplify frontend development and ensure consistent logic across multiple clients (e.g. web and mobile). For this demo project, I decided to keep things simple and let the frontend handle the warning logic. 
