let token;
let $stories = $('#stories');

// populate the stories
// function populate()
$.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10').then(
  res =>
    res.data.forEach(data => {
      $stories.append(`<li><a href='${data.url}'>${data.title}</a></li>`);
    })
);

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
    .then(res => console.log('success!'))
    .catch(err => console.log(`oopsies${JSON.stringify(err)}`));
});
