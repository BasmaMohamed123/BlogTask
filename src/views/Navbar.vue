<template>
  <nav class="navbar">
    <div class="container">
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar"
};
</script>

<style scoped>
.navbar {
  background-color: #9ad7d7;
  padding: 1rem;
  width:1200px;
}

.container {
  display: flex;
  justify-content: center;
 
}

.nav-links {
  list-style-type: none;
  display: flex;
  gap: 20px;
  
}

.nav-links li {
  display: inline;
}

.nav-links a {
  color: rgb(25, 23, 23);
  text-decoration: none;
  font-weight: bold;
 
  
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>
