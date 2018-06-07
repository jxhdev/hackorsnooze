let token = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : undefined;
let loggedInUserName = localStorage.getItem('userName')
  ? localStorage.getItem('userName')
  : undefined;
let $stories = $('#stories');

// populate the stories
$('#stories').on('click', 'span', e => {
  $(e.target).toggleClass('fas');
  let storyID = $(e.target)
    .next()
    .attr('data-id');
  console.log(storyID);
  favoriteThisStory(storyID);
  populateUserData();
  // $(e.target)
  //   .parent()
  //   .toggleClass('favs');
});

function populate() {
  $.getJSON(
    'https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10'
  ).then(res => {
    $stories.empty();
    res.data.forEach(data => {
      $stories.append(
        `<li><span class='far fa-star'></span><a data-id=${
          data.storyId
        } href='${data.url}'> ${data.title}</a></li>`
      );
    });
  });
}
populate();
// sign up logic

$('#signUpButton').on('click', function(e) {
  e.preventDefault();
  let name = $('#name').val();
  let username = $('#username').val();
  let password = $('#password').val();

  $.post('https://hack-or-snooze.herokuapp.com/users', {
    data: { name: name, username: username, password: password }
  })
    .then(data => {
      console.log('Sign up successful!');
    })
    .catch(e => {
      console.log('There was an error!');
    });
  $('#signUpForm')[0].reset();
  // to do: log error in HTML
});

// log in logic
$('#logInButton').on('click', function(e) {
  e.preventDefault();
  let username = $('#logInusername').val();
  let password = $('#logInpassword').val();

  $.post('https://hack-or-snooze.herokuapp.com/auth', {
    data: { username: username, password: password }
  })
    .then(res => {
      localStorage.setItem('token', res.data.token);
      token = localStorage.getItem('token');
      localStorage.setItem('userName', username);
      loggedInUserName = localStorage.getItem('userName');
      populateUserData();
      console.log('Log in successful!');
    })
    .catch(e => {
      console.log('There was an error!');
    });
  $('#signUpForm')[0].reset();
  // to do: log error in HTML
});

//create new story
$('#submitStory').click(function(e) {
  e.preventDefault();
  let author = $('#author').val();
  let title = $('#title').val();
  let url = $('#url').val();

  $.ajax('https://hack-or-snooze.herokuapp.com/stories', {
    type: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    // beforeSend: function(request) {
    //   request.setRequestHeader('Authorization', `Bearer ${token}`);
    // },
    data: {
      data: {
        username: localStorage.getItem('userName'),
        title: title,
        url: url,
        author: author
      }
    }
  })
    .then(res => {
      console.log('success!');
      populate();
    })
    .catch(err => console.log(`oopsies${JSON.stringify(err)}`));
});

//make favorite show up in API
function favoriteThisStory(storyID) {
  // var title = document.getElementById("title");
  console.log(title, url, author);
  $.ajax(
    `https://hack-or-snooze.herokuapp.com/users/${loggedInUserName}/favorites/${storyID}`,
    {
      type: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      data: {
        data: {
          username: loggedInUserName
        }
      }
    }
  )
    .then(res => console.log('SUCCESS'))
    .catch(err => console.log('FAIL'));
}

// Populate #userProfile container with user information once logged in
function populateUserData() {
  $.ajax(`https://hack-or-snooze.herokuapp.com/users/${loggedInUserName}`, {
    type: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {
    $('#profileName').text(`Name: ${res.data.name}`);
    $('#profileUsername').text(`Username: ${res.data.username}`);
    let $profileFavorites = $('#profileFavorites');
    let $profileStories = $('#profileStories');
    $profileFavorites.empty();
    $profileFavorites.text('Favorites');
    $profileStories.empty();
    $profileStories.text('Stories');

    res.data.favorites.forEach(data => {
      $profileFavorites.append(
        `<li><span class='fas fa-times'></span><a data-id=${
          data.storyId
        } href='${data.url}'> ${data.title}</a></li>`
      );
    });
    res.data.stories.forEach(data => {
      $profileStories.append(
        `<li><span class='fas fa-times'></span><a data-id=${
          data.storyId
        } href='${data.url}'> ${data.title}</a></li>`
      );
    });

    $('#profileFavorites').on('click', '.fa-times', function(e) {
      let idToDelete = $(e.target)
        .next()
        .attr('data-id');
      $.ajax(
        `https://hack-or-snooze.herokuapp.com/users/${loggedInUserName}/favorites/${idToDelete}`,
        {
          type: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
          data: {
            data: {
              username: loggedInUserName
            }
          }
        }
      )
        .then(res => populateUserData())
        .catch(e => console.log('fail'));
    });

    $('#profileStories').on('click', '.fa-times', function(e) {
      let idToDelete = $(e.target)
        .next()
        .attr('data-id');
      $.ajax(`https://hack-or-snooze.herokuapp.com/stories/${idToDelete}`, {
        type: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        data: {
          data: {
            username: loggedInUserName
          }
        }
      })
        .then(res => populateUserData())
        .catch(e => console.log('fail'));
    });
  });
}
