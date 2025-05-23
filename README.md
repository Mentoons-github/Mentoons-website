# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Reward System Integration

### Overview

The project now includes a comprehensive reward system that allows users to earn points for various activities, level up through tiers (Bronze, Silver, Gold), and redeem rewards.

### Frontend Implementation

- Redux slice for state management (`src/redux/rewardSlice.ts`)
- UI components for displaying rewards (`src/components/rewards/`)
- Helper utilities (`src/utils/rewardHelper.ts`, `src/utils/rewardMiddleware.ts`)
- API endpoints for backend communication (`src/api/endpoints.ts`)

### Backend Implementation

The backend code is located in the `backend/` directory and includes:

#### Models

- `Reward.js`: Tracks user points, tier, and transaction history
- `RewardItem.js`: Defines redeemable reward items
- `RewardRedemption.js`: Tracks reward redemptions

#### Controllers

- `rewardController.js`: Handles user reward operations
- `adminRewardController.js`: Manages admin reward operations

#### Routes

- `/api/rewards/*`: User reward endpoints
- `/api/admin/rewards/*`: Admin reward endpoints

### Reward Points

Users earn points for various activities:

- **Authentication**: Registration (50 pts), Daily Login (5 pts), Profile Completion (100 pts)
- **Content**: Liking (2 pts), Commenting (5 pts), Sharing (10 pts), Status Creation (8 pts)
- **Social**: Join Group (15 pts), Follow User (5 pts)
- **Purchase**: Product Purchase (50 pts), Share Product (15 pts)
- **Sessions**: Book a Call (30 pts), Apply for Job (20 pts)
- **Content Consumption**: Audio Comics (15 pts), Podcasts (10 pts), Comics (20 pts)

### Reward Tiers

- **Bronze**: 0-499 points - Basic platform access
- **Silver**: 500-1499 points - Early access to content, discounts on digital products
- **Gold**: 1500+ points - Priority support, exclusive content, free monthly digital items

### How to Use

#### Frontend Integration

Add the RewardsProvider to your App.tsx file:

```jsx
import { RewardsProvider } from "@/context/RewardsContext";

function App() {
  return <RewardsProvider>{/* Your app content */}</RewardsProvider>;
}
```

To trigger rewards in your components:

```jsx
import { triggerReward } from "@/utils/rewardMiddleware";
import { RewardEventType } from "@/types/rewards";

// When user performs an action
triggerReward(RewardEventType.LIKE_POST, postId);
```

#### Backend Setup

1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.sample`
4. Start the server: `npm run dev`

### API Endpoints

#### User Endpoints

- `GET /api/rewards/user-rewards` - Get user's rewards data
- `POST /api/rewards/add-points` - Add points for an activity
- `POST /api/rewards/redeem` - Redeem a reward
- `GET /api/rewards/history` - Get points transaction history
- `GET /api/rewards/available-rewards` - Get available rewards
- `GET /api/rewards/redemptions` - Get user's redemption history

#### Admin Endpoints

- `POST /api/admin/rewards/items` - Create a reward item
- `GET /api/admin/rewards/items` - Get all reward items
- `PATCH /api/admin/rewards/items/:id` - Update a reward item
- `DELETE /api/admin/rewards/items/:id` - Delete a reward item
- `GET /api/admin/rewards/redemptions` - Get all redemptions
- `PATCH /api/admin/rewards/redemptions/:id/status` - Update redemption status
- `POST /api/admin/rewards/users/adjust-points` - Manually adjust user points
- `GET /api/admin/rewards/stats` - Get reward statistics

#   m e n t o o n s - - w e b s i t e 
 
 #   m e n t o o n s - - w e b s i t e 
 
 #   M e n t o o n s - w e b s i t e 
 
 
