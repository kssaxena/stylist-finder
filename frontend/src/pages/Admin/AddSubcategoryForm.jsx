import React, { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";

import InputBox from "../../components/Input";
import Button from "../../components/Button";

const AddSubCategoryForm = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  loading = false,
}) => {
  const fileInputRef = useRef(null);

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCategoryId("");
      setTitle("");
      setDescription("");
      setDisplayOrder(0);
      setImage(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a main category.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter the subcategory name.");
      return;
    }

    if (!image) {
      alert("Please upload a subcategory image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("displayOrder", Number(displayOrder) || 0);
    formData.append("image", image);

    await onSubmit(formData, categoryId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Subcategory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a main category and add a subcategory under it.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {/* Parent Category */}
          <div className="w-full py-3">
            <label
              htmlFor="parentCategory"
              className="mb-2 block text-sm font-medium capitalize text-gray-700"
            >
              Main Category
              <span className="text-red-500">*</span>
            </label>

            <select
              id="parentCategory"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-2 text-gray-700 outline-none transition hover:shadow-md focus:border-[#8B2954] focus:ring-1 focus:ring-[#8B2954]"
            >
              <option value="">Select a main category</option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  disabled={
                    category.status !== "Verified" ||
                    category.isActive === false
                  }
                >
                  {category.title}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-gray-500">
              The new subcategory will be added inside this category.
            </p>
          </div>

          {/* Subcategory name */}
          <InputBox
            label="Subcategory Name"
            placeholder="Enter subcategory name"
            name="subcategoryName"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <InputBox
            label="Description"
            placeholder="Enter subcategory description"
            name="subcategoryDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={false}
            textarea
            rows={4}
          />

          {/* Display order */}
          <InputBox
            label="Display Order"
            placeholder="Enter display order"
            type="number"
            name="displayOrder"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            required={false}
          />

          {/* Image */}
          <div className="w-full py-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subcategory Image
              <span className="text-red-500">*</span>
            </label>

            {!preview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-neutral-50 px-5 py-10 text-center transition hover:border-[#8B2954] hover:bg-[#8B2954]/5"
              >
                <FaCloudUploadAlt size={35} className="mb-3 text-[#8B2954]" />

                <p className="text-sm font-medium text-gray-700">
                  Click to upload subcategory image
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG or WEBP · Large images are compressed below 2MB
                </p>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-lg border border-gray-300">
                <img
                  src={preview}
                  alt="Subcategory Preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                >
                  <FaTimes size={16} />
                </button>

                <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3">
                  <FaImage className="text-[#8B2954]" />

                  <p className="truncate text-sm text-gray-600">
                    {image?.name}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Information */}
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">
              Subcategory Approval
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              This subcategory will be added under the selected main category
              and will follow your account's approval process.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
            <Button LabelName="Cancel" type="button" onClick={onClose} />

            <Button
              LabelName={loading ? "Adding..." : "Add Subcategory"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryForm;
