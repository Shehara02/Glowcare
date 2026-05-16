import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await productService.addReview(id, { rating, comment });
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-4xl font-bold text-primary mb-6">
              {formatCurrency(product.price)}
            </p>

            {/* Category & Type */}
            <div className="mb-6 space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Skin Type:</strong> {product.skinType.join(', ')}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsInWishlist(!isInWishlist)}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </Button>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Benefits:</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400">
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage */}
            {product.usage && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">How to Use:</h3>
                <p className="text-gray-600 dark:text-gray-400">{product.usage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Add Review */}
          <Card>
            <h2 className="font-heading text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Add a Review
            </h2>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="text-3xl focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={num <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-primary"
                  rows="4"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Submit Review
              </Button>
            </form>
          </Card>

          {/* Reviews List */}
          <Card>
            <h2 className="font-heading text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.user.name}
                        </p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
