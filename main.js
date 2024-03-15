async function handleSubmit(event) {
  event.preventDefault();
  //console.log('hi')
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = await axios.post("http://localhost:3000/user/signup", {
    name: name,
    email: email,
    password: password,
  });
  console.log(data);
};
