# One Piece SH Figuarts Collection Tracker

A web-based collection tracker for One Piece SH Figuarts figures, styled with One Piece colors and theming.

## Features

- **My Collection Tab**: Track your personal collection of figures
- **Full Inventory Tab**: Browse all available figures and add them to your collection
- **Status Tracking**: Mark figures as Owned, Wishlist, or Ordered
- **Search & Filter**: Find figures by name, series, character, or year
- **Statistics**: View total figures, owned count, and wishlist count
- **Local Storage**: All data is saved locally in your browser

## One Piece Theming

- **Colors**: 
  - Gold (#FFD700) - Primary accent color
  - Orange (#FF6B35) - Secondary accent color  
  - Red (#C41E3A) - Tertiary accent color
- **Custom Logo**: One Piece themed logo with Straw Hat icon
- **Character Categories**: Organized by Straw Hat Crew, Four Emperors, Marines, etc.

## Figure Database

The tracker includes 45+ One Piece SH Figuarts figures including:

### Straw Hat Crew
- Monkey D. Luffy (multiple versions including Gear 5)
- Roronoa Zoro (classic and Wano versions)
- Sanji (classic and Raid Suit versions)
- Nami, Nico Robin, Tony Tony Chopper
- Franky, Brook, Jinbe

### Major Characters
- Kaido (Human and Dragon forms)
- Yamato, Shanks, Big Mom
- Portgas D. Ace, Trafalgar Law
- Boa Hancock, Dracule Mihawk
- And many more!

## Usage

1. Open `index.html` in your web browser
2. Use the "My Collection" tab to view and manage your figures
3. Use the "Full Inventory" tab to browse all available figures
4. Click "Add Figure" to manually add custom figures
5. Use the search and filter options to find specific figures

## File Structure

```
onepiece-shfiguarts-tracker/
├── index.html          # Main HTML file
├── styles.css          # One Piece themed CSS
├── script.js           # Main JavaScript functionality
├── fetchFigures.js     # Figure database
├── README.md           # This file
└── images/
    ├── onepiece_logo.svg    # One Piece logo
    ├── user-avatar.png      # User avatar placeholder
    └── figures/
        └── no-image.svg     # Placeholder for missing figure images
```

## Based On

This tracker is based on the Marvel Legends tracker structure but completely adapted for One Piece SH Figuarts with:
- One Piece color scheme and styling
- One Piece character database
- SH Figuarts specific fields (accessories instead of BAF parts)
- One Piece themed terminology throughout

## Browser Compatibility

Works in all modern web browsers with JavaScript enabled. Data is stored locally using localStorage API.