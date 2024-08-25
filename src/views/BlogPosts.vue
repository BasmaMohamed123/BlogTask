<template>
  <div class="blog-posts">
    <h1>My Blog Posts</h1>
    <div v-if="!isLoggedIn">
      <p>Please <router-link to="/login">login</router-link> to view your posts.</p>
    </div>
    <div v-else>
      <div v-if="posts.length === 0">
        <p>No posts available.</p>
      </div>
      <div v-else>
        <div class="post-list">
          <div v-for="post in posts" :key="post.slug || post.id" class="post-item">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <p class="post-author" v-if="post.user && post.user.name">Author: {{ post.user.name}}</p>
            <div class="post-actions">
              <router-link :to="`/posts/${post.slug || post.slug}`">
                <button class="view-details">View Details</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BlogPosts',
  data() {
    return {
      posts: [],
      isLoggedIn: false,
    };
  },
  async created() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    if (this.isLoggedIn) {
      try {
        const response = await axios.get(`https://interns-blog.nafistech.com/api/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        
        this.posts = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Roboto:wght@400;500&display=swap');

.blog-posts {
  padding: 20px;
  background: url('@/assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  overflow: hidden;
  width:auto;
}

.blog-posts::before {
  content: '';
  position: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  animation: backgroundAnimation 20s linear infinite;
}

@keyframes backgroundAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.blog-posts > * {
  position: center;
  z-index: 2;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  color: #ffffff;
  font-size: 2.5em;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 1px;
  animation: fadeInDown 1s ease-out;
  
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.post-item {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.75em;
  color: #333333;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.post-item:hover .post-title {
  color: #0056b3;
}

.post-excerpt {
  font-family: 'Roboto', sans-serif;
  color: #666666;
  margin-bottom: 15px;
  line-height: 1.6;
  animation: fadeIn 1.2s ease-out;
}

.post-author {
  font-family: 'Roboto', sans-serif;
  color: #888888;
  font-style: italic;
  margin-bottom: 20px;
  animation: fadeIn 1.2s ease-out;
}

.post-actions {
  display: flex;
  gap: 15px;
  animation: fadeInUp 1s ease-out;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button.view-details {
  background-color: #0056b3;
  color: white;
}

button.view-details:hover {
  background-color: #003e7e;
  transform: scale(1.05);
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
