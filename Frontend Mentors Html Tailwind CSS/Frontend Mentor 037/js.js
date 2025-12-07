    const form = document.getElementById("age-form");
    const submit = document.getElementById("submit");

    const dayInput = document.getElementById("day");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");

    const dayError = document.getElementById("day-error");
    const monthError = document.getElementById("month-error");
    const yearError = document.getElementById("year-error");

    const yearsOutput = document.getElementById("years");
    const monthsOutput = document.getElementById("months");
    const daysOutput = document.getElementById("days");

    function isValidDate(d, m, y) {
      const date = new Date(y, m - 1, d);
      return date.getFullYear() == y && date.getMonth() == m - 1 && date.getDate() == d;
    }

    function calculateAge(birthDate) {
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      return { years, months, days };
    }

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      const day = parseInt(dayInput.value);
      const month = parseInt(monthInput.value);
      const year = parseInt(yearInput.value);

      // Reset errors
      dayError.textContent = "";
      monthError.textContent = "";
      yearError.textContent = "";

      let hasError = false;

      if (isNaN(day) || day < 1 || day > 31) {
        dayError.textContent = "Invalid day";
        hasError = true;
      }

      if (isNaN(month) || month < 1 || month > 12) {
        monthError.textContent = "Invalid month";
        hasError = true;
      }

      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        yearError.textContent = "Invalid year";
        hasError = true;
      }

      if (!hasError && !isValidDate(day, month, year)) {
        dayError.textContent = "Invalid date";
        hasError = true;
      }

      if (!hasError) {
        const birthDate = new Date(year, month - 1, day);
        const age = calculateAge(birthDate);

        yearsOutput.textContent = age.years;
        monthsOutput.textContent = age.months;
        daysOutput.textContent = age.days;
      } else {
        yearsOutput.textContent = "--";
        monthsOutput.textContent = "--";
        daysOutput.textContent = "--";
      }
    });