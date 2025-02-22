# Spidey Social Media

Authorization and Authentication: Implemented using session-based authentication to securely manage user sessions.

Framework: Built on Express.js, a fast and flexible Node.js web application framework.

Backend: Powered by Node.js, providing a robust and scalable server-side environment.

Frontend: Developed using React.js for a dynamic and responsive user interface.

Database: Utilizes MongoDB for storing user data, posts, and other platform-related information.

Image Upload: Integrated Cropper.js library to allow users to easily upload and crop pictures before posting.

Real-Time Chat: Leveraged Socket.IO to enable real-time, bidirectional communication for both individual and group chats.

Registration and Login: Users can easily create new accounts or log in to the system to start using the platform.

Post Creation: Users can share their thoughts, emotions, or information through text posts, images, and links, displayed on their timeline.

Like and Retweet: Users can express their appreciation by liking posts or resharing content they enjoy through the "Retweet" feature.

Comments: Enables users to discuss and interact with posts directly through the commenting system.

User Profile: Each user has a personal profile page where they can manage their information, profile picture, and published posts.

Pin Post: Users can pin important posts at the top of their profile for easy access.

Following and Followers Page: Users can view and manage the people they follow and those who follow them, providing a clear view of their social connections on the platform.

Image Upload: Supports users in uploading and sharing images directly in their posts.

Private Messaging: Users can send private messages to friends and followers, making it easy to stay connected. (still in process)

Group Chat: This feature allows users to create group chats with multiple participants, perfect for group discussions or organizing events. (still in process)

Messages and Notifications: Users receive real-time notifications about their activities, including likes, comments, new messages, and other events on the platform. (still in process)

---

## Installation Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (Ensure you have MongoDB running locally or using MongoDB Atlas)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-repo/spidey-social-media.git
cd spidey-social-media
```

### Step 2: Setup Backend

```bash
Navigate to the backend folder:
cd backend

Install the required dependencies:
npm install

Create a .env file in the backend directory and add your MongoDB connection string and session secret:
MONGO_URI=<Your MongoDB Connection String>
SESSION_SECRET=<Your Session Secret>

Start the backend server:
npm start
```
### Step 3: Setup Frontend

```bash
Open a new terminal window, and navigate to the frontend folder:
cd frontend/spidey-app

Install the required dependencies:
npm install

Start the frontend React application:
npm start
```

### Step 4: Access the Application
```bash
Open your browser and go to http://localhost:3000 to view the frontend.
Ensure your backend is running on http://localhost:3003 or whichever port you specified in the backend setup.
```
