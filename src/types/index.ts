export type Role = 'user' | 'admin';

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  isBlocked?: boolean;
  isPremium?: boolean;
  createdAt?: string;
};

export type Recipe = {
  _id: string;
  recipeName: string;
  recipeImage: string;
  category: string;
  cuisineType: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  preparationTime: number;
  ingredients: string[];
  instructions: string[];
  authorId?: string;
  authorName: string;
  authorEmail: string;
  likesCount: number;
  liked?: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  userRating?: number;
  isFeatured: boolean;
  status?: string;
  price?: number;
  createdAt?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
};

export type Favorite = {
  _id: string;
  recipeId: Recipe | null;
  addedAt: string;
};

export type Payment = {
  _id: string;
  userEmail: string;
  userId?: Pick<User, '_id' | 'name' | 'email'>;
  amount: number;
  recipeId?: Recipe | null;
  type?: 'premium' | 'recipe';
  transactionId: string;
  checkoutSessionId?: string;
  paymentStatus: string;
  paidAt: string;
};

export type Report = {
  _id: string;
  recipeId?: Recipe | null;
  reporterEmail: string;
  reason: string;
  status: string;
  createdAt: string;
};

export type DashboardStats = {
  recipes: number;
  favorites: number;
  likedRecipes: number;
  likes: number;
  purchases: number;
};

export type AdminStats = {
  users: number;
  recipes: number;
  premium: number;
  reports: number;
};
