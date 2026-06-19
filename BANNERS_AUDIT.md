# Banner Images System Audit

**Date:** 2026-06-19  
**Status:** ✅ VERIFIED & FIXED

---

## System Overview

The banner system manages carousel banners displayed on the homepage. All images are stored in the database with URLs, NOT hardcoded.

---

## Architecture

### Database Layer
- **Table:** `banners`
- **Fields:**
  - `id` (primary key)
  - `image_url` (string) — URL to banner image (file path or Supabase URL)
  - `link_url` (string) — destination link when banner is clicked
  - `sort_order` (integer) — ordering for carousel
  - `active` (boolean) — whether banner is displayed

### Upload System
1. **ImageUpload Component** (`components/admin/ImageUpload.tsx`)
   - Client-side drag & drop or file selection
   - Uploads files to `/api/upload` endpoint
   - Stores image URLs in form hidden field
   - Supports multiple images with primary selection

2. **Upload API** (`app/api/upload/route.ts`)
   - POST endpoint for file uploads
   - Returns JSON with uploaded file URL
   - Error handling for failed uploads

3. **Form Submission** (`app/admin/(portal)/banners/BannerAddForm.tsx`)
   - Form uses ImageUpload component
   - Sends image_url and link_url to `addBanner` action
   - Shows success/error messages

4. **Server Action** (`app/admin/(portal)/banners/actions.ts`)
   - `addBanner()` — inserts banner with image_url from form
   - `deleteBanner()` — removes banner from database
   - `moveBanner()` — reorders banners
   - `toggleBannerActive()` — shows/hides banners
   - `updateBannerLink()` — updates destination link

### Display Layer
- **Admin Page** (`app/admin/(portal)/banners/page.tsx`)
  - Loads banners from database ordered by `sort_order`
  - Auto-seeds 3 default banners on first load
  - Shows banner thumbnails with links and controls
  - Supports drag reordering via move up/down buttons

- **Public Display** (`components/home/HeroBannerCarousel.tsx`)
  - Loads only `active` banners
  - Renders in carousel/slider on homepage
  - Links to destination URLs when clicked

---

## Issues Found & Fixed

### ✅ Issue #1: ImageUpload Filtering Images
**Status:** FIXED  
**Commit:** `7307dc4`

**Problem:**
```typescript
// BEFORE - Only accepted Supabase URLs
const [images, setImages] = useState<string[]>(
  defaultImages.filter((url) => url.includes('supabase'))
)
```

**Impact:**
- Default banner images (`/banner-main.png`, etc.) couldn't load
- Non-Supabase image URLs wouldn't display
- Upload functionality would work, but display would fail for non-Supabase URLs

**Fix:**
```typescript
// AFTER - Accepts all valid images
const [images, setImages] = useState<string[]>(
  defaultImages.filter(Boolean)
)
```

---

## Data Flow Verification

### Adding a New Banner
1. Admin navigates to `/admin/banners`
2. Selects image via drag & drop or file picker
3. ImageUpload component sends file to `/api/upload`
4. API returns image URL
5. Admin enters link URL (optional, defaults to `/shop`)
6. Form submits to `addBanner()` action
7. Banner inserted into database with:
   - `image_url` from upload
   - `link_url` from form
   - `sort_order` = max(sort_order) + 1
   - `active` = true (default)
8. Page revalidates, new banner appears immediately

✅ **Verified:** Image URLs stored in database, not hardcoded

### Displaying Banners
1. Homepage loads banners from database
2. Filters for `active = true` only
3. Orders by `sort_order`
4. Renders banner image with `<Image>` component
5. Links to `link_url` on click

✅ **Verified:** All banner data comes from database

### Uploading Images
1. File sent to `/api/upload` endpoint
2. API processes file upload
3. Returns JSON: `{ url: "...", error: null }`
4. Component adds URL to form field
5. URL persists in form until submission

✅ **Verified:** Upload endpoint working, returns URLs

---

## Image Sources Supported

✅ **Local Files** — `/banner-main.png` (default banners)  
✅ **Supabase URLs** — `https://...supabase.co/storage/...`  
✅ **External URLs** — Any valid image URL  
✅ **Uploaded Files** — Via `/api/upload` endpoint

All image sources now supported without filtering.

---

## Admin Controls

| Control | Function | Status |
|---------|----------|--------|
| Move up/down | Reorder banners via sort_order | ✅ |
| Eye icon | Toggle active flag (show/hide) | ✅ |
| Trash icon | Delete banner from database | ✅ |
| Upload | Add new banner with image | ✅ |
| Link input | Set destination URL | ✅ |

---

## Default Banners

When no banners exist, system auto-seeds 3 defaults:

```
1. image_url: /banner-main.png
   link_url: /shop
   
2. image_url: /banner-asus-aio.png
   link_url: /shop?category=pc&q=all-in-one
   
3. image_url: /banner-pc-build.jpg
   link_url: /shop?category=pc
```

These can be edited or deleted like any banner.

---

## Cache Invalidation

All banner operations revalidate:
- `/` (homepage — where banners display)
- `/admin/banners` (admin page)

Ensures changes appear immediately.

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Upload fails | Shows error message in form |
| Network error | "Network error during upload" message |
| No image selected | "Please upload a banner image" error |
| Database error | Redirects with error toast |
| Delete fails | Error toast notification |

---

## Security

✅ Image URLs stored in database (not hardcoded)  
✅ File uploads validated by `/api/upload` endpoint  
✅ Accepts images from any source (flexibility)  
✅ No arbitrary code execution risk  

---

## Testing Checklist

- [x] Upload new banner image
- [x] Image displays in admin list
- [x] Image displays on homepage
- [x] Reorder banners (move up/down)
- [x] Toggle active/inactive
- [x] Delete banner
- [x] Update link URL
- [x] Default banners load on first run
- [x] Images from different sources work

---

## Conclusion

**Status:** ✅ PRODUCTION READY

All banner images are:
- ✅ Stored in database (not hardcoded)
- ✅ Uploadable via admin form
- ✅ Readable from any image source
- ✅ Properly displayed with no filtering
- ✅ Manageable through admin interface

The system is fully functional and ready for production deployment.
