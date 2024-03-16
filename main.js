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
    if (data.status === 201) {
      console.log(201);
      window.location.href = "./login.html";
    } else {
      const div = document.getElementById("error");

      div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...${data.data}</h3> </div>`;
    }
  } catch (error) {
    console.log(error, "error in post request in main.js");
  }
}

async function validLogin(event) {
  try {
    event.preventDefault();
    //console.log(event.target.email.value);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const obj = {
      email: email,
      password: password,
    };
    const data = await axios.post("http://localhost:3000/user/validate", obj);
    if (data.status != 201) {
        console.log(data.data);
      const div = document.getElementById("error");
      div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...${data.data}</h3> </div>`;
    }
    else{
        const div = document.getElementById("error");
      div.innerHTML =''
      console.log(data.data);
    }
  } catch (error) {
    console.log(error, "error in validating user");
  }
}
