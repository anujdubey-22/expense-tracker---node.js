async function getData() {
  try {
    var token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/user/get-expense", {
      headers: { authorization: token },
    });
    console.log(response);

    //let pElement = document.getElementById("message").querySelector("p");
    //let pElement = document.createElement("p");
    // pElement.innerHTML = "Hello, World!";
    // document.getElementById("message").appendChild(pElement);

    //document.getElementById("message").appendChild(pElement);

    // Check if button was hidden before
    if (localStorage.getItem("buttonHidden") === "true") {
      document.getElementById("buyPremium").style.display = "none";
      document.getElementById("board").style.display = "block";
        let pElement = document.getElementById("message");
     pElement.innerHTML = "You are a Premium User now";
    }
    for (let data of response.data.response) {
      //console.log(data);
      showExpense(data);
    }
  } catch (error) {
    console.log(error, "error in getting data in main.js");
  }
}

document.addEventListener("DOMContentLoaded", getData);

async function showLeaderBoard() {
  console.log("show Leader btn clicked");
  const token = localStorage.getItem('token');
  const userArr = await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers:{authorization: token}});
  console.log(userArr);
  const leaderEle = document.getElementById('leaderboard');
  leaderEle.innerHTML= `<h1>Leader Board</h1>`
  for(let item of userArr.data.data){
    //console.log(`Name - ${item} Total Expense - ${userArr[item]}`)
    const div = document.createElement('div');
    div.appendChild(document.createTextNode( `Name - ${item.name} Total Expense - ${item.Total_Expense}` ))
    //leaderEle.innerHTML += `Name - ${item} Total Expense - ${userArr.data.data[item]}`;
    leaderEle.appendChild(div)

  }
  
}
async function buyPremium() {
  try {
    console.log("btn clicked");
    obj = {};
    const token = localStorage.getItem("token");
    console.log(token, "token to send in post premium in main.js");
    const response = await axios.post(
      "http://localhost:3000/user/premium",
      obj,
      { headers: { authorization: token } }
    );
    console.log(response);
    console.log(response.razorpay_payment_id, "paymentId");

    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const output = await axios.post(
          "http://localhost:3000/user/updatetransactions",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { authorization: token } }
        );
        console.log(output);
        alert("you are premium user now");
        localStorage.setItem("token", output.data.token);
        document.getElementById("buyPremium").style.display = "none";
        document.getElementById("board").style.display = "block";
        document
          .getElementById("board")
          .addEventListener("click", showLeaderBoard());
        // Store hidden state in local storage
        localStorage.setItem("buttonHidden", "true");
        let pElement = document.getElementById("message");
    pElement.innerHTML = "You are a Premium User now";
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    //e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      console.log(response, "response in buyPremium in main.js");
      const failed = await axios.post(
        "http://localhost:3000/user/failedTransaction",
        {
          order_id: response.error.metadata.order_id,
          payment_id: response.error.metadata.payment_id,
        },
        { headers: { authorization: token } }
      );
      alert("Somethimg went Wrong");
    });
  } catch (error) {
    console.log(error, "error in buy premium");
  }
}

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
  //console.log(li);

  // var objString=JSON.stringify(obj);

  // localStorage.setItem(description,objString);

  btn.addEventListener("click", clicked);

  async function clicked(e) {
    try {
      var token = localStorage.getItem("token");
      console.log("hi", e.target, id);
      var li = e.target.parentElement;
      list.removeChild(li);

      //localStorage.removeItem(obj.description);

      const response = await axios.delete(
        `http://localhost:3000/user/delete-expense/${token}`
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
      localStorage.setItem("token", data.data.token);
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
  var token = localStorage.getItem("token");
  console.log(amount, description, category);
  console.log(token);

  axios
    .post("http://localhost:3000/user/post-expense", {
      amount: amount,
      description: description,
      category: category,
      token: token,
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
