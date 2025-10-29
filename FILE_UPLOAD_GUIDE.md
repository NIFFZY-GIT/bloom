# File Upload Feature - User Guide

## 🎉 File Upload Now Available!

Both the **Categories** and **Places** admin pages now support direct image uploads with a beautiful file picker interface.

---

## ✨ New Features

### 📁 File Picker
- Click "📁 Choose Image" button to select images from your computer
- Instant upload to the server
- Real-time image preview
- Support for all common image formats (JPG, PNG, WebP, GIF)
- Maximum file size: 5MB

### 🖼️ Image Preview
- See your uploaded image immediately
- Remove and re-upload if needed
- Preview shows actual uploaded image

### 💾 Automatic Path Generation
- Image path is automatically filled after upload
- Images stored in proper directories:
  - Categories: `/public/images/categories/`
  - Places: `/public/images/places/`
- Unique filenames prevent conflicts

### ✏️ Manual Path Option
- Still supports manual path entry
- Useful for existing images or external URLs
- Just type the path directly in the text field

---

## 📝 How to Upload Images

### For Categories:

1. **Open Categories Page** → `/admin/categories`
2. **Click "➕ Add Category"** or edit existing category
3. **In the form:**
   - Click the **"📁 Choose Image"** button
   - Select an image from your computer
   - Wait for upload (shows "⏳ Uploading...")
   - Preview appears automatically
   - Image path is filled in automatically
4. **Fill other fields** and save

### For Places:

1. **Open Places Page** → `/admin/home_places`
2. **Click "➕ Add Place"** or edit existing place
3. **In the form:**
   - Click the **"📁 Choose Image"** button
   - Select an image from your computer
   - Wait for upload (shows "⏳ Uploading...")
   - Preview appears automatically
   - Image path is filled in automatically
4. **Fill other fields** and save

---

## 🎨 Image Requirements

### Recommended Sizes:
- **Category Images:** 500x500px (square format works best)
- **Place Images:** 800x600px or 1200x800px (landscape format)

### Supported Formats:
- ✅ JPEG/JPG
- ✅ PNG (supports transparency)
- ✅ WebP (modern, smaller file size)
- ✅ GIF

### File Size:
- **Maximum:** 5MB per image
- **Recommended:** 500KB - 1MB (for faster loading)

### Tips for Best Results:
- Use high-quality images
- Compress images before uploading (tools: TinyPNG, Squoosh)
- Use landscape orientation for places
- Use square format for categories
- Ensure good lighting and clear subjects

---

## 🚀 Upload Process Flow

```
1. Click "Choose Image" button
2. Select file from computer
3. File validation (type & size)
4. Upload to server
5. Generate unique filename
6. Store in proper directory
7. Return public URL
8. Display preview
9. Auto-fill path field
10. Ready to save!
```

---

## 🎯 Features Breakdown

### Upload Button
```
📁 Choose Image  →  Changes to  →  ⏳ Uploading...  →  Back to  →  📁 Choose Image
```

### Image Preview Box
- Shows uploaded image
- Click **✕** button to remove
- Displays actual size (max 400px width)
- Bordered, rounded corners

### Path Input Field
- Auto-populated after upload
- Can manually edit if needed
- Shows example placeholder
- Required field validation

---

## 🔧 Technical Details

### Upload Endpoint:
- **URL:** `/api/uploads`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `file`: Image file
  - `folder`: Target folder (categories/places)

### Storage Structure:
```
public/
└── images/
    ├── categories/
    │   ├── uuid-1.jpg
    │   ├── uuid-2.png
    │   └── ...
    └── places/
        ├── uuid-1.jpg
        ├── uuid-2.jpg
        └── ...
```

### Generated URLs:
- Categories: `/images/categories/[uuid].jpg`
- Places: `/images/places/[uuid].jpg`

---

## 💡 Usage Examples

### Example 1: Adding a Beach Category
1. Click "Add Category"
2. Upload beach image (e.g., `beautiful-beach.jpg`)
3. System generates: `/images/categories/abc123.jpg`
4. Fill name: "Beaches & Coastal"
5. Pick color: #1e40af
6. Save!

### Example 2: Adding a Place
1. Click "Add Place"
2. Upload place photo (e.g., `mirissa-beach.jpg`)
3. System generates: `/images/places/def456.jpg`
4. Select category: "Beaches & Coastal"
5. Enter description
6. Save!

---

## 🛡️ Error Handling

### File Too Large
- **Error:** "Image size must be less than 5MB"
- **Solution:** Compress image or choose smaller file

### Wrong File Type
- **Error:** "Please select an image file"
- **Solution:** Choose JPG, PNG, WebP, or GIF file

### Upload Failed
- **Error:** "Failed to upload image"
- **Solution:** Check internet connection, try again

### No File Selected
- No error, button just doesn't do anything
- **Solution:** Make sure to select a file

---

## 🎨 UI/UX Highlights

### Visual Feedback:
- ✅ Loading indicator during upload
- ✅ Success: Image preview appears
- ✅ Error: Red error message
- ✅ Remove button on preview

### Smooth Experience:
- No page reload needed
- Instant preview
- Easy to remove and re-upload
- Clear error messages

### Responsive Design:
- Works on desktop and mobile
- Touch-friendly buttons
- Preview scales properly

---

## 📋 Workflow Comparison

### Before (Manual):
1. Upload image via FTP/File Manager
2. Remember exact path
3. Open admin panel
4. Type path manually
5. Hope you didn't make typo
6. Save

### Now (With File Picker):
1. Click "Choose Image"
2. Select file
3. Path auto-filled
4. See preview
5. Save
✨ Much easier!

---

## 🔥 Advanced Features

### Remove & Re-upload:
- Click **✕** on preview to remove
- Upload button becomes active again
- Choose different image
- New preview replaces old one

### Manual Override:
- Upload image via picker
- Can still edit path manually if needed
- Useful for corrections or external URLs

### Edit Mode:
- Existing images show preview automatically
- Can replace image by uploading new one
- Old image remains until save (no accidental deletion)

---

## 📱 Mobile Support

The file upload works perfectly on mobile devices:
- Tap "Choose Image" button
- Camera roll opens
- Take new photo OR choose existing
- Upload and preview
- Save

---

## ✅ Best Practices

1. **Optimize Images:**
   - Use image compression tools
   - Reduce file size without losing quality
   - Faster uploads and page loads

2. **Consistent Sizing:**
   - Use similar dimensions for all category images
   - Use similar dimensions for all place images
   - Creates professional appearance

3. **Descriptive Filenames:**
   - Name files clearly before upload
   - Helps you remember what they are
   - Example: `beach-category.jpg`, `mirissa-place.jpg`

4. **Test Preview:**
   - Always check preview before saving
   - Ensure image looks good
   - Remove and re-upload if needed

5. **Backup Originals:**
   - Keep original high-res images
   - In case you need to re-upload
   - Good practice for any website

---

## 🎯 Quick Reference

| Action | Steps |
|--------|-------|
| Upload Image | Click "📁 Choose Image" → Select file → Wait |
| Remove Image | Click **✕** on preview |
| Manual Path | Type directly in path input field |
| Preview Image | Automatically shows after upload |
| Change Image | Remove existing → Upload new |

---

## 🚀 Ready to Use!

The file upload feature is now fully integrated and ready to use. Simply navigate to:

- **Categories:** `http://localhost:3001/admin/categories`
- **Places:** `http://localhost:3001/admin/home_places`

And start uploading your images with ease! 🎉

---

**No more FTP uploads or manual path entry - just click, select, and upload!** 📁✨
