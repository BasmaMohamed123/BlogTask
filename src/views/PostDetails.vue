<template>
    <div v-if="post" class="post-details">
      <h1 class="post-title">{{ post.title }}</h1>
      <p class="post-content">{{ post.content }}</p>
      <p class="post-author" v-if="post.user">Written by: {{ post.user.name }}</p>
  
      <!-- Comment Form -->
      <div class="comment-form">
        <textarea v-model="newComment" placeholder="Add a comment..." rows="4" class="comment-textarea"></textarea>
        <button @click="submitComment" class="button submit-button">Submit</button>
      </div>
  
  
      Comments Section
      <div class="comments-section" v-if="comments.length">
        <h2>Comments</h2>
        <div v-for="comment in comments" :key="comment.slug" class="comment">
          <p class="comment-content">{{ comment.content }}</p>
          <p class="comment-author">By: {{ comment.user.name }}</p>
         
            <CommentActions
            :isOwner="isCommentOwner(comment)"
            :commentSlug="comment.slug"
            @edit="editComment"
            @delete="deleteComment"
          />
          
        </div>
      </div>

  <div v-if="editingComment">
      <textarea v-model="editedCommentContent" rows="4" class="comment-textarea"></textarea>
      <button @click="updateComment" class="button submit-button">Save</button>
      <button @click="cancelEdit" class="button cancel-button">Cancel</button>
    </div>
  </div>
  <div v-else>
    <p>Loading post details...</p>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import CommentActions from '../components/CommentActions.vue';


export default defineComponent({
  components: {
    CommentActions
  },
  data() {
    return {
      post: null,
      newComment: '',
      comments: [] as Comment[],
    editingComment: null ,
      editedCommentContent: '',
      user: null, 
     
    };
  },

  
  computed: {
    isPostOwner() {
     return this.user && this.user.slug === this.post?.user?.slug;
    },
    isCommentOwner() {
      return (comment) => {
      return this.user && this.user.slug === comment.user.slug;
    };
    }
  },
  methods: {
    fetchUser() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('No authentication token found. Please log in.');
      return;
    }

    axios.get('https://interns-blog.nafistech.com/api/user', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
    .then(response => {
      this.user = response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          alert('Unauthorized. Please log in again.');
          // Optionally, redirect to login page
        }
      } else {
        console.error('Error message:', error.message);
      }
    });
  },

    fetchPostDetails() {
      const slug = this.$route.params.slug;
      axios.get(`https://interns-blog.nafistech.com/api/posts/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      })
      .then(response => {
        this.post = response.data;
        this.comments = response.data.comments || [];
        
      })
      .catch(error => {
  if (error.response) {
    console.error('Error response data:', error.response.data);
    console.error('Error response status:', error.response.status);
  } else {
    console.error('Error message:', error.message);
  }
  alert('Failed to submit comment. Please try again.');
});
    },


    async fetchComments() {


      try {
        if (this.post && this.post.slug) {
          const postslug = this.post.slug;
         
          console.log('Post slug', postslug); // Debug: Check post ID
          const url = `https://interns-blog.nafistech.com/api/posts/${postslug}/comments`;
          console.log('Full URL:', url); // Debug: Check full URL for fetching comments
          const response = await axios.get(url);
          this.comments = response.data;

          console.log('Available comment slugs:', this.comments.map(c => c.slug));
        }
      } catch (error) {
        // console.error('Error fetching comments:', error);
      }
    },


    async submitComment() {
      const postslug = this.post?.slug;
      console.log('Post slug:', postslug); // Log the post ID to ensure it's correct

      const url = `https://interns-blog.nafistech.com/api/posts/${postslug}/comments`;
      console.log('Full URL:', url); // Log the full URL to verify

      console.log('Comment content:', this.newComment); // Log the comment content to check it's correct

      try {
        const response = await axios.get(url, {
          content: this.newComment,
     

        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            // 'Content-Type': 'application/json',
          },
        });

        // console.log('Response:', response.data); // Log the response data from the server
        this.comments.push(response.data);
        this.newComment = ''; 
        
       

      } catch (error) {
        console.error('Error submitting comment:', error.response ? error.response.data : error.message);
      }
    },
  

    async deleteComment(commentSlug) {

      console.log('Attempting to delete comment with slug:', commentSlug);
      console.log('Delete URL:', `https://interns-blog.nafistech.com/api/comments/${commentSlug}`);
     
     
      try {
        await axios.delete(`https://interns-blog.nafistech.com/api/comments/${commentSlug}`, {
         
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        
// console.log('Successfully deleted comment with slug:', commentSlug);
        this.comments = this.comments.filter((comment) => comment.slug !== commentSlug);
      } catch (error) {
    console.error('Error deleting comment:', error.response ? error.response.data : error.message);
   
  }
    },
  
  

    editComment(commentSlug) {
      const comment = this.comments.find(c => c.slug === commentSlug);
      if (comment) {
        this.editingComment = comment;
        this.editedCommentContent = comment.content;
      }
    },

    async updateComment() {
      
      if (!this.editingComment) return;

      try {
        const response = await axios.post(
         url,
          { content: this.editedCommentContent },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const updatedComment = response.data;
        const index = this.comments.findIndex(c => c.slug === updatedComment.slug);
        if (index !== -1) {
          this.comments.splice(index, 1, updatedComment);
        }

 
    this.cancelEdit(); // Reset the edit mode
  } catch (error) {
   // console.error('Error updating comment:', error.response ? error.response.data : error.message);
    alert('Failed to update comment. Please try again.');
  }
},


    cancelEdit() {
      this.editingComment = null;
      this.editedCommentContent = '';
    },
  
  },
  mounted() {
    this.fetchUser();
    this.fetchPostDetails();

  }
});
</script>


  <style scoped>
  .post-details {
    max-width: 8000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .post-title {
    font-size: 2.5em;
    color: #333333;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
  }
  
  .post-content {
    font-size: 1.2em;
    color: #555555;
    line-height: 1.6;
    margin-bottom: 20px;
    text-align: justify;
  }
  
  .post-author {
    font-size: 1em;
    color: #3498db;
    margin-top: 20px;
    padding: 5px 10px;
    border-left: 4px solid #3498db;
    background-color: #f3f4f7;
    border-radius: 5px;
    display: inline-block;
  }
  
  .comment-form {
    background-color: #f7f7f7;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    margin-top: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .comment-textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    font-size: 1em;
    margin-bottom: 10px;
    resize: vertical;
  }
  
  .comments-section {
    background-color: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .comment {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .comment-content {
    font-size: 1.1em;
    line-height: 1.5;
    color: #333333;
    margin-bottom: 10px;
  }
  
  .comment-author {
    font-size: 0.9em;
    color: #888888;
    margin-bottom: 10px;
  }
  
  .comment-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .comment-actions .button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    margin-left: 5px;
  }
  
  .comment-actions .delete-button {
    background-color: #e74c3c;
    color: #ffffff;
  }
  
  .comment-actions .delete-button:hover {
    background-color: #c0392b;
  }
  
  .comment-actions .edit-button {
    background-color: #3498db;
    color: #ffffff;
  }
  
  .comment-actions .edit-button:hover {
    background-color: #2980b9;
  }
  
  .submit-button {
    background-color: #3498db;
    color: #ffffff;
    font-weight: bold;
    border-radius: 5px;
  }
  
  .submit-button:hover {
    background-color: #2980b9;
  }
  </style>
  