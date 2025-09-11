# Inventaro

## Introduction 

Inventaro is a simple inventory web application for healthcare supplies made by Jimmy Emanuelsson.

Requirements

* Allow the user to create and list articles with name, quantity in stock, and unit (for example, 
"face mask", 200, "pcs").
* Enable updating the quantity when material is used or replenished.
* Display a clear warning (for example, color coding) for articles with low stock levels.
* Prevent the stock balance from becoming negative.

Technologies used

* Backend: Java (Spring Boot), CRUD for articles and an endpoint for updating stock balance.
* Frontend: React and TypeScript
* Database: H2
* Communication: JSON

## Build instructions 

## Development Workflow and Planning

## Database schema

The table `article` represents an item in the inventory.

| Column             | Type    | Properties                          |
|--------------------|---------|-------------------------------------|
| id                 | UUID    | Primary key (auto-generated)        |
| name               | VARCHAR | Not null                            |
| quantity           | INT     | Not null, must not be negative      |
| unit               | VARCHAR | Not null (e.g. "pcs", "box")        |
| low_stock_threshold| INT     | Not null, threshold for low stock   |

### Motivation for `low_stock_threshold`
To meet the requirement *"show a warning for low stock"*, I chose to add a field `low_stock_threshold`.  
This allows each article to have its own threshold value for when a warning should be displayed.

Examples:
- Face masks → `low_stock_threshold = 100`
- Gloves → `200`
- Thermometers → `2`

In a simpler implementation, I could have used a single hardcoded threshold (e.g. always 10),  
but by having this field in the model I make the system more flexible.

## Git Strategy 