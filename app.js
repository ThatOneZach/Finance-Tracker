// ------------------------------------------
// Load saved data
// ------------------------------------------

let categories = JSON.parse(
  localStorage.getItem(
    "financeCategories"
  )
) || [];


let overallMonthlyBudget =
  Number(
    localStorage.getItem(
      "overallMonthlyBudget"
    )
  ) || 0;


// ------------------------------------------
// Main elements
// ------------------------------------------

const categoryContainer =
  document.getElementById(
    "categoryContainer"
  );


const categoryNameInput =
  document.getElementById(
    "categoryName"
  );


const categoryDescriptionInput =
  document.getElementById(
    "categoryDescription"
  );


const categoryBudgetInput =
  document.getElementById(
    "categoryBudget"
  );


const createCategoryButton =
  document.getElementById(
    "createCategoryButton"
  );


// ------------------------------------------
// Navigation elements
// ------------------------------------------

const dashboardNavButton =
  document.getElementById(
    "dashboardNavButton"
  );


const categoriesNavButton =
  document.getElementById(
    "categoriesNavButton"
  );


const historyNavButton =
  document.getElementById(
    "historyNavButton"
  );


const settingsNavButton =
  document.getElementById(
    "settingsNavButton"
  );


const dashboardView =
  document.getElementById(
    "dashboardView"
  );


const categoriesView =
  document.getElementById(
    "categoriesView"
  );


const historyView =
  document.getElementById(
    "historyView"
  );


const settingsView =
  document.getElementById(
    "settingsView"
  );


// ------------------------------------------
// Dashboard elements
// ------------------------------------------

const totalBudgetDisplay =
  document.getElementById(
    "totalBudgetDisplay"
  );


const totalSpentDisplay =
  document.getElementById(
    "totalSpentDisplay"
  );


const totalRemainingDisplay =
  document.getElementById(
    "totalRemainingDisplay"
  );


const dashboardCategoryContainer =
  document.getElementById(
    "dashboardCategoryContainer"
  );


const overallBudgetAmount =
  document.getElementById(
    "overallBudgetAmount"
  );


const overallBudgetDetails =
  document.getElementById(
    "overallBudgetDetails"
  );


const overallProgressBar =
  document.getElementById(
    "overallProgressBar"
  );


const editOverallBudgetButton =
  document.getElementById(
    "editOverallBudgetButton"
  );


// ------------------------------------------
// History elements
// ------------------------------------------

const historyContainer =
  document.getElementById(
    "historyContainer"
  );


const historyTotal =
  document.getElementById(
    "historyTotal"
  );


// ------------------------------------------
// Settings elements
// ------------------------------------------

const exportBackupButton =
  document.getElementById(
    "exportBackupButton"
  );


const importBackupButton =
  document.getElementById(
    "importBackupButton"
  );


const importBackupInput =
  document.getElementById(
    "importBackupInput"
  );


// ------------------------------------------
// Modal elements
// ------------------------------------------

const modalOverlay =
  document.getElementById(
    "modalOverlay"
  );


const modalTitle =
  document.getElementById(
    "modalTitle"
  );


const modalFields =
  document.getElementById(
    "modalFields"
  );


const modalMessage =
  document.getElementById(
    "modalMessage"
  );


const modalCancelButton =
  document.getElementById(
    "modalCancelButton"
  );


const modalConfirmButton =
  document.getElementById(
    "modalConfirmButton"
  );


let modalConfirmAction =
  null;


// ------------------------------------------
// Save helpers
// ------------------------------------------

function saveCategories() {

  localStorage.setItem(
    "financeCategories",
    JSON.stringify(
      categories
    )
  );
}


function saveOverallBudget() {

  localStorage.setItem(
    "overallMonthlyBudget",
    overallMonthlyBudget
  );
}


// ------------------------------------------
// Calculations
// ------------------------------------------

function calculateSpent(
  category
) {

  return category.transactions.reduce(
    function (
      total,
      transaction
    ) {

      return (
        total +
        transaction.amount
      );
    },
    0
  );
}


function calculateRemaining(
  category
) {

  return (
    category.budget -
    calculateSpent(
      category
    )
  );
}


// ------------------------------------------
// Navigation
// ------------------------------------------

function hideAllViews() {

  dashboardView.classList.add(
    "hidden-view"
  );


  categoriesView.classList.add(
    "hidden-view"
  );


  historyView.classList.add(
    "hidden-view"
  );


  settingsView.classList.add(
    "hidden-view"
  );


  dashboardNavButton.classList.remove(
    "active"
  );


  categoriesNavButton.classList.remove(
    "active"
  );


  historyNavButton.classList.remove(
    "active"
  );


  settingsNavButton.classList.remove(
    "active"
  );
}


function showDashboard() {

  hideAllViews();


  dashboardView.classList.remove(
    "hidden-view"
  );


  dashboardNavButton.classList.add(
    "active"
  );


  renderDashboard();
}


function showCategories() {

  hideAllViews();


  categoriesView.classList.remove(
    "hidden-view"
  );


  categoriesNavButton.classList.add(
    "active"
  );
}


function showHistory() {

  hideAllViews();


  historyView.classList.remove(
    "hidden-view"
  );


  historyNavButton.classList.add(
    "active"
  );


  renderHistory();
}


function showSettings() {

  hideAllViews();


  settingsView.classList.remove(
    "hidden-view"
  );


  settingsNavButton.classList.add(
    "active"
  );
}


dashboardNavButton.addEventListener(
  "click",
  showDashboard
);


categoriesNavButton.addEventListener(
  "click",
  showCategories
);


historyNavButton.addEventListener(
  "click",
  showHistory
);


settingsNavButton.addEventListener(
  "click",
  showSettings
);


// ------------------------------------------
// Dashboard
// ------------------------------------------

function renderDashboard() {

  let totalBudget =
    0;


  let totalSpent =
    0;


  categories.forEach(
    function (category) {

      totalBudget +=
        category.budget;


      totalSpent +=
        calculateSpent(
          category
        );
    }
  );


  const totalRemaining =
    totalBudget -
    totalSpent;


  totalBudgetDisplay.textContent =
    `$${totalBudget.toFixed(2)}`;


  totalSpentDisplay.textContent =
    `$${totalSpent.toFixed(2)}`;


  totalRemainingDisplay.textContent =
    `$${totalRemaining.toFixed(2)}`;


  // ------------------------------------------
  // Overall Monthly Budget
  // ------------------------------------------

  if (
    overallMonthlyBudget > 0
  ) {

    const overallRemaining =
      overallMonthlyBudget -
      totalSpent;


    const isOverallOverBudget =
      overallRemaining < 0;


    const percentageUsed =
      (
        totalSpent /
        overallMonthlyBudget
      ) * 100;


    const progressWidth =
      Math.min(
        percentageUsed,
        100
      );


    overallBudgetAmount.textContent =
      `$${totalSpent.toFixed(2)} / ` +
      `$${overallMonthlyBudget.toFixed(2)}`;


    overallBudgetDetails.innerHTML = `
      ${percentageUsed.toFixed(1)}% used
      <br>
      $${overallRemaining.toFixed(2)} remaining
    `;


    overallProgressBar.style.width =
      `${progressWidth}%`;


    overallProgressBar
      .classList
      .toggle(
        "over-budget-bar",
        isOverallOverBudget
      );


    overallBudgetAmount
      .classList
      .toggle(
        "over-budget",
        isOverallOverBudget
      );


    overallBudgetDetails
      .classList
      .toggle(
        "over-budget",
        isOverallOverBudget
      );

  } else {

    overallBudgetAmount.textContent =
      "Not Set";


    overallBudgetDetails.textContent =
      "Set your monthly budget to begin tracking.";


    overallProgressBar.style.width =
      "0%";


    overallProgressBar
      .classList
      .remove(
        "over-budget-bar"
      );


    overallBudgetAmount
      .classList
      .remove(
        "over-budget"
      );


    overallBudgetDetails
      .classList
      .remove(
        "over-budget"
      );
  }


  // ------------------------------------------
  // Category Summary
  // ------------------------------------------

  dashboardCategoryContainer.innerHTML =
    "";


  if (
    categories.length === 0
  ) {

    dashboardCategoryContainer.innerHTML = `
      <p class="dashboard-empty">
        No categories created yet.
      </p>
    `;


    return;
  }


  categories.forEach(
    function (category) {

      const spent =
        calculateSpent(
          category
        );


      const remaining =
        calculateRemaining(
          category
        );


      const isOverBudget =
        remaining < 0;


      let percentage =
        0;


      if (
        category.budget > 0
      ) {

        percentage =
          (
            spent /
            category.budget
          ) * 100;
      }


      const progressWidth =
        Math.min(
          percentage,
          100
        );


      const summaryItem =
        document.createElement(
          "div"
        );


      summaryItem.classList.add(
        "dashboard-category-item"
      );


      summaryItem.innerHTML = `

        <div
          class="dashboard-category-header"
        >

          <p
            class="dashboard-category-name"
          >
            ${category.name}
          </p>


          <p
            class="dashboard-category-remaining
            ${isOverBudget ? "over-budget" : ""}"
          >
            $${remaining.toFixed(2)}
            remaining
          </p>

        </div>


        <p
          class="dashboard-category-details"
        >
          $${spent.toFixed(2)}
          spent of
          $${category.budget.toFixed(2)}
        </p>


        <div class="progress-track">

          <div
            class="progress-bar
            ${isOverBudget ? "over-budget-bar" : ""}"
            style="width: ${progressWidth}%"
          ></div>

        </div>
      `;


      dashboardCategoryContainer
        .appendChild(
          summaryItem
        );
    }
  );
}


// ------------------------------------------
// Edit Overall Monthly Budget
// ------------------------------------------

function editOverallBudget() {

  openModal({

    title:
      "Overall Monthly Budget",


    fields: `

      <label
        for="modalOverallBudget"
      >
        Monthly Spending Limit
      </label>


      <input
        type="number"
        id="modalOverallBudget"
        placeholder="Input monthly budget"
        step="0.01"
        min="0"
        value="${
          overallMonthlyBudget > 0
            ? overallMonthlyBudget
            : ""
        }"
      >
    `,


    confirmText:
      "Save",


    onConfirm:
      function () {

        const budgetInput =
          document.getElementById(
            "modalOverallBudget"
          );


        const budget =
          Number(
            budgetInput.value
          );


        if (
          !Number.isFinite(
            budget
          ) ||
          budget <= 0
        ) {

          return;
        }


        overallMonthlyBudget =
          budget;


        saveOverallBudget();


        closeModal();


        renderDashboard();
      }
  });
}


editOverallBudgetButton
  .addEventListener(
    "click",
    editOverallBudget
  );


// ------------------------------------------
// History
// ------------------------------------------

function renderHistory() {

  const allTransactions =
    [];


  categories.forEach(
    function (category) {

      category.transactions.forEach(
        function (
          transaction
        ) {

          allTransactions.push({

            categoryId:
              category.id,


            categoryName:
              category.name,


            transactionId:
              transaction.id,


            amount:
              transaction.amount,


            note:
              transaction.note,


            date:
              transaction.date

          });
        }
      );
    }
  );


  allTransactions.sort(
    function (
      a,
      b
    ) {

      return (
        new Date(
          b.date
        ) -
        new Date(
          a.date
        )
      );
    }
  );


  const total =
    allTransactions.reduce(
      function (
        sum,
        transaction
      ) {

        return (
          sum +
          transaction.amount
        );
      },
      0
    );


  historyTotal.textContent =
    `$${total.toFixed(2)} spent`;


  historyContainer.innerHTML =
    "";


  if (
    allTransactions.length === 0
  ) {

    historyContainer.innerHTML = `
      <p class="history-empty">
        No transactions yet.
      </p>
    `;


    return;
  }


  allTransactions.forEach(
    function (
      transaction
    ) {

      const date =
        new Date(
          transaction.date
        );


      const formattedDate =
        date.toLocaleDateString();


      const note =
        transaction.note === ""
          ? "No description"
          : transaction.note;


      const item =
        document.createElement(
          "div"
        );


      item.classList.add(
        "history-item"
      );


      item.innerHTML = `

        <div class="history-info">

          <p class="history-note">
            ${note}
          </p>


          <p class="history-meta">

            <span
              class="history-category"
            >
              ${transaction.categoryName}
            </span>

            • ${formattedDate}

          </p>

        </div>


        <div class="history-right">

          <div class="history-amount">
            -$${transaction.amount.toFixed(2)}
          </div>


          <div class="history-actions">

            <button
              class="history-edit-button"
              data-category-id="${transaction.categoryId}"
              data-transaction-id="${transaction.transactionId}"
            >
              Edit
            </button>


            <button
              class="history-delete-button"
              data-category-id="${transaction.categoryId}"
              data-transaction-id="${transaction.transactionId}"
            >
              Delete
            </button>

          </div>

        </div>
      `;


      historyContainer
        .appendChild(
          item
        );
    }
  );


  attachHistoryListeners();
}


// ------------------------------------------
// History Button Listeners
// ------------------------------------------

function attachHistoryListeners() {

  document
    .querySelectorAll(
      ".history-edit-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            editTransaction(

              Number(
                button.dataset.categoryId
              ),

              Number(
                button.dataset.transactionId
              )
            );
          }
        );
      }
    );


  document
    .querySelectorAll(
      ".history-delete-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            deleteTransaction(

              Number(
                button.dataset.categoryId
              ),

              Number(
                button.dataset.transactionId
              )
            );
          }
        );
      }
    );
}


// ------------------------------------------
// Modal Helpers
// ------------------------------------------

function openModal(
  options
) {

  modalTitle.textContent =
    options.title || "";


  modalFields.innerHTML =
    options.fields || "";


  modalMessage.textContent =
    options.message || "";


  modalConfirmButton.textContent =
    options.confirmText || "Save";


  modalConfirmAction =
    options.onConfirm || null;


  modalOverlay
    .classList
    .remove(
      "hidden"
    );


  const firstInput =
    modalFields.querySelector(
      "input"
    );


  if (
    firstInput
  ) {

    firstInput.focus();
  }
}


function closeModal() {

  modalOverlay
    .classList
    .add(
      "hidden"
    );


  modalFields.innerHTML =
    "";


  modalMessage.textContent =
    "";


  modalConfirmAction =
    null;
}


modalCancelButton
  .addEventListener(
    "click",
    closeModal
  );


modalConfirmButton
  .addEventListener(
    "click",
    function () {

      if (
        modalConfirmAction
      ) {

        modalConfirmAction();
      }
    }
  );


modalOverlay
  .addEventListener(
    "click",
    function (
      event
    ) {

      if (
        event.target ===
        modalOverlay
      ) {

        closeModal();
      }
    }
  );


document
  .addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        event.key ===
          "Escape" &&
        !modalOverlay
          .classList
          .contains(
            "hidden"
          )
      ) {

        closeModal();
      }
    }
  );


// ------------------------------------------
// Render Categories
// ------------------------------------------

function renderCategories() {

  categoryContainer.innerHTML =
    "";


  categories.forEach(
    function (
      category
    ) {

      const remaining =
        calculateRemaining(
          category
        );


      const isOverBudget =
        remaining < 0;


      const card =
        document.createElement(
          "section"
        );


      card.classList.add(
        "category-card"
      );


      let transactionHistoryHTML =
        "";


      if (
        category.transactions.length ===
        0
      ) {

        transactionHistoryHTML = `
          <p class="no-transactions">
            No transactions yet.
          </p>
        `;

      } else {

        transactionHistoryHTML =
          category.transactions
            .slice()
            .reverse()
            .map(
              function (
                transaction
              ) {

                const transactionDate =
                  new Date(
                    transaction.date
                  );


                const formattedDate =
                  transactionDate
                    .toLocaleDateString();


                const note =
                  transaction.note === ""
                    ? "No description"
                    : transaction.note;


                return `

                  <div
                    class="transaction-item"
                  >

                    <div
                      class="transaction-info"
                    >

                      <p
                        class="transaction-note-display"
                      >
                        ${note}
                      </p>


                      <p
                        class="transaction-date"
                      >
                        ${formattedDate}
                      </p>

                    </div>


                    <div
                      class="transaction-right"
                    >

                      <div
                        class="transaction-amount"
                      >
                        -$${transaction.amount.toFixed(2)}
                      </div>


                      <div
                        class="transaction-actions"
                      >

                        <button
                          class="edit-transaction-button"
                          data-category-id="${category.id}"
                          data-transaction-id="${transaction.id}"
                        >
                          Edit
                        </button>


                        <button
                          class="delete-transaction-button"
                          data-category-id="${category.id}"
                          data-transaction-id="${transaction.id}"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                `;
              }
            )
            .join("");
      }


      card.innerHTML = `

        <div
          class="category-header"
        >

          <h2>
            ${category.name}
          </h2>


          <div
            class="category-actions"
          >

            <button
              class="edit-category-button"
              data-category-id="${category.id}"
            >
              Edit
            </button>


            <button
              class="delete-category-button"
              data-category-id="${category.id}"
            >
              Delete
            </button>

          </div>

        </div>


        <p class="description">
          ${category.description}
        </p>


        <p>
          Monthly Budget:
          $${category.budget.toFixed(2)}
        </p>


        <p
          class="remaining
          ${isOverBudget ? "over-budget" : ""}"
        >
          Remaining:
          $${remaining.toFixed(2)}
        </p>


        <label
          for="transaction-${category.id}"
        >
          Transaction Value
        </label>


        <input
          type="number"
          id="transaction-${category.id}"
          class="transaction-input"
          placeholder="Transaction value"
          step="0.01"
          min="0"
        >


        <label
          for="transaction-note-${category.id}"
        >
          Transaction Description
        </label>


        <input
          type="text"
          id="transaction-note-${category.id}"
          class="transaction-note"
          placeholder="What was this purchase?"
        >


        <button
          class="transaction-button"
          data-category-id="${category.id}"
        >
          Add Transaction
        </button>


        <div
          class="transaction-history"
        >

          <h3>
            Recent Transactions
          </h3>

          ${transactionHistoryHTML}

        </div>
      `;


      categoryContainer
        .appendChild(
          card
        );
    }
  );


  attachTransactionListeners();

  attachEditTransactionListeners();

  attachDeleteTransactionListeners();

  attachEditCategoryListeners();

  attachDeleteCategoryListeners();


  renderDashboard();

  renderHistory();
}


// ------------------------------------------
// Add Transaction
// ------------------------------------------

function addTransaction(
  categoryId
) {

  const category =
    categories.find(
      function (
        category
      ) {

        return (
          category.id ===
          categoryId
        );
      }
    );


  if (
    !category
  ) {

    return;
  }


  const transactionInput =
    document.getElementById(
      `transaction-${categoryId}`
    );


  const noteInput =
    document.getElementById(
      `transaction-note-${categoryId}`
    );


  const amount =
    Number(
      transactionInput.value
    );


  if (
    transactionInput.value === "" ||
    !Number.isFinite(
      amount
    ) ||
    amount <= 0
  ) {

    return;
  }


  category.transactions.push({

    id:
      Date.now(),


    amount:
      amount,


    note:
      noteInput.value.trim(),


    date:
      new Date()

  });


  saveCategories();


  renderCategories();
}


// ------------------------------------------
// Transaction Listeners
// ------------------------------------------

function attachTransactionListeners() {

  document
    .querySelectorAll(
      ".transaction-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            addTransaction(
              Number(
                button.dataset.categoryId
              )
            );
          }
        );
      }
    );


  document
    .querySelectorAll(
      ".transaction-input"
    )
    .forEach(
      function (
        input
      ) {

        input.addEventListener(
          "keydown",
          function (
            event
          ) {

            if (
              event.key ===
              "Enter"
            ) {

              addTransaction(
                Number(
                  input.id.replace(
                    "transaction-",
                    ""
                  )
                )
              );
            }
          }
        );
      }
    );


  document
    .querySelectorAll(
      ".transaction-note"
    )
    .forEach(
      function (
        input
      ) {

        input.addEventListener(
          "keydown",
          function (
            event
          ) {

            if (
              event.key ===
              "Enter"
            ) {

              addTransaction(
                Number(
                  input.id.replace(
                    "transaction-note-",
                    ""
                  )
                )
              );
            }
          }
        );
      }
    );
}


// ------------------------------------------
// Edit Transaction
// ------------------------------------------

function attachEditTransactionListeners() {

  document
    .querySelectorAll(
      ".edit-transaction-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            editTransaction(

              Number(
                button.dataset.categoryId
              ),

              Number(
                button.dataset.transactionId
              )
            );
          }
        );
      }
    );
}


function editTransaction(
  categoryId,
  transactionId
) {

  const category =
    categories.find(
      function (
        category
      ) {

        return (
          category.id ===
          categoryId
        );
      }
    );


  if (
    !category
  ) {

    return;
  }


  const transaction =
    category.transactions.find(
      function (
        transaction
      ) {

        return (
          transaction.id ===
          transactionId
        );
      }
    );


  if (
    !transaction
  ) {

    return;
  }


  openModal({

    title:
      "Edit Transaction",


    fields: `

      <label
        for="modalTransactionAmount"
      >
        Transaction Amount
      </label>


      <input
        type="number"
        id="modalTransactionAmount"
        step="0.01"
        min="0"
        value="${transaction.amount}"
      >


      <label
        for="modalTransactionNote"
      >
        Description
      </label>


      <input
        type="text"
        id="modalTransactionNote"
        value="${transaction.note}"
      >
    `,


    confirmText:
      "Save",


    onConfirm:
      function () {

        const amountInput =
          document.getElementById(
            "modalTransactionAmount"
          );


        const noteInput =
          document.getElementById(
            "modalTransactionNote"
          );


        const amount =
          Number(
            amountInput.value
          );


        if (
          !Number.isFinite(
            amount
          ) ||
          amount <= 0
        ) {

          return;
        }


        transaction.amount =
          amount;


        transaction.note =
          noteInput.value.trim();


        saveCategories();


        closeModal();


        renderCategories();
      }
  });
}


// ------------------------------------------
// Delete Transaction
// ------------------------------------------

function attachDeleteTransactionListeners() {

  document
    .querySelectorAll(
      ".delete-transaction-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            deleteTransaction(

              Number(
                button.dataset.categoryId
              ),

              Number(
                button.dataset.transactionId
              )
            );
          }
        );
      }
    );
}


function deleteTransaction(
  categoryId,
  transactionId
) {

  const category =
    categories.find(
      function (
        category
      ) {

        return (
          category.id ===
          categoryId
        );
      }
    );


  if (
    !category
  ) {

    return;
  }


  const transaction =
    category.transactions.find(
      function (
        transaction
      ) {

        return (
          transaction.id ===
          transactionId
        );
      }
    );


  if (
    !transaction
  ) {

    return;
  }


  openModal({

    title:
      "Delete Transaction",


    message:
      `Delete the $${transaction.amount.toFixed(2)} transaction?`,


    confirmText:
      "Delete",


    onConfirm:
      function () {

        category.transactions =
          category.transactions.filter(
            function (
              transaction
            ) {

              return (
                transaction.id !==
                transactionId
              );
            }
          );


        saveCategories();


        closeModal();


        renderCategories();
      }
  });
}


// ------------------------------------------
// Edit Category
// ------------------------------------------

function attachEditCategoryListeners() {

  document
    .querySelectorAll(
      ".edit-category-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            editCategory(
              Number(
                button.dataset.categoryId
              )
            );
          }
        );
      }
    );
}


function editCategory(
  categoryId
) {

  const category =
    categories.find(
      function (
        category
      ) {

        return (
          category.id ===
          categoryId
        );
      }
    );


  if (
    !category
  ) {

    return;
  }


  openModal({

    title:
      "Edit Category",


    fields: `

      <label
        for="modalCategoryName"
      >
        Category Name
      </label>


      <input
        type="text"
        id="modalCategoryName"
        value="${category.name}"
      >


      <label
        for="modalCategoryDescription"
      >
        Description
      </label>


      <input
        type="text"
        id="modalCategoryDescription"
        value="${category.description}"
      >


      <label
        for="modalCategoryBudget"
      >
        Monthly Budget
      </label>


      <input
        type="number"
        id="modalCategoryBudget"
        step="0.01"
        min="0"
        value="${category.budget}"
      >
    `,


    confirmText:
      "Save",


    onConfirm:
      function () {

        const nameInput =
          document.getElementById(
            "modalCategoryName"
          );


        const descriptionInput =
          document.getElementById(
            "modalCategoryDescription"
          );


        const budgetInput =
          document.getElementById(
            "modalCategoryBudget"
          );


        const name =
          nameInput.value.trim();


        const budget =
          Number(
            budgetInput.value
          );


        if (
          name === "" ||
          !Number.isFinite(
            budget
          ) ||
          budget <= 0
        ) {

          return;
        }


        category.name =
          name;


        category.description =
          descriptionInput
            .value
            .trim();


        category.budget =
          budget;


        saveCategories();


        closeModal();


        renderCategories();
      }
  });
}


// ------------------------------------------
// Delete Category
// ------------------------------------------

function attachDeleteCategoryListeners() {

  document
    .querySelectorAll(
      ".delete-category-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            deleteCategory(
              Number(
                button.dataset.categoryId
              )
            );
          }
        );
      }
    );
}


function deleteCategory(
  categoryId
) {

  const category =
    categories.find(
      function (
        category
      ) {

        return (
          category.id ===
          categoryId
        );
      }
    );


  if (
    !category
  ) {

    return;
  }


  const transactionCount =
    category.transactions.length;


  openModal({

    title:
      "Delete Category",


    message:
      `Delete "${category.name}"? ` +
      `This will also remove ${transactionCount} transaction(s).`,


    confirmText:
      "Delete",


    onConfirm:
      function () {

        categories =
          categories.filter(
            function (
              category
            ) {

              return (
                category.id !==
                categoryId
              );
            }
          );


        saveCategories();


        closeModal();


        renderCategories();
      }
  });
}


// ------------------------------------------
// Create Category
// ------------------------------------------

function createCategory() {

  const name =
    categoryNameInput
      .value
      .trim();


  const description =
    categoryDescriptionInput
      .value
      .trim();


  const budget =
    Number(
      categoryBudgetInput.value
    );


  if (
    name === "" ||
    categoryBudgetInput.value === "" ||
    !Number.isFinite(
      budget
    ) ||
    budget <= 0
  ) {

    return;
  }


  categories.push({

    id:
      Date.now(),


    name:
      name,


    description:
      description,


    budget:
      budget,


    transactions:
      []

  });


  saveCategories();


  categoryNameInput.value =
    "";


  categoryDescriptionInput.value =
    "";


  categoryBudgetInput.value =
    "";


  renderCategories();
}


createCategoryButton
  .addEventListener(
    "click",
    createCategory
  );


categoryBudgetInput
  .addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        event.key ===
        "Enter"
      ) {

        createCategory();
      }
    }
  );


// ------------------------------------------
// Export Backup
// ------------------------------------------

function exportBackup() {

  const backupData = {

    version:
      1,


    exportDate:
      new Date()
        .toISOString(),


    overallMonthlyBudget:
      overallMonthlyBudget,


    categories:
      categories

  };


  const backupJSON =
    JSON.stringify(
      backupData,
      null,
      2
    );


  const blob =
    new Blob(
      [
        backupJSON
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  link.href =
    url;


  link.download =
    `finance-backup-${today}.json`;


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );
}


exportBackupButton
  .addEventListener(
    "click",
    exportBackup
  );


// ------------------------------------------
// Import Backup
// ------------------------------------------

function importBackup() {

  const file =
    importBackupInput.files[0];


  if (
    !file
  ) {

    openModal({

      title:
        "Import Backup",


      message:
        "Please select a backup file first.",


      confirmText:
        "OK",


      onConfirm:
        closeModal

    });


    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function (
      event
    ) {

      try {

        const backupData =
          JSON.parse(
            event.target.result
          );


        // Basic validation

        if (
          !backupData ||
          !Array.isArray(
            backupData.categories
          ) ||
          typeof
            backupData.overallMonthlyBudget !==
            "number"
        ) {

          throw new Error(
            "Invalid backup file"
          );
        }


        openModal({

          title:
            "Import Backup",


          message:
            "Importing this backup will replace all current finance data on this device.",


          confirmText:
            "Import",


          onConfirm:
            function () {

              categories =
                backupData.categories;


              overallMonthlyBudget =
                backupData.overallMonthlyBudget;


              saveCategories();


              saveOverallBudget();


              closeModal();


              importBackupInput.value =
                "";


              renderCategories();


              showDashboard();
            }

        });

      } catch (
        error
      ) {

        openModal({

          title:
            "Invalid Backup",


          message:
            "This file does not appear to be a valid Finance Tracker backup.",


          confirmText:
            "OK",


          onConfirm:
            closeModal

        });
      }
    };


  reader.readAsText(
    file
  );
}


importBackupButton
  .addEventListener(
    "click",
    importBackup
  );


// ------------------------------------------
// Fix Older Transactions Without IDs
// ------------------------------------------

let transactionsUpdated =
  false;


categories.forEach(
  function (
    category
  ) {

    category.transactions.forEach(
      function (
        transaction
      ) {

        if (
          !transaction.id
        ) {

          transaction.id =
            Date.now() +
            Math.floor(
              Math.random() *
              100000
            );


          transactionsUpdated =
            true;
        }
      }
    );
  }
);


if (
  transactionsUpdated
) {

  saveCategories();
}


// ------------------------------------------
// Initial Render
// ------------------------------------------

renderCategories();


showDashboard();