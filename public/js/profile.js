

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




  document
    .querySelector("#new-blog-form")
    .addEventListener('submit', newFormHandler);



