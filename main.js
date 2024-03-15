async function handleSubmit(event) {
  try {
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
    if (data.status===201){
        console.log(201);
        window.location.href = './login.html'
    }
    else{
        const div = document.getElementById('error');

        div.innerHTML =`<div><h3>ERROR HERE ...</h3> </div>`
    }

  } catch (error) {
    console.log(error,'error in post request in main.js');
  }
}
