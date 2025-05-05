"use server";

import { auth } from "@/auth";
import connectDB from "@/db/connectDB";
import { Blog } from "@/db/models/blog.model";
import cloudinary from "@/lib/cloudinary";
import { createBlogSchema } from "@/lib/zod/createBlogSchema";
import { z } from "zod";

export const addBlog = async (data: z.infer<typeof createBlogSchema>) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        ok: false,
        error: "Not Authenticated"
      }
    }

    // Validate input data using zod schema
    const validatedData = createBlogSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        ok: false,
        error: validatedData.error.message || "Invalid blog data"
      };
    }

    // Connect to DB
    await connectDB();

    // If image is provided, upload it to Cloudinary
    let imageUrl = "";
    if (validatedData.data.image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(validatedData.data.image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return {
          ok: false,
          error: "Image upload failed"
        };
      }
    }

    // Create the blog entry in the database
    await Blog.create({
      title: validatedData.data.title,
      shortDescription: validatedData.data.shortDescription,
      description: validatedData.data.description,
      image: imageUrl,
      user: session.user._id, // Ensure session.user._id is safe to use
    });

    return {
      ok: true,
    };

  } catch (error) {
    console.error("Error in addBlog:", error);
    return {
      ok: false,
      error: "Blog creation failed due to a server error"
    };
  }
}


// Update Blog function
export const updateBlog = async (data: { title: string, shortDescription: string, description: string, image: string, blogId: string }) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        ok: false,
        error: "Not Authenticated"
      }
    }

    const { title, shortDescription, description, blogId, image } = data;

    // Connect to the database
    await connectDB();

    // Check if the blog exists and if the user is authorized to update it
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return {
        ok: false,
        error: "Blog not found"
      };
    }

    // Ensure the user is the one who created the blog (Authorization check)
    if (blog.user._id.toString() !== session.user._id) {
      console.log("blog.user._id.toString()", blog.user._id.toString());
      console.log("data.user", session.user);
      console.log("blog.user._id.toString() !== data.user", blog.user._id.toString() !== session.user._id);


      return {
        ok: false,
        error: "You are not authorized to edit this blog"
      };
    }

    // Prepare dynamic update object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (title) updateData.title = title;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (description) updateData.description = description;

    // Handle image upload if provided
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        if (!uploadResponse) {
          return {
            ok: false,
            error: "Failed to upload image"
          };
        }
        updateData.image = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return {
          ok: false,
          error: "Failed to upload image"
        };
      }
    }

    // If no data to update, return an error
    if (Object.keys(updateData).length === 0) {
      return {
        ok: false,
        error: "Nothing to update"
      };
    }

    // Perform the update
    await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    return {
      ok: true,
    };
  } catch (error) {
    console.error("Error in updateBlog:", error);
    return {
      ok: false,
      error: "Internal Server Error"
    };
  }
}

export const deleteBlog = async (id: string) => {
  try {
    await connectDB();

    // Delete the blog entry
    const result = await Blog.deleteOne({ _id: id });

    if (!result.deletedCount) {
      return {
        ok: false,
        error: "Blog not found"
      };
    }

    return {
      ok: true
    };
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return {
      ok: false,
      error: "Blog deletion failed due to a server error"
    };
  }
}

export const addComment = async (blogId: string, comment: string) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return {
        ok: false,
        error: "Not Authenticated"
      }
    }

    await Blog.findByIdAndUpdate(blogId, { $push: { comments: { text: comment, user: session.user._id, createdAt: new Date() } } }, { new: true });

    return {
      ok: true
    };
  } catch (error) {
    console.error("Error in addComment:", error);
    return {
      ok: false,
      error: "Comment creation failed due to a server error"
    };
  }
}