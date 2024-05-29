const API_URL = "http://localhost:8080/api";
const URL = API_URL + "/income";

async function fetchIncomes() {
  const response = await fetch(URL, makeOptionsToken('GET', null, true));
  const incomes = await response.json();
  const dashboard = document.getElementById('dashboard');
 
  incomes.forEach(income => {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'amount';
    descriptionDiv.textContent = income.type;
    dashboard.appendChild(descriptionDiv);

    const amountDiv = document.createElement('div');
    amountDiv.className = 'amount';
    amountDiv.textContent = income.amount;
    dashboard.appendChild(amountDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger'; 
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = () => deleteIncome(income.id);
    dashboard.appendChild(deleteButton);
  });
}

async function deleteIncome(id) {
  await fetch(`${URL}/${id}`, makeOptionsToken('DELETE', null, true));
  location.reload();
}

async function createIncome() {
  const type = document.getElementById('newDescription').value.trim();
  const amount = document.getElementById('newAmount').value.trim();

  if (!type || amount <= 0) {
    alert('Please provide valid type and amount.');
    return;
  }

  const response = await fetch(URL, makeOptionsToken('POST', { type, amount }, true));
  if (response.ok) {
    location.reload();
  } else {
    console.error('Failed to create income:', response.statusText);
  }
}

document.addEventListener('DOMContentLoaded', fetchIncomes);

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
