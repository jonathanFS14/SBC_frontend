const API_URL = "http://localhost:8080/api";
const INCOME_URL = API_URL + "/income";
const GOAL_URL = API_URL + "/goal";

let totalBudget = 0;

async function fetchIncomes() {
  try {
    const response = await fetch(INCOME_URL, makeOptionsToken('GET', null, true));
    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
        logout();
        return;
      }
      throw new Error('Failed to fetch incomes');
    }
    const incomes = await response.json();
    if (Array.isArray(incomes)) {
      totalBudget = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalAmountElement = document.getElementById('total-amount');
      if (totalAmountElement) {
        totalAmountElement.textContent = `Total Budget: ${totalBudget}`;
      }
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching incomes:', error);
    alert('Error fetching incomes. Please try again later.');
  }
}

async function submitGoal(goalType) {
  const savePercentage = document.getElementById('save-percentage').value;
  const investPercentage = document.getElementById('invest-percentage').value;
  const usePercentage = document.getElementById('use-percentage').value;

  let percentage = 0;
  if (goalType === 'save') {
    percentage = savePercentage;
  } else if (goalType === 'invest') {
    percentage = investPercentage;
  } else if (goalType === 'use') {
    percentage = usePercentage;
  }

  if (percentage > 0 && percentage <= 100) {
    const goal = {
      type: goalType,
      amountPercentage: percentage
    };

    try {
      const response = await fetch(GOAL_URL, makeOptionsToken('POST', goal, true));
      if (response.ok) {
        const result = await response.text(); // Handle response as text
        document.getElementById('goal-result').textContent = `Goal set: ${goalType.toUpperCase()} ${percentage}% of your total budget. ${result}`;
        fetchCurrentGoals(); // Fetch current goals after setting a new one
      } else {
        alert('Failed to set goal. Please try again.');
      }
    } catch (error) {
      console.error('Error setting goal:', error);
      alert('Error setting goal. Please try again later.');
    }
  } else {
    alert('Please enter a valid percentage between 1 and 100.');
  }
}

async function fetchCurrentGoals() {
  try {
    const response = await fetch(GOAL_URL, makeOptionsToken('GET', null, true));
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    const goals = await response.json();
    const goalsContainer = document.getElementById('current-goals');
    goalsContainer.innerHTML = ''; // Clear previous goals
    goals.forEach(goal => {
      const goalDiv = document.createElement('div');
      goalDiv.textContent = `${goal.type.toUpperCase()} - ${goal.amountPercentage}%`;

      // Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
      deleteButton.onclick = () => deleteGoal(goal.id);
      deleteButton.className = 'btn btn-danger btn-sm'; // Optional: add some Bootstrap styling

      goalDiv.appendChild(deleteButton);
      goalsContainer.appendChild(goalDiv);
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    alert('Error fetching goals. Please try again later.');
  }
}

async function deleteGoal(goalId) {
  try {
    const response = await fetch(`${GOAL_URL}/${goalId}`, makeOptionsToken('DELETE', null, true));
    if (response.ok) {
        location.reload();
    } else {
      alert('Failed to delete goal. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
    alert('Error deleting goal. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchIncomes();
  fetchCurrentGoals();
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
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
