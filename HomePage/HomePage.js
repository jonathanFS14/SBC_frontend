document.addEventListener("DOMContentLoaded", () => {
  fetchIncomes().then(() => {
    fetchExpenses();
    fetchGoals();
  });
});

let totalBudget = 0;

async function fetchIncomes() {
  const response = await fetch("http://localhost:8080/api/income", makeOptionsToken('GET', null, true));
  const chartContainer = document.getElementById('chart-container');
  if (response.ok) {
    const incomes = await response.json();
    if (incomes.length > 0) {
      totalBudget = incomes.reduce((sum, income) => sum + income.amount, 0);
      renderPieChart("pieChart2", incomes);
      const totalIncomeElement = document.getElementById('total-income');
      totalIncomeElement.textContent = `Total Income: ${totalBudget.toFixed(2)}`;
    } else {
      const message = document.createElement('p');
      message.textContent = "No incomes yet.";
      chartContainer.querySelector('.chart-box:nth-child(2)').appendChild(message);
    }
  } else {
    console.error('Failed to fetch incomes');
  }
}

async function fetchExpenses() {
  const response = await fetch("http://localhost:8080/api/expense", makeOptionsToken('GET', null, true));
  const chartContainer = document.getElementById('chart-container');
  if (response.ok) {
    const expenses = await response.json();
    if (expenses.length > 0) {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      renderPieChart("pieChart1", expenses);
      const totalExpenseElement = document.getElementById('total-expense');
      totalExpenseElement.textContent = `Total Expense: ${totalExpenses.toFixed(2)}`;
    } else {
      const message = document.createElement('p');
      message.textContent = "No expenses yet.";
      chartContainer.querySelector('.chart-box:nth-child(1)').appendChild(message);
    }
  } else {
    console.error('Failed to fetch expenses');
  }
}

async function fetchGoals() {
  const response = await fetch("http://localhost:8080/api/goal", makeOptionsToken('GET', null, true));
  const goalsContainer = document.getElementById('goals-container');
  if (response.ok) {
    const goals = await response.json();
    if (goals.length > 0) {
      goalsContainer.innerHTML = ''; // Clear any previous goals
      goals.forEach(goal => {
        const goalDiv = document.createElement('div');
        goalDiv.className = 'goal';
        const amount = (totalBudget * goal.amountPercentage) / 100;
        let message = `${goal.type.toUpperCase()}: ${goal.amountPercentage}% `;
        if (goal.type === 'save') {
          message += `- You should save ${amount.toFixed(2)}`;
        } else if (goal.type === 'invest') {
          message += `- You should invest ${amount.toFixed(2)}`;
        } else if (goal.type === 'use') {
          message += `- You can use up to ${amount.toFixed(2)}`;
        }
        goalDiv.textContent = message;
        goalsContainer.appendChild(goalDiv);
      });
    } else {
      const message = document.createElement('p');
      message.textContent = "No goals set yet.";
      goalsContainer.appendChild(message);
    }
  } else {
    console.error('Failed to fetch goals');
  }
}

function renderPieChart(elementId, data) {
  const ctx = document.getElementById(elementId).getContext("2d");
  const labels = data.map(item => item.type);
  const amounts = data.map(item => item.amount);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            "rgb(255,99,132)",
            "rgb(54,162,235)",
            "rgb(255,205,86)",
            "rgb(201,203,207)",
            "rgb(75,192,192)",
            "rgb(153,102,255)",
            "rgb(255,159,64)"
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: elementId === "pieChart1" ? "Expenses" : "Incomes"
        }
      }
    }
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("roles");
  window.location.href = '../index.html'; // Redirect to login page
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
