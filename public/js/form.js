(function () {
    
    let logoutCheck = document.getElementById('logoutCheck');
    let continueButton = document.getElementById('continueButton');
    let cancelButton = document.getElementById('cancelButton');
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', event => {
        logoutCheck.style.display = "inline-flex";
        continueButton.style.display = "inline-flex";
        cancelButton.style.display = "inline-flex";
    });
  })();