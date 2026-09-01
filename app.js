// ==========================================
// LOAD DATA
// ==========================================

let categories =
  JSON.parse(
    localStorage.getItem("financeCategories")
  ) || [];

let overallMonthlyBudget =
  Number(
    localStorage.getItem("overallMonthlyBudget")
  ) || 0;


// Transaction lists begin collapsed.

const collapsedCategoryHistories =
  new Set(
    categories.map(
      function (category) {
        return category.id;
      }
    )
  );


// ==========================================
// DATE / MONTH HELPERS
// ==========================================

function getMonthKey(dateValue) {

  const date =
    new Date(dateValue);

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  return `${year}-${month}`;
}


function getCurrentMonthKey() {

  return getMonthKey(
    new Date()
  );
}


function formatMonthLabel(monthKey) {

  const parts =
    monthKey.split("-");

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]) - 1;

  const date =
    new Date(
      year,
      month,
      1
    );

  return date.toLocaleDateString(
    undefined,
    {
      month: "long",
      year: "numeric"
    }
  );
}


function getCurrentMonthLabel() {

  return formatMonthLabel(
    getCurrentMonthKey()
  );
}


// ==========================================
// DOM ELEMENTS
// ==========================================

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


// Navigation

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

const pastMonthsNavButton =
  document.getElementById(
    "pastMonthsNavButton"
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

const pastMonthsView =
  document.getElementById(
    "pastMonthsView"
  );

const settingsView =
  document.getElementById(
    "settingsView"
  );


// Dashboard

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

const currentMonthLabel =
  document.getElementById(
    "currentMonthLabel"
  );


// History

const historyContainer =
  document.getElementById(
    "historyContainer"
  );

const historyTotal =
  document.getElementById(
    "historyTotal"
  );

const historyMonthLabel =
  document.getElementById(
    "historyMonthLabel"
  );


// Past Months

const pastMonthSelect =
  document.getElementById(
    "pastMonthSelect"
  );

const pastMonthSummary =
  document.getElementById(
    "pastMonthSummary"
  );

const pastMonthContainer =
  document.getElementById(
    "pastMonthContainer"
  );

const exportMonthButton =
  document.getElementById(
    "exportMonthButton"
  );


// Settings

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


// Modal

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


// ==========================================
// SAVE HELPERS
// ==========================================

function saveCategories() {

  localStorage.setItem(
    "financeCategories",
    JSON.stringify(categories)
  );
}


function saveOverallBudget() {

  localStorage.setItem(
    "overallMonthlyBudget",
    overallMonthlyBudget
  );
}


// ==========================================
// TRANSACTION HELPERS
// ==========================================

function getTransactionsForMonth(
  category,
  monthKey
) {

  return category.transactions.filter(
    function (transaction) {

      return (
        getMonthKey(
          transaction.date
        ) === monthKey
      );
    }
  );
}


function calculateSpentForMonth(
  category,
  monthKey
) {

  return getTransactionsForMonth(
    category,
    monthKey
  ).reduce(
    function (
      total,
      transaction
    ) {

      return (
        total +
        Number(transaction.amount)
      );
    },
    0
  );
}


function calculateCurrentMonthSpent(
  category
) {

  return calculateSpentForMonth(
    category,
    getCurrentMonthKey()
  );
}


function calculateCurrentRemaining(
  category
) {

  return (
    category.budget -
    calculateCurrentMonthSpent(
      category
    )
  );
}


// ==========================================
// NAVIGATION
// ==========================================

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

  pastMonthsView.classList.add(
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

  pastMonthsNavButton.classList.remove(
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


function showPastMonths() {

  hideAllViews();

  pastMonthsView.classList.remove(
    "hidden-view"
  );

  pastMonthsNavButton.classList.add(
    "active"
  );

  renderPastMonths();
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

pastMonthsNavButton.addEventListener(
  "click",
  showPastMonths
);

settingsNavButton.addEventListener(
  "click",
  showSettings
);


// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {

  const currentMonth =
    getCurrentMonthKey();


  currentMonthLabel.textContent =
    getCurrentMonthLabel();


  let totalBudget =
    0;

  let totalSpent =
    0;


  categories.forEach(
    function (category) {

      totalBudget +=
        Number(category.budget);

      totalSpent +=
        calculateSpentForMonth(
          category,
          currentMonth
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


  totalRemainingDisplay.classList.toggle(
    "over-budget",
    totalRemaining < 0
  );


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


    overallProgressBar.classList.toggle(
      "over-budget-bar",
      isOverallOverBudget
    );

    overallBudgetAmount.classList.toggle(
      "over-budget",
      isOverallOverBudget
    );

    overallBudgetDetails.classList.toggle(
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

    overallProgressBar.classList.remove(
      "over-budget-bar"
    );

    overallBudgetAmount.classList.remove(
      "over-budget"
    );

    overallBudgetDetails.classList.remove(
      "over-budget"
    );
  }


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
        calculateSpentForMonth(
          category,
          currentMonth
        );

      const remaining =
        category.budget -
        spent;

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


      dashboardCategoryContainer.appendChild(
        summaryItem
      );
    }
  );
}


// ==========================================
// OVERALL BUDGET
// ==========================================

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
          !Number.isFinite(budget) ||
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


editOverallBudgetButton.addEventListener(
  "click",
  editOverallBudget
);


// ==========================================
// CURRENT MONTH HISTORY
// ==========================================

function getAllTransactionsForMonth(
  monthKey
) {

  const transactions =
    [];


  categories.forEach(
    function (category) {

      category.transactions.forEach(
        function (transaction) {

          if (
            getMonthKey(
              transaction.date
            ) === monthKey
          ) {

            transactions.push({

              categoryId:
                category.id,

              categoryName:
                category.name,

              transactionId:
                transaction.id,

              amount:
                Number(
                  transaction.amount
                ),

              note:
                transaction.note,

              date:
                transaction.date
            });
          }
        }
      );
    }
  );


  transactions.sort(
    function (a, b) {

      return (
        new Date(b.date) -
        new Date(a.date)
      );
    }
  );


  return transactions;
}


function renderHistory() {

  const currentMonth =
    getCurrentMonthKey();

  const allTransactions =
    getAllTransactionsForMonth(
      currentMonth
    );


  historyMonthLabel.textContent =
    getCurrentMonthLabel();


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
        No transactions this month.
      </p>
    `;

    return;
  }


  allTransactions.forEach(
    function (transaction) {

      historyContainer.appendChild(
        createHistoryItem(
          transaction,
          true
        )
      );
    }
  );


  attachHistoryListeners();
}


// ==========================================
// HISTORY ITEM CREATOR
// ==========================================

function createHistoryItem(
  transaction,
  allowEditing
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


  let actionsHTML =
    "";


  if (
    allowEditing
  ) {

    actionsHTML = `

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
    `;
  }


  item.innerHTML = `

    <div class="history-info">

      <p class="history-note">
        ${note}
      </p>

      <p class="history-meta">

        <span class="history-category">
          ${transaction.categoryName}
        </span>

        • ${formattedDate}

      </p>

    </div>

    <div class="history-right">

      <div class="history-amount">
        -$${transaction.amount.toFixed(2)}
      </div>

      ${actionsHTML}

    </div>
  `;


  return item;
}


// ==========================================
// HISTORY BUTTONS
// ==========================================

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


// ==========================================
// PAST MONTHS
// ==========================================

function getPastMonthKeys() {

  const currentMonth =
    getCurrentMonthKey();

  const monthSet =
    new Set();


  categories.forEach(
    function (category) {

      category.transactions.forEach(
        function (transaction) {

          const monthKey =
            getMonthKey(
              transaction.date
            );


          if (
            monthKey !==
            currentMonth
          ) {

            monthSet.add(
              monthKey
            );
          }
        }
      );
    }
  );


  return Array.from(
    monthSet
  ).sort(
    function (a, b) {

      return b.localeCompare(a);
    }
  );
}


function renderPastMonths() {

  const monthKeys =
    getPastMonthKeys();


  pastMonthSelect.innerHTML =
    "";


  if (
    monthKeys.length === 0
  ) {

    pastMonthSelect.innerHTML = `
      <option value="">
        No past months available
      </option>
    `;

    pastMonthSelect.disabled =
      true;

    exportMonthButton.disabled =
      true;

    pastMonthSummary.innerHTML = `
      <p>
        Past monthly statements will appear here once
        transactions exist from an earlier month.
      </p>
    `;

    pastMonthContainer.innerHTML =
      "";

    return;
  }


  pastMonthSelect.disabled =
    false;

  exportMonthButton.disabled =
    false;


  monthKeys.forEach(
    function (monthKey) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        monthKey;

      option.textContent =
        formatMonthLabel(
          monthKey
        );

      pastMonthSelect.appendChild(
        option
      );
    }
  );


  renderSelectedPastMonth();
}


function renderSelectedPastMonth() {

  const selectedMonth =
    pastMonthSelect.value;


  if (
    !selectedMonth
  ) {

    return;
  }


  const transactions =
    getAllTransactionsForMonth(
      selectedMonth
    );


  const total =
    transactions.reduce(
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


  pastMonthSummary.innerHTML = `

    <h3>
      ${formatMonthLabel(selectedMonth)}
    </h3>

    <p>
      ${transactions.length}
      transaction${transactions.length === 1 ? "" : "s"}
    </p>

    <p>
      Total Spent:
      <strong>
        $${total.toFixed(2)}
      </strong>
    </p>
  `;


  pastMonthContainer.innerHTML =
    "";


  if (
    transactions.length === 0
  ) {

    pastMonthContainer.innerHTML = `
      <p class="history-empty">
        No transactions found.
      </p>
    `;

    return;
  }


  transactions.forEach(
    function (transaction) {

      pastMonthContainer.appendChild(
        createHistoryItem(
          transaction,
          false
        )
      );
    }
  );
}


pastMonthSelect.addEventListener(
  "change",
  renderSelectedPastMonth
);


// ==========================================
// EXPORT SELECTED MONTH AS CSV
// ==========================================

function escapeCSV(
  value
) {

  const stringValue =
    String(
      value ?? ""
    );


  return (
    '"' +
    stringValue.replace(
      /"/g,
      '""'
    ) +
    '"'
  );
}


function exportSelectedMonth() {

  const selectedMonth =
    pastMonthSelect.value;


  if (
    !selectedMonth
  ) {

    return;
  }


  const transactions =
    getAllTransactionsForMonth(
      selectedMonth
    );


  if (
    transactions.length === 0
  ) {

    return;
  }


  const rows =
    [
      [
        "Date",
        "Category",
        "Description",
        "Amount"
      ]
    ];


  transactions.forEach(
    function (transaction) {

      rows.push([
        new Date(
          transaction.date
        ).toLocaleDateString(),

        transaction.categoryName,

        transaction.note ||
          "No description",

        transaction.amount.toFixed(2)
      ]);
    }
  );


  const total =
    transactions.reduce(
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


  rows.push([
    "",
    "",
    "Total",
    total.toFixed(2)
  ]);


  const csv =
    rows
      .map(
        function (row) {

          return row
            .map(escapeCSV)
            .join(",");
        }
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8"
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


  link.href =
    url;


  link.download =
    `finance-${selectedMonth}.csv`;


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


exportMonthButton.addEventListener(
  "click",
  exportSelectedMonth
);


// ==========================================
// MODAL
// ==========================================

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

  modalOverlay.classList.remove(
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

  modalOverlay.classList.add(
    "hidden"
  );

  modalFields.innerHTML =
    "";

  modalMessage.textContent =
    "";

  modalConfirmAction =
    null;
}


modalCancelButton.addEventListener(
  "click",
  closeModal
);


modalConfirmButton.addEventListener(
  "click",
  function () {

    if (
      modalConfirmAction
    ) {

      modalConfirmAction();
    }
  }
);


modalOverlay.addEventListener(
  "click",
  function (event) {

    if (
      event.target ===
      modalOverlay
    ) {

      closeModal();
    }
  }
);


document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      !modalOverlay.classList.contains(
        "hidden"
      )
    ) {

      closeModal();
    }
  }
);


// ==========================================
// CATEGORIES
// ==========================================

function renderCategories() {

  categoryContainer.innerHTML =
    "";


  const currentMonth =
    getCurrentMonthKey();


  categories.forEach(
    function (category) {

      const remaining =
        calculateCurrentRemaining(
          category
        );

      const isOverBudget =
        remaining < 0;

      const isCollapsed =
        collapsedCategoryHistories.has(
          category.id
        );


      const currentTransactions =
        getTransactionsForMonth(
          category,
          currentMonth
        );


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
        currentTransactions.length === 0
      ) {

        transactionHistoryHTML = `
          <p class="no-transactions">
            No transactions this month.
          </p>
        `;

      } else {

        transactionHistoryHTML =
          currentTransactions
            .slice()
            .reverse()
            .map(
              function (transaction) {

                const formattedDate =
                  new Date(
                    transaction.date
                  ).toLocaleDateString();


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
                        -$${Number(transaction.amount).toFixed(2)}
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
          $${Number(category.budget).toFixed(2)}
        </p>


        <p
          class="remaining
          ${isOverBudget ? "over-budget" : ""}"
        >
          Remaining This Month:
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

          <div
            class="transaction-history-header"
          >

            <h3>
              This Month
              (${currentTransactions.length})
            </h3>

            <button
              class="transaction-collapse-button"
              data-category-id="${category.id}"
              type="button"
            >
              ${isCollapsed ? "Show ▼" : "Hide ▲"}
            </button>

          </div>


          <div
            class="transaction-history-list
            ${isCollapsed ? "collapsed" : ""}"
          >

            ${transactionHistoryHTML}

          </div>

        </div>
      `;


      categoryContainer.appendChild(
        card
      );
    }
  );


  attachTransactionListeners();

  attachTransactionCollapseListeners();

  attachEditTransactionListeners();

  attachDeleteTransactionListeners();

  attachEditCategoryListeners();

  attachDeleteCategoryListeners();


  renderDashboard();

  renderHistory();
}


// ==========================================
// COLLAPSE LISTS
// ==========================================

function attachTransactionCollapseListeners() {

  document
    .querySelectorAll(
      ".transaction-collapse-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const categoryId =
              Number(
                button.dataset.categoryId
              );


            if (
              collapsedCategoryHistories.has(
                categoryId
              )
            ) {

              collapsedCategoryHistories.delete(
                categoryId
              );

            } else {

              collapsedCategoryHistories.add(
                categoryId
              );
            }


            renderCategories();
          }
        );
      }
    );
}


// ==========================================
// ADD TRANSACTION
// ==========================================

function addTransaction(
  categoryId
) {

  const category =
    categories.find(
      function (category) {

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
    !Number.isFinite(amount) ||
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
      new Date().toISOString()
  });


  saveCategories();

  renderCategories();
}


// ==========================================
// TRANSACTION INPUT LISTENERS
// ==========================================

function attachTransactionListeners() {

  document
    .querySelectorAll(
      ".transaction-button"
    )
    .forEach(
      function (button) {

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
      function (input) {

        input.addEventListener(
          "keydown",
          function (event) {

            if (
              event.key === "Enter"
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
      function (input) {

        input.addEventListener(
          "keydown",
          function (event) {

            if (
              event.key === "Enter"
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


// ==========================================
// EDIT TRANSACTION
// ==========================================

function attachEditTransactionListeners() {

  document
    .querySelectorAll(
      ".edit-transaction-button"
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
}


function editTransaction(
  categoryId,
  transactionId
) {

  const category =
    categories.find(
      function (category) {

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
      function (transaction) {

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
          !Number.isFinite(amount) ||
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

        renderPastMonths();
      }
  });
}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function attachDeleteTransactionListeners() {

  document
    .querySelectorAll(
      ".delete-transaction-button"
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


function deleteTransaction(
  categoryId,
  transactionId
) {

  const category =
    categories.find(
      function (category) {

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
      function (transaction) {

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
      `Delete the $${Number(transaction.amount).toFixed(2)} transaction?`,

    confirmText:
      "Delete",

    onConfirm:
      function () {

        category.transactions =
          category.transactions.filter(
            function (transaction) {

              return (
                transaction.id !==
                transactionId
              );
            }
          );


        saveCategories();

        closeModal();

        renderCategories();

        renderPastMonths();
      }
  });
}


// ==========================================
// EDIT CATEGORY
// ==========================================

function attachEditCategoryListeners() {

  document
    .querySelectorAll(
      ".edit-category-button"
    )
    .forEach(
      function (button) {

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
      function (category) {

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
          !Number.isFinite(budget) ||
          budget <= 0
        ) {

          return;
        }


        category.name =
          name;

        category.description =
          descriptionInput.value.trim();

        category.budget =
          budget;


        saveCategories();

        closeModal();

        renderCategories();
      }
  });
}


// ==========================================
// DELETE CATEGORY
// ==========================================

function attachDeleteCategoryListeners() {

  document
    .querySelectorAll(
      ".delete-category-button"
    )
    .forEach(
      function (button) {

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
      function (category) {

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
            function (category) {

              return (
                category.id !==
                categoryId
              );
            }
          );


        collapsedCategoryHistories.delete(
          categoryId
        );


        saveCategories();

        closeModal();

        renderCategories();

        renderPastMonths();
      }
  });
}


// ==========================================
// CREATE CATEGORY
// ==========================================

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
    !Number.isFinite(budget) ||
    budget <= 0
  ) {

    return;
  }


  const newCategory = {

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

  };


  categories.push(
    newCategory
  );


  collapsedCategoryHistories.add(
    newCategory.id
  );


  saveCategories();


  categoryNameInput.value =
    "";

  categoryDescriptionInput.value =
    "";

  categoryBudgetInput.value =
    "";


  renderCategories();
}


createCategoryButton.addEventListener(
  "click",
  createCategory
);


categoryBudgetInput.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter"
    ) {

      createCategory();
    }
  }
);


// ==========================================
// BACKUP EXPORT
// ==========================================

function exportBackup() {

  const backupData = {

    version:
      2,

    exportDate:
      new Date().toISOString(),

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
      [backupJSON],
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


exportBackupButton.addEventListener(
  "click",
  exportBackup
);


// ==========================================
// BACKUP IMPORT
// ==========================================

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
    function (event) {

      try {

        const backupData =
          JSON.parse(
            event.target.result
          );


        if (
          !backupData ||
          !Array.isArray(
            backupData.categories
          ) ||
          typeof backupData.overallMonthlyBudget !==
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


              collapsedCategoryHistories.clear();


              categories.forEach(
                function (category) {

                  collapsedCategoryHistories.add(
                    category.id
                  );
                }
              );


              saveCategories();

              saveOverallBudget();

              closeModal();


              importBackupInput.value =
                "";


              renderCategories();

              renderPastMonths();

              showDashboard();
            }
        });

      } catch (error) {

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


importBackupButton.addEventListener(
  "click",
  importBackup
);


// ==========================================
// OLD TRANSACTION MIGRATION
// ==========================================

let transactionsUpdated =
  false;


categories.forEach(
  function (category) {

    if (
      !Array.isArray(
        category.transactions
      )
    ) {

      category.transactions =
        [];

      transactionsUpdated =
        true;
    }


    category.transactions.forEach(
      function (transaction) {

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


// ==========================================
// INITIAL RENDER
// ==========================================

renderCategories();

renderPastMonths();

showDashboard();