# Gator - RSS Feed Aggregator CLI

Gator is a command-line interface tool built with **TypeScript** and **Node.js**. It allows users to register, follow their favorite RSS feeds, and run a background worker that periodically collects posts and saves them to a **PostgreSQL** database.

---

## 🛠️ Prerequisites

To run this CLI, you will need the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (Ensure the service is running)
- **npm** (to install dependencies)

---

## ⚙️ Configuration & Setup

### 1. The Configuration File

Gator looks for a configuration file in your Home Directory named `.gatorconfig.json`.

You should create this file at `~/.gatorconfig.json` with the following structure:

```json
{
  "db_url": "postgres://your_user:your_password@localhost:5432/gator_db",
  "current_user_name": "your_username"
}
```
