const API_URL = "http://localhost:8080/api";
const URL = API_URL + "/expense";

async function fetchExpenses() {
  const response = await fetch(URL, makeOptionsToken('GET', null, true));
  const expenses = await response.json();
  const dashboard = document.getElementById('dashboard');

expenses.forEach(expense => {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'amount';
    descriptionDiv.textContent = expense.type;
    dashboard.appendChild(descriptionDiv);


    const amountDiv = document.createElement('div');
    amountDiv.className = 'amount';
    amountDiv.textContent = expense.amount;
    dashboard.appendChild(amountDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger'; 
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
    deleteButton.onclick = () => deleteExpense(expense.id);
    dashboard.appendChild(deleteButton);
});
}

async function deleteExpense(id) {
  await fetch(`${URL}/${id}`, makeOptionsToken('DELETE', null, true));
  location.reload();
}


async function createExpense() {
    const type = document.getElementById('newDescription').value.trim();
    const amount = document.getElementById('newAmount').value.trim();
  
    if (!type || amount <= 0) {
      alert('Please provide valid description and amount.');
      return;
    }
  
    const response = await fetch(URL, makeOptionsToken('POST', { type, amount }, true));
    if (response.ok) {
      location.reload();
    } else {
      console.error('Failed to create expense:', response.statusText);
    }
  }

document.addEventListener('DOMContentLoaded', fetchExpenses);

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
}

 function makeOptionsToken(method, body, addToken) {
  const opts = {
    method: method,
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    }
  };
  if (body) {
    opts.body = JSON.stringify(body);
  }
  if (addToken && localStorage.getItem("token")) {
    opts.headers.Authorization = "Bearer " + localStorage.getItem("token");
  }
  return opts;
}
