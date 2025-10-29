# Admin Panel - Quick Start Guide

## 🎯 Overview

Two new admin pages have been created to manage categories and places for your homepage journey selector.

---

## 📂 Admin Pages Created

### 1. **Categories Management**
**URL:** `/admin/categories`

**Features:**
- ✅ View all categories in a grid layout
- ✅ Add new categories with form validation
- ✅ Edit existing categories
- ✅ Delete categories (with cascade delete warning)
- ✅ Preview category colors and gradients
- ✅ Responsive design

**Fields:**
- Category Name
- Image Path (path to category image)
- Color (color picker)
- Background Gradient (CSS gradient)
- Description
- Animation Type (dropdown)

---

### 2. **Places Management**
**URL:** `/admin/home_places`

**Features:**
- ✅ View all places in a grid layout
- ✅ Filter places by category
- ✅ Add new places
- ✅ Edit existing places
- ✅ Delete places
- ✅ Category badge display
- ✅ Place counter
- ✅ Responsive design

**Fields:**
- Place Name
- Category (dropdown from existing categories)
- Image Path (path to place image)
- Description

---

## 🚀 How to Access

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin panel:**
   - Categories: `http://localhost:3000/admin/categories`
   - Places: `http://localhost:3000/admin/home_places`

3. **Access from Admin Sidebar:**
   - Click "Add Categories" in the admin sidebar
   - Click "Add Places" in the admin sidebar

---

## 📝 Step-by-Step Usage

### Adding a New Category:

1. Go to `/admin/categories`
2. Click the "➕ Add Category" button
3. Fill in the form:
   - **Name:** e.g., "Beaches & Coastal"
   - **Image:** Upload image to `/public/images/categories/` first, then enter path like `/images/categories/beaches.png`
   - **Color:** Select a color using the color picker
   - **Background Gradient:** Enter CSS gradient like `linear-gradient(135deg, #1e40af, #3b82f6)`
   - **Animation:** Select from dropdown (waves, forest, wildlife, etc.)
   - **Description:** Enter a brief description
4. Click "Create Category"

### Adding a New Place:

1. Go to `/admin/home_places`
2. Click the "➕ Add Place" button
3. Fill in the form:
   - **Name:** e.g., "Mirissa Beach"
   - **Category:** Select from dropdown (must create categories first!)
   - **Image:** Upload image to `/public/images/places/` first, then enter path like `/images/places/mirissa.png`
   - **Description:** Describe the place
4. Click "Create Place"

### Editing:

1. Find the item you want to edit
2. Click the "✏️ Edit" button
3. Update the fields in the modal
4. Click "Update Category" or "Update Place"

### Deleting:

1. Find the item you want to delete
2. Click the "🗑️ Delete" button
3. Confirm the deletion in the popup

---

## 📁 File Structure

```
src/
├── app/
│   └── admin/
│       ├── categories/
│       │   ├── page.tsx              ← Categories admin page
│       │   └── Categories.module.css ← Styles
│       └── home_places/
│           ├── page.tsx              ← Places admin page
│           └── Places.module.css     ← Styles
├── components/
│   └── admin/
│       └── AdminSidebar.tsx          ← Updated with new links
└── Types/
    └── index.ts                      ← Type definitions
```

---

## 🎨 Image Upload Process

### For Categories:
1. Prepare your category image (recommended: 500x500px, PNG or JPG)
2. Upload to: `/public/images/categories/`
3. Enter path in form: `/images/categories/your-image.png`

### For Places:
1. Prepare your place image (recommended: 800x600px, PNG or JPG)
2. Upload to: `/public/images/places/`
3. Enter path in form: `/images/places/your-image.png`

---

## 💡 Tips

1. **Create Categories First:** Places require existing categories
2. **Use Descriptive Names:** Makes filtering and management easier
3. **Test Image Paths:** Make sure images are uploaded before saving
4. **Category Colors:** Choose colors that match your brand
5. **Gradients:** Use online gradient generators for CSS gradients
6. **Responsive Images:** Optimize images before uploading

---

## 🔧 Gradient Generator Tools

Use these tools to create CSS gradients:
- https://cssgradient.io/
- https://www.colorzilla.com/gradient-editor/
- https://coolors.co/gradient-maker

---

## ⚠️ Important Notes

1. **Deleting Categories:** Will also delete all associated places (CASCADE)
2. **Image Paths:** Must start with `/images/`
3. **Validation:** All fields marked with * are required
4. **Database:** Make sure you've run the SQL setup from `sample_data.sql`

---

## 🎯 Next Steps

1. **Populate Categories:** Add all 11 categories from the sample data
2. **Add Places:** Add places for each category
3. **Test Frontend:** Visit the homepage to see your changes
4. **Customize:** Adjust colors, gradients, and descriptions as needed

---

## 🐛 Troubleshooting

### Images Not Showing?
- Check file path is correct
- Ensure image exists in `/public/images/` folder
- Verify path starts with `/images/` not `/public/images/`

### Can't Create Place?
- Make sure at least one category exists
- Verify category ID is valid
- Check console for error messages

### Changes Not Appearing?
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check if database was updated
- Verify API routes are working

---

## 📞 Need Help?

Check the following files for reference:
- `SETUP_GUIDE.md` - Comprehensive setup guide
- `sample_data.sql` - Sample data to populate database
- Console logs in browser DevTools for errors

---

**Happy Managing! 🚀**
