

  const newFormHandler = async (event) => {
    event.preventDefault();
console.log('newFormHandler')
    const title = document.querySelector("#blog-title").value.trim();
    const contents = document.querySelector("#blog-content").value.trim();

    if (title && contents) {
      const response = await fetch(`/api/blog/`, {
        method: 'POST',
        body: JSON.stringify({ title, contents }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to create blog');
      }
    }
  };

  document.querySelector('.blog-list').addEventListener('click', (event) => {
    if (event.target.matches('.deleteBtn')) {
      const id = event.target.getAttribute('data-id');

      fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          event.target.closest('.row').remove(); // Remove the blog element from DOM
        } else {
          alert('Failed to delete blog');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });

  document.querySelector('.new-comment-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const comment=event.target.children[0].children[1].value
      const blog_id=event.target.children[0].children[1].id
      console.log(event.target.children[0].children[1].id)
      console.log(event.target.children[0].children[1].value)
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({comment:comment, blog_id: blog_id}),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        location.reload();  // Reload the page to show the new comment
      } else {
        alert('Failed to post comment');
      }
    });


    const editBtnHandler = async (event) => {
      if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');
        const response = await fetch(`/api/blog/${id}`, {
          method: 'GET'
        })
        if (!response.ok){
          return;
        }
  
        const blog = await response.json();
    
        const editForm = document.getElementById('edit-form');
  
        if (editForm) {
          editForm.innerHTML = `
            <label for="title">Title:</label>
            <input type="text" id="title" value="${blog.title}">
            <label for="content">Content:</label>
            <textarea id="content">${blog.contents}</textarea>
            <button id="save-btn">Save Changes</button>
          `;
        
          const saveBtn = editForm.querySelector('#save-btn');
        
    
        saveBtn.addEventListener('click', async () => {
          const title = document.getElementById('title').value;
          const content = document.getElementById('content').value;
    
          const response = await fetch(`/api/blog/${id}`,
           {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
          });
    
          if (response.ok) {
            console.log('Post updated successfully!');
            window.location.reload();
          } else {
            console.error('Failed to update post!');
          }
        });
      }
    };
  }

  document
    .querySelector('.edit')
    .addEventListener('click', editBtnHandler);

  document
    .querySelector("#new-blog-form")
    .addEventListener('submit', newFormHandler);



