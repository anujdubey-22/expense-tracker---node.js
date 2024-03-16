async function getData() {
  try {
    const response = await axios.get("http://localhost:3000/user/get-expense");
    console.log(response);
    for (let data of response.data.response) {
      //console.log(data);
      showExpense(data);
    }
  } catch (error) {
    console.log(error, "error in getting data in main.js");
  }
}

document.addEventListener("DOMContentLoaded", getData);

function showExpense(expenseData) {
  const { expenseAmount, description, category, id } = expenseData;
  var list = document.getElementById("list");

  var li = document.createElement("li");
  var btn = document.createElement("button");
  //var edit = document.createElement("button");

  btn.id = "button";
  btn.appendChild(document.createTextNode("DeleteExpense"));
  //edit.appendChild(document.createTextNode("EditExpense"));

  li.appendChild(
    document.createTextNode(`${expenseAmount} - ${description} - ${category}`)
  );
  li.appendChild(btn);
  //li.appendChild(edit);
  list.appendChild(li);
  console.log(li);

  // var objString=JSON.stringify(obj);

  // localStorage.setItem(description,objString);

  btn.addEventListener("click", clicked);

  async function clicked(e) {
    try {
      console.log("hi", e.target, id);
      var li = e.target.parentElement;
      list.removeChild(li);

      //localStorage.removeItem(obj.description);

      const response = await axios.delete(
        `http://localhost:3000/user/delete-expense/${id}`
      );
      console.log(response);
    } catch (error) {
      console.log(error, "error in deleting expense");
    }
  }

  //     edit.addEventListener('click',edited);

  //    async function edited(e){
  //         try{
  //             console.log('hi',e.target,id)
  //             var li = e.target.parentElement;
  //             list.removeChild(li);
  //         //localStorage.removeItem(obj.description);

  //             document.getElementById('Expenseamount').value=expenseAmount
  //             document.getElementById('Description').value=description
  //             document.getElementById('Category').value=category

  //             //localStorage.removeItem(obj.description);

  //             const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`);
  //             console.log(response);
  //             }
  //             catch (error){
  //                 console.log(error,'error in deleting expense');
  //             }
  //     }
}

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
    }
  } catch (error) {
    console.log(error, "error in post request in main.js");
    const div = document.getElementById("error");

    div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...404  ${error.response.data}</h3> </div>`;
    console.log(error.response.data);
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
    console.log(data);
    if (data.status === 201) {
      console.log(data.data);
      alert("User Login Success");
      window.location.href = "./expense.html";
    }
  } catch (error) {
    console.log(error, "error in validating user");
    const div = document.getElementById("error");
    div.innerHTML = "";
    div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...404 ${error.response.data}</h3> </div>`;
    console.log(error.response.data);
  }
}

async function expenseHandler(event) {
  event.preventDefault();

  var amount = document.getElementById("Expenseamount").value;
  var description = document.getElementById("Description").value;
  var category = document.getElementById("Category").value;
  console.log(amount, description, category);

  axios
    .post("http://localhost:3000/user/post-expense", {
      amount: amount,
      description: description,
      category: category,
    })
    .then((result) => {
      console.log(result, "result in axios post in main.js");
      showExpense(result.data.newExpenseDetail);
    })
    .catch((error) => console.log(error, "error in axios post in main.js"));

  var obj = {
    amount: amount,
    description: description,
    category: category,
  };
}
