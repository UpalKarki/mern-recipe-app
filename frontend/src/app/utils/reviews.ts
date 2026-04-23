// Utility functions for managing recipe reviews in localStorage

const STORAGE_KEY = "recipenest_reviews";

export interface Review {
  id: string;
  recipeId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export function getReviewsForRecipe(recipeId: number): Review[] {
  try {
    const allReviews = localStorage.getItem(STORAGE_KEY);
    const reviews: Review[] = allReviews ? JSON.parse(allReviews) : [];
    return reviews.filter((r) => r.recipeId === recipeId);
  } catch (error) {
    console.error("Error reading reviews:", error);
    return [];
  }
}

export function addReview(review: Omit<Review, "id" | "date">): boolean {
  try {
    const allReviews = localStorage.getItem(STORAGE_KEY);
    const reviews: Review[] = allReviews ? JSON.parse(allReviews) : [];

    const newReview: Review = {
      ...review,
      id: `${review.recipeId}-${Date.now()}`,
      date: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    return true;
  } catch (error) {
    console.error("Error adding review:", error);
    return false;
  }
}

export function getAllReviews(): Review[] {
  try {
    const allReviews = localStorage.getItem(STORAGE_KEY);
    return allReviews ? JSON.parse(allReviews) : [];
  } catch (error) {
    console.error("Error reading all reviews:", error);
    return [];
  }
}

export function formatReviewDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return "1 week ago";
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else if (diffDays < 60) {
    return "1 month ago";
  } else {
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}
