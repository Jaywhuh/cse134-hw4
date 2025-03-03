document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const errorOutput = document.getElementById("error-message");
    const infoOutput = document.getElementById("info-message");
    const formErrors = []; // Stores errors before submission

    // Validate Name Field
    function validateName() {
        const namePattern = /^[a-zA-Z ,.'-]+$/;
        if (nameInput.validity.valueMissing) {
            nameInput.setCustomValidity("Name is required.");
        } else if (!namePattern.test(nameInput.value)) {
            nameInput.setCustomValidity("Invalid character! Use only letters, spaces, commas, periods, apostrophes, and hyphens.");
        } else {
            nameInput.setCustomValidity(""); // Clear error
        }
    }

    // Validate Email Field
    function validateEmail() {
        if (emailInput.validity.valueMissing) {
            emailInput.setCustomValidity("Email is required.");
        } else if (!emailInput.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            emailInput.setCustomValidity("Invalid email format. Example: user@example.com.");
        } else {
            emailInput.setCustomValidity(""); // Clear error when valid
        }
    }

    // Validate Message Field
    function validateMessage() {
        if (messageInput.validity.valueMissing) {
            messageInput.setCustomValidity("Message is required.");
        } else if (messageInput.value.length > 500) {
            messageInput.setCustomValidity("Message exceeds 500 characters.");
        } else {
            messageInput.setCustomValidity("");
        }
    }

    // Show Dynamic Error Messages
    function displayErrors() {
        formErrors.length = 0;
    
        validateName();
        validateEmail();
        validateMessage();
    
        let errorMessages = [];
    
        if (!nameInput.checkValidity()) errorMessages.push(`• ${nameInput.validationMessage}`);
        if (!emailInput.checkValidity()) errorMessages.push(`• ${emailInput.validationMessage}`);
        if (!messageInput.checkValidity()) errorMessages.push(`• ${messageInput.validationMessage}`);
    
        if (errorMessages.length > 0) {
            errorOutput.innerHTML = errorMessages.join("<br>");
            errorOutput.style.opacity = "1"; // Show the message
    
            // Ensure every message fades out after 2 seconds
            setTimeout(() => {
                errorOutput.style.opacity = "0"; 
            }, 2000);
        } else {
            errorOutput.textContent = "";
        }
    }

    // Prevent Invalid Characters (Input Masking)
    nameInput.addEventListener("keypress", function (event) {
        const allowedPattern = /^[a-zA-Z ,.'-]+$/;
        const char = String.fromCharCode(event.keyCode);
        if (!allowedPattern.test(char)) {
            event.preventDefault(); // Block invalid character
            showTemporaryError("Invalid character entered.");
            flashInput(nameInput);
        }
    });

    // Character Countdown for Message Field
    messageInput.addEventListener("input", function () {
        let remaining = 500 - messageInput.value.length;
        infoOutput.textContent = `Characters remaining: ${remaining}`;

        if (remaining <= 50) {
            infoOutput.style.color = "orange";
        } else {
            infoOutput.style.color = "lightblue";
        }
    });

    // Show Error Message Temporarily
    function showTemporaryError(message) {
        errorOutput.textContent = message;
        errorOutput.style.opacity = "1";

        const currentMessage = message;

        setTimeout(() => {
            if (errorOutput.textContent === currentMessage) { // Only fade if no new errors were added
                errorOutput.style.opacity = "0";
            }
        }, 3000);
    }

    // Flash Input Field on Invalid Entry
    function flashInput(input) {
        input.style.borderColor = "red";
        setTimeout(() => {
            input.style.borderColor = "";
        }, 500);
    }

    form.addEventListener("submit", function (event) {
        displayErrors(); // Ensure errors are updated before submission

        // Create or find the hidden input field for form-errors
        let errorField = document.querySelector("input[name='form-errors']");
        if (!errorField) {
            errorField = document.createElement("input");
            errorField.type = "hidden";
            errorField.name = "form-errors";
            form.appendChild(errorField);
        }

        // Store all session errors in the hidden input field
        errorField.value = JSON.stringify(formErrors);

        // Prevent submission if current errors exist
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });
    

    // Validate Form on Input Change
    nameInput.addEventListener("input", displayErrors);
    emailInput.addEventListener("input", displayErrors);
    messageInput.addEventListener("input", displayErrors);
});
