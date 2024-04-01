async function resetpasswordfile(event){
    event.preventDefault();
    console.log('reset password clicked')
    const uuid = localStorage.getItem('uuid');
    const password = document.getElementById('resetpassword').value;
    console.log(uuid,password)
    const data = await axios.post(`http://52.66.206.117:3000/password/updatepassword/${uuid}`,
    {
        newpassword:password
    });
    console.log(data,'data in resetpassword');
    alert('password Updated Successfully Login with new password .. redirecting you to login page in 1 second')
    setTimeout(() => {
        window.location.href ='./login.html'
    }, 1000);
}