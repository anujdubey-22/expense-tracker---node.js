async function handleForgot(e){
    const email = document.getElementById('email').value;

    const data = await axios.post('http://localhost:3000/password/forgotpassword');
    console.log(data);
};