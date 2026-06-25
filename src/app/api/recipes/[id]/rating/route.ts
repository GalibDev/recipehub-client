import { connectDatabase } from '@/server/config/db';
import { handleApiError, json } from '@/server/api-response';
import { requireUser } from '@/server/auth';
import { Recipe } from '@/server/models';
import { assertObjectId } from '@/server/object-id';
import { ratingSchema } from '@/server/validations';
import { AppError } from '@/server/utils/app-error';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    await connectDatabase();
    const user = await requireUser();
    const { id } = await context.params;
    assertObjectId(id);
    const { rating } = ratingSchema.parse(await request.json());
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    const ratings = (recipe.ratings || []) as Array<{ userId: unknown; value: number }>;
    const existing = ratings.find((item) => String(item.userId) === String(user._id));

    if (existing) {
      existing.value = rating;
    } else {
      ratings.push({ userId: user._id, value: rating });
    }

    recipe.ratings = ratings as typeof recipe.ratings;
    recipe.ratingCount = ratings.length;
    recipe.ratingAverage = Number((ratings.reduce((total, item) => total + item.value, 0) / ratings.length).toFixed(1));
    await recipe.save();

    return json({
      ratingAverage: recipe.ratingAverage,
      ratingCount: recipe.ratingCount,
      userRating: rating,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
