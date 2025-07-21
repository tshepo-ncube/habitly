import React, { useState } from "react";
import { ArrowLeft, Star, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { User } from "../types";

interface SupportPageProps {
  user: User;
}

const SupportPage: React.FC<SupportPageProps> = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;
      if (image) {
        const imageRef = ref(
          storage,
          `support-tickets/${user.id}/${Date.now()}-${image.name}`
        );
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "supportTickets"), {
        userId: user.id,
        email: user.email,
        title,
        description,
        rating,
        imageUrl,
        createdAt: Timestamp.fromDate(new Date()),
      });

      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error submitting ticket: ", error);
      alert("There was an error submitting your ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 relative">
        {!showSuccessMessage && (
          <Link
            to="/"
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Support, Feedback & Feature Request
          </h1>
          <p className="text-gray-500 mt-2 dark:text-gray-300">
            Submit a ticket, rate the app, or upload a screenshot/image.
          </p>
        </div>

        {showSuccessMessage ? (
          <div className="text-center p-6 bg-green-100/50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-xl">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
              Thank you for your feedback!
            </h2>
            <p className="text-green-700 mt-1 dark:text-green-300">
              Your ticket has been submitted. 💜
            </p>
            <button
              onClick={handleBackToHome}
              className="mt-4 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Back to home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g., 'Bug in Progress tab'"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Describe your issue, feedback, or suggestion in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Screenshot/Image (optional)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageSelect}
                  accept="image/*"
                />
                {image ? (
                  <p className="text-green-600 dark:text-green-400">
                    {image.name}
                  </p>
                ) : (
                  <div className="text-gray-500 dark:text-gray-300">
                    <ImageIcon
                      size={40}
                      className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
                    />
                    <p>
                      Drag & drop an image here, or{" "}
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        click to select
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Rate the us <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`cursor-pointer transition-colors ${
                      rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
