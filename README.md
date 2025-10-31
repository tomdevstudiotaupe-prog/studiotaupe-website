# Studio Taupe App Showcase

A modern, responsive website for showcasing apps at `app.studiotaupe.com`.

## 🚀 Features

- **Modern Design**: Clean and professional design that matches the Studio Taupe brand
- **Responsive**: Works perfectly on desktop, tablet and mobile
- **Smooth Animations**: Subtle animations for better user experience
- **SEO-friendly**: Well-structured for search engines
- **Fast Loading**: Optimized for quick load times

## 📁 File Structure

```
App.StudioTaupe.com/
├── index.html          # Main page
├── styles.css          # Styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Customization

### Adding/Editing Apps

Open `index.html` and look for the `apps-grid` section. Add new app cards:

```html
<div class="app-card">
    <div class="app-image">
        <div class="app-placeholder">📱</div>
        <!-- Or use a real image: -->
        <!-- <img src="path/to/app-image.jpg" alt="App Name"> -->
    </div>
    <div class="app-content">
        <h3>Your App Name</h3>
        <p>Description of your app</p>
        <div class="app-tags">
            <span class="tag">iOS</span>
            <span class="tag">Android</span>
        </div>
        <a href="#" class="app-link">Learn more</a>
    </div>
</div>
```

### Adjusting Colors

The colors are defined in `styles.css`. Look for the `:root` selector or the taupe colors:

```css
/* Taupe colors */
--taupe-50: #f8f7f4;
--taupe-500: #b99d8b;
--taupe-700: #9d755d;
```

### Contact Information

Update the contact information in `index.html`:

```html
<div class="contact-item">
    <strong>Email:</strong>
    <a href="mailto:your-email@example.com">your-email@example.com</a>
</div>
```

## 🌐 Deployment

### Local Testing

1. Download all files to your computer
2. Open `index.html` in your browser
3. Or use a local server:
   ```bash
   # With Python
   python -m http.server 8000
   
   # With Node.js
   npx serve .
   ```

### Live Website

Upload the files to your web hosting for `app.studiotaupe.com`:

1. **index.html** → main file
2. **styles.css** → styling
3. **script.js** → functionality

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px  
- **Mobile**: < 480px

## 🎯 SEO Optimization

- Semantic HTML structure
- Meta tags for social media
- Alt texts for images
- Fast loading CSS and JS

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For questions or adjustments, contact via:
- Email: hello@studiotaupe.com
- Website: https://new.studiotaupe.com

---

**Studio Taupe** | Deventer, NL | Available Worldwide 