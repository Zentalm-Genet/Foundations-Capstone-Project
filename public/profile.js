const profileCard = document.getElementById('profileCard');
const profileForm = document.getElementById('profileForm');
const editForm = document.getElementById('editForm');

profileCard.addEventListener('click', () => {
  if (editForm.style.display === 'none') {
    editForm.style.display = 'block';
  } else {
    editForm.style.display = 'none';
  }
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData();
  const imageFile = document.getElementById('imageInput').files[0];
  const username = document.getElementById('usernameInput').value;

  formData.append('image', imageFile);
  formData.append('username', username);

  axios.post('http://localhost:4000/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  
  .then(response => {
    console.log(response.data.message);
    return response.data.imageUrl; // Assuming server returns the URL of the uploaded image
  })
  .then(imageUrl => {
    // Update profile card with new image and username
    profileCard.querySelector('img').src = imageUrl;
    profileCard.querySelector('p').textContent = username;

    // Show profile card again
    profileCard.style.display = 'block';
    editForm.style.display = 'none';
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
