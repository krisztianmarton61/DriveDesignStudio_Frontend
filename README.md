# Frontend

This project is a React.js-based frontend application built with TypeScript to ensure type safety and easier debugging. The application is structured into modular, reusable components for better maintainability and scalability.

## Key Features

- **User Authentication**  
  Authentication is handled via **Amazon Cognito**, supporting secure login, logout, and password management. Authentication is optional but unlocks additional features. Custom React components manage user input and communicate with Cognito services.

- **Homepage & Navigation**  
  The main page features product highlights, general information, and personalized recommendations. Users can navigate to detailed product pages where they can:

  - View product visualizations
  - Add items to the cart
  - Access the product editor

- **Product Editor**  
  One of the app’s core components, allowing users to:

  - Generate images using AI
  - Upload their own images
  - Browse and select from community-generated images

  Once an image is selected, users can personalize it by:

  - Adding text
  - Formatting visuals
  - Removing backgrounds
  - Drawing over the image

- **Order Flow**  
  After customization, users can view their cart and proceed to order. If the user is not registered, a profile is created automatically.

- **State Management**  
  The application uses `preact-signals` for efficient and consistent state handling across components.

- **Real-Time Feedback**  
  A notification system displays real-time messages for events like login success or error alerts. Multiple messages can appear simultaneously and automatically disappear after a short period.

## Tech Stack

- React.js
- TypeScript
- Preact Signals
- Amazon Cognito
- CSS/SCSS
